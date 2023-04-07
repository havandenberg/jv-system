const { add, endOfISOWeek, isBefore, startOfISOWeek } = require('date-fns');
const { mergeDeepLeft, sortBy } = require('ramda');

const { gql, gqlClient } = require('../../api');
const { ews, ewsArgs, onError } = require('../../utils/server');
const {
  formatDate,
  isDateGreaterThanOrEqualTo,
  isDateLessThanOrEqualTo,
} = require('../../utils/date');

const VESSEL_CONTROLS = (endDate) => gql`
  query VESSEL_CONTROLS {
    vesselControls(filter: {
      dueDate: {
        lessThanOrEqualTo: ${endDate}
      }
    }) {
      nodes {
        approval1
        approval2
        dateSent
        id
        isLiquidated
        nodeId
        notes1
        notes2
        shipper {
          id
          shipperName
          vesselControlDaysUntilDue
        }
        unpaids {
          nodes {
            id
            invoiceId
            invoice {
              id
              actualShipDate
              amountOwed
              billingCustomer {
                id
                customerName
              }
              truckLoadId
              salesUserCode
              salesUser {
                userCode
                personContact {
                  firstName
                  email
                }
                id
              }
              invoiceId
              orderId
              paidCode
              flag
              conditionCode
              creditCode
            }
            shipperId
            vesselCode
            isApproved
            isUrgent
            notes
          }
        }
        vessel {
          id
          arrivalDate
          dischargeDate
          vesselName
          vesselCode
          country {
            id
            countryName
          }
          warehouse {
            id
            warehouseName
          }
        }
      }
    }
  }
`;

const DEFAULT_VESSEL_CONTROL_DAYS_UNTIL_DUE = 45;

const getVesselControlDueDate = (vessel, shipper) =>
  vessel.dischargeDate
    ? add(new Date(vessel.dischargeDate.replace(/-/g, '/')), {
        days:
          shipper.vesselControlDaysUntilDue ||
          DEFAULT_VESSEL_CONTROL_DAYS_UNTIL_DUE,
      })
    : undefined;

const getUnpaidVesselInputList = (vesselsInput) =>
  sortBy(
    ({ dueDate }) =>
      dueDate ? new Date(dueDate.replace(/-/g, '/')).getTime() : 0,
    Object.values(vesselsInput).map(({ shippers, ...rest }) => ({
      ...rest,
      shippers: sortBy(
        ({ shipperName }) => shipperName,
        Object.values(shippers).map(({ unpaids, ...rest2 }) => ({
          ...rest2,
          unpaids: sortBy(({ invoiceId }) => invoiceId, Object.values(unpaids)),
        })),
      ),
    })),
  );

const getUnpaidsContent = (unpaids, vesselCode, shipperName, baseUrl) =>
  `${unpaids
    .map(
      ({ invoiceId, customerName, flag, isUrgent, truckLoadId }) => `
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      - Invoice #: <a href="${baseUrl}&vesselCode=${vesselCode}&invoiceId=${invoiceId}&unpaidSearch=${shipperName}">${invoiceId}</a> - Load #: <a href="${
        process.env.REACT_APP_CLIENT_URL
      }/inventory/truck-loads/${truckLoadId}">${truckLoadId}</a>
        - ${customerName}
      ${
        isUrgent
          ? '&nbsp;&nbsp;- <span style="color: #E77728;">URGENT</span>'
          : ''
      }
      ${
        flag
          ? '&nbsp;&nbsp;- <span style="color: #FF0000;">Alert: ' +
            flag +
            '</span>'
          : ''
      }<br />`,
    )
    .join('')}`;

const getUnpaidsShipperContent = (shippers, vesselCode, baseUrl) =>
  `${shippers
    .map(
      ({ shipperId, shipperName, unpaids }) => `
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        - Shipper: <a href="${baseUrl}&vesselCode=${vesselCode}&unpaidSearch=${shipperName}">${shipperName} (${shipperId})</a>
        <br />
        ${getUnpaidsContent(unpaids, vesselCode, shipperName, baseUrl)}`,
    )
    .join('')}`;

