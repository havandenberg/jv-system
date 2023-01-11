const { add, endOfISOWeek, isBefore, startOfISOWeek } = require('date-fns');
const { sortBy, mergeDeepLeft, omit } = require('ramda');

const { gql, gqlClient } = require('../../api');
const { ews, ewsArgs, onError } = require('../../utils/server');
const {
  formatDate,
  isDateGreaterThanOrEqualTo,
  isDateLessThanOrEqualTo,
} = require('../../utils/date');

const UNPAIDS_NOTIFICATIONS = (startDate, endDate) => gql`
  query UNPAIDS_NOTIFICATIONS {
    allVesselControls(filter: {
      dueDate: {
        greaterThanOrEqualTo: ${startDate},
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
            shipperId
            vesselCode
            isApproved
            isUrgent
            notes
          }
        }
        pallets {
          nodes {
            id
            invoiceHeaders {
              nodes {
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
            }
            billOfLading
            palletId
            shipped
            searchText
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

const emptyUnpaid = {
  isUrgent: false,
  isAlert: false,
  isApproved: false,
  notes: '',
};

const buildVesselControlItems = (vesselControls) =>
  vesselControls
    .map((vesselControl) => {
      const pallets = vesselControl.pallets?.nodes || [];
      const groupedPallets = pallets.reduce((acc, pallet) => {
        const newValues = pallet.invoiceHeaders.nodes?.reduce(
          (acc2, invoice) => {
            const salesUserCode = invoice?.salesUserCode || 'UNK';
            const orderId = invoice?.orderId || 'UNK';
            const info = acc2[salesUserCode]?.[orderId] || { pallets: [] };
            const accInfo =
              info.pallets.length > 0
                ? { pallets: [] }
                : acc[salesUserCode]?.[orderId] || { pallets: [] };
            const currentUnpaid = vesselControl.unpaids.nodes?.find(
              (unpaid) => unpaid && unpaid.invoiceId === invoice?.invoiceId,
            );
            return {
              ...acc2,
              [salesUserCode]: {
                ...acc2[salesUserCode],
                [orderId]: {
                  pallets: [...accInfo.pallets, ...info.pallets, pallet],
                  unpaid:
                    info.unpaid ||
                    (currentUnpaid
                      ? {
                          ...currentUnpaid,
                          orderId: invoice?.orderId,
                          invoice,
                          shipper: vesselControl.shipper,
                          vessel: vesselControl.vessel,
                        }
                      : {
                          ...emptyUnpaid,
                          vesselCode: vesselControl.vessel?.vesselCode,
                          shipperId: vesselControl.shipper?.id,
                          invoiceId: invoice?.invoiceId,
                          orderId: invoice?.orderId,
                          invoice,
                          shipper: vesselControl.shipper,
                          vessel: vesselControl.vessel,
                        }),
                },
              },
            };
          },
          {},
        );

        return mergeDeepLeft(newValues, acc);
      }, {});

      const palletsShipped = pallets.filter((pallet) => pallet.shipped).length;

      return {
        ...omit(['nodeId'], vesselControl),
        groupedPallets,
        palletsReceived: pallets.length,
        palletsShipped,
        id: vesselControl.id === '0' ? undefined : vesselControl.id,
      };
    })
    .filter((vc) => !!vc);

const getUnpaidsInfo = (unpaids) =>
  unpaids.reduce(
    (acc, unpaid) => ({
      isAllUrgent: !!acc.isAllUrgent && !!unpaid.isUrgent,
      isAlert: !!acc.isAlert || !!unpaid.invoice?.flag,
      isAllApproved:
        !!acc.isAllApproved &&
        (!!unpaid.isApproved || unpaid.invoice?.paidCode === 'P'),
      isPartialApproved:
        !!acc.isPartialApproved ||
        !!unpaid.isApproved ||
        unpaid.invoice?.paidCode === 'P',
    }),
    {
      isAllUrgent: true,
      isAlert: false,
      isAllApproved: true,
      isPartialApproved: false,
    },
  );

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
      shippers: Object.values(shippers),
    })),
  );

const getUnpaidsContent = (unpaids, vesselCode, shipperId, baseUrl) =>
  `${unpaids
    .map(
      ({ invoiceId, customerName, flag, isUrgent }) => `
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      - <a href="${baseUrl}&unpaidSearch=${vesselCode}%20${shipperId}%20${invoiceId}">${invoiceId}</a>
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
        - <a href="${baseUrl}&unpaidSearch=${vesselCode}%20${shipperId}">${shipperId} - ${shipperName}</a>
        <br />
        ${getUnpaidsContent(unpaids, vesselCode, shipperId, baseUrl)}`,
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
                - <a href="${baseUrl}&unpaidSearch=${vesselCode}">${vesselCode} - ${vesselName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
                Due: ${dueDate}&nbsp;&nbsp;&nbsp;&nbsp;
                Shipped: ${shipDate}
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
  const startDate = add(startOfWeek, { weeks: -2 });
  const endDate = add(endOfWeek, { weeks: 1 });

  gqlClient
    .request(
      UNPAIDS_NOTIFICATIONS(
        `"${formatDate(startDate)}"`,
        `"${formatDate(endDate)}"`,
      ),
    )
    .then(async ({ allVesselControls: { nodes } }) => {
      const vesselControls = buildVesselControlItems(nodes);

      const groupedUnpaids = vesselControls.reduce(
        (acc, vesselControl) => ({
          ...acc,
          ...Object.keys(vesselControl?.groupedPallets || {}).reduce(
            (acc2, salesUserCode) => {
              const groupedPalletsBySalesUser =
                vesselControl?.groupedPallets?.[salesUserCode] || {};

              const itemKey = `${vesselControl?.vessel?.vesselCode}-${vesselControl?.shipper?.id}-${salesUserCode}`;

              const ups = Object.values(groupedPalletsBySalesUser)
                .map(({ unpaid }) => unpaid)
                .filter((up) => !up.isApproved);
              const up = ups[0];

              const { isAllApproved, isPartialApproved } = getUnpaidsInfo(ups);

              return up
                ? {
                    ...acc2,
                    [itemKey]: {
                      isAllApproved,
                      isPartialApproved,
                      isLiquidated: up.vesselControl?.isLiquidated,
                      unpaids: ups,
                    },
                  }
                : acc2;
            },
            {},
          ),
        }),
        {},
      );

      const unpaidRemindersInfo = Object.keys(groupedUnpaids).reduce(
        (acc, itemKey) => {
          const [vesselCode, shipperId, salesUserCode] = itemKey.split('-');
          if (!salesUserCode || salesUserCode === 'UNK') {
            return acc;
          }

          const { shipper, vessel } =
            vesselControls.find(
              (vc) =>
                vc.vessel?.vesselCode === vesselCode &&
                vc.shipper?.id === shipperId,
            ) || {};

          const unpaids = groupedUnpaids[itemKey]?.unpaids;
          const { invoice } = unpaids[0] || {};

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

          return {
            ...acc,
            [salesUserCode]: {
              ...acc[salesUserCode],
              userCode: invoice?.salesUser?.userCode || '',
              firstName: invoice?.salesUser?.personContact?.firstName || '',
              email: invoice?.salesUser?.personContact?.email || '',
              [vesselKey]: {
                ...acc[salesUserCode]?.[vesselKey],
                [vesselCode]: {
                  vesselCode: unpaids[0]?.vesselCode || '',
                  vesselName: vessel?.vesselName || '',
                  dueDate: dueDate ? formatDate(dueDate) : '',
                  shipDate: unpaids[0]?.invoice?.actualShipDate
                    ? formatDate(
                        new Date(
                          unpaids[0]?.invoice?.actualShipDate.replace(
                            /-/g,
                            '/',
                          ),
                        ),
                      )
                    : '',
                  shippers: {
                    ...acc[salesUserCode]?.[vesselKey]?.[vesselCode]?.shippers,
                    [shipperId]: {
                      shipperId: shipper?.id || '',
                      shipperName: shipper?.shipperName || '',
                      unpaids: unpaids.map((unpaid) => ({
                        isUrgent: !!unpaid?.isUrgent,
                        invoiceId: unpaid?.invoice?.invoiceId || '',
                        flag: unpaid?.invoice?.flag || '',
                        customerName:
                          unpaid?.invoice?.billingCustomer?.customerName || '',
                      })),
                    },
                  },
                },
              },
            },
          };
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
        const startDate = pastUnpaids[0]?.dueDate || startOfWeek;
        const endDate =
          futureUnpaids[futureUnpaids.length - 1]?.dueDate ||
          currentUnpaids[currentUnpaids.length - 1]?.dueDate ||
          pastUnpaids[pastUnpaids.length - 1]?.dueDate ||
          endOfWeek;
        const baseUrl = `${process.env.REACT_APP_CLIENT_URL}/accounting/unpaids?salesUserCode=${userCode}&startDate=${startDate}&endDate=${endDate}`;

        await ews
          .run(
            'CreateItem',
            ewsArgs({
              ccRecipients:
                process.env.REACT_APP_IS_PRODUCTION === 'true'
                  ? ['jpaap@jacvandenberg.com']
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
    });
};

module.exports = sendUnpaidsNotificationEmails;