const getUnpaidsVesselContent = (unpaids, header, baseUrl) =>
  `<p style="font-weight: bold;">${header}</p><br /><br />
    ${
      unpaids.length > 0
        ? unpaids
            .map(
              ({ dueDate, shipDate, vesselName, vesselCode, shippers }) => `
                &nbsp;&nbsp;&nbsp;&nbsp;
                - Vessel: <a href="${baseUrl}&vesselCode=${vesselCode}">${vesselCode} - ${vesselName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
                Due: ${dueDate}&nbsp;&nbsp;&nbsp;&nbsp;
                Shipped on: ${shipDate}
                <br />
                ${getUnpaidsShipperContent(
                  shippers,
                  vesselCode,
                  baseUrl,
                )}<br />`,
            )
            .join('')
        : '&nbsp;&nbsp;&nbsp;&nbsp;None.'
    }`;

const sendUnpaidsNotificationEmails = () => {
  console.log(`\nSending unpaids reminders at: ${new Date().toString()}\n`);

  const startOfWeek = startOfISOWeek(new Date());
  const endOfWeek = endOfISOWeek(new Date());
  const endDate = add(endOfWeek, { weeks: 1 });

  gqlClient
    .request(VESSEL_CONTROLS(`"${formatDate(endDate)}"`))
    .then(async (data) => {
      const vesselControls = (data.vesselControls.nodes || []).filter(
        (vesselControl) =>
          !vesselControl.isLiquidated &&
          vesselControl.vessel.vesselCode !== 'CCC',
      );

      const unpaidRemindersInfo = vesselControls.reduce(
        (acc, vesselControl) => {
          const { shipper, vessel } = vesselControl;
          const vesselCode = vessel?.vesselCode || 'UNK';
          const shipperId = shipper?.id || 'UNK';
          const unpaids = (vesselControl.unpaids.nodes || []).filter(
            (unpaid) =>
              unpaid?.invoice?.paidCode !== 'P' && !unpaid?.isApproved,
          );

          const dueDate =
            vessel && shipper && getVesselControlDueDate(vessel, shipper);
          const isPast = dueDate && isBefore(dueDate, startOfWeek);
          const isCurrent =
            dueDate &&
            isDateGreaterThanOrEqualTo(dueDate, startOfWeek) &&
            isDateLessThanOrEqualTo(dueDate, endOfWeek);

          const vesselKey = isPast
            ? 'pastUnpaids'
            : isCurrent
            ? 'currentUnpaids'
            : 'futureUnpaids';

          const newValues = unpaids.reduce((acc2, unpaid) => {
            const invoice = unpaid?.invoice;
            const salesUserCode = invoice?.salesUser?.userCode || 'UNK';

            return {
              ...acc2,
              [salesUserCode]: {
                ...acc2[salesUserCode],
                userCode: invoice?.salesUser?.userCode || '',
                firstName: invoice?.salesUser?.personContact?.firstName || '',
                email: invoice?.salesUser?.personContact?.email || '',
                [vesselKey]: {
                  ...acc2[salesUserCode]?.[vesselKey],
                  [vesselCode]: {
                    vesselCode,
                    vesselName: vessel?.vesselName || '',
                    dueDate: dueDate ? formatDate(dueDate) : '',
                    shipDate: invoice?.actualShipDate
                      ? formatDate(
                          new Date(invoice?.actualShipDate.replace(/-/g, '/')),
                        )
                      : '',
                    shippers: {
                      ...acc2[salesUserCode]?.[vesselKey]?.[vesselCode]
                        ?.shippers,
                      [shipperId]: {
                        shipperId,
                        shipperName: shipper?.shipperName || '',
                        unpaids: (
                          acc2[salesUserCode]?.[vesselKey]?.[vesselCode]
                            ?.shippers?.[shipperId]?.unpaids || []
                        ).concat({
                          isUrgent: !!unpaid?.isUrgent,
                          invoiceId: invoice?.invoiceId || '',
                          flag: invoice?.flag || '',
                          customerName:
                            invoice?.billingCustomer?.customerName || '',
                          truckLoadId: invoice?.truckLoadId || '',
                        }),
                      },
                    },
                  },
                },
              },
            };
          }, {});

          return mergeDeepLeft(newValues, acc);
        },
        {},
      );

      const unpaidReminders = Object.keys(unpaidRemindersInfo).map(
        (salesUserCode) => {
          const unpaidsBySalesUser = unpaidRemindersInfo[salesUserCode];
          return {
            ...unpaidRemindersInfo[salesUserCode],
            pastUnpaids: unpaidsBySalesUser?.pastUnpaids
              ? getUnpaidVesselInputList(unpaidsBySalesUser.pastUnpaids)
              : [],
            currentUnpaids: unpaidsBySalesUser?.currentUnpaids
              ? getUnpaidVesselInputList(unpaidsBySalesUser.currentUnpaids)
              : [],
            futureUnpaids: unpaidsBySalesUser?.futureUnpaids
              ? getUnpaidVesselInputList(unpaidsBySalesUser.futureUnpaids)
              : [],
          };
        },
      );

      for (const reminder of unpaidReminders) {
        const {
          userCode,
          firstName,
          email,
          pastUnpaids,
          currentUnpaids,
          futureUnpaids,
        } = reminder;
        const baseUrl = `${process.env.REACT_APP_CLIENT_URL}/accounting/unpaids?salesUserCode=${userCode}`;

        await ews
          .run(
            'CreateItem',
            ewsArgs({
              ccRecipients:
                process.env.REACT_APP_IS_PRODUCTION === 'true'
                  ? ['jpaap@jacvandenberg.com', 'ashin@jacvandenberg.com']
                  : [],
              toRecipients:
                process.env.REACT_APP_IS_PRODUCTION === 'true'
                  ? [email]
                  : ['hvandenberg@jacvandenberg.com'],
              body: `Dear ${firstName},<br /><br />
              Please review the following list of unpaids. <a href="${baseUrl}">Complete unpaids here.</a><br /><br />
              ${getUnpaidsVesselContent(pastUnpaids, 'Past Due:', baseUrl)}
              ${getUnpaidsVesselContent(currentUnpaids, 'This Week:', baseUrl)}
              ${getUnpaidsVesselContent(futureUnpaids, 'Upcoming:', baseUrl)}
              <br /><br />`,
              subject:
                'Unpaids Summary - ' +
                new Date().toLocaleDateString('en-us', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                }),
            }),
          )
          .then(() => {
            const successMessage = `Unpaids Summary email sent to ${userCode} at ${new Date()}\n`;
            console.log(successMessage);
          })
          .catch(onError);
      }
    })
    .catch(onError);
};

module.exports = sendUnpaidsNotificationEmails;
