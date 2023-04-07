const { gql, makeExtendSchemaPlugin } = require('graphile-utils');
const { onError, sendEmail } = require('../../utils');

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

const extendSchemaPlugin = makeExtendSchemaPlugin({
  typeDefs: gql`
    input UnpaidReminderInput {
      invoiceId: String!
      customerName: String!
      flag: String!
      isUrgent: Boolean!
      truckLoadId: String!
    }
    input UnpaidShipperInput {
      shipperId: String!
      shipperName: String!
      unpaids: [UnpaidReminderInput]!
    }
    input UnpaidVesselInput {
      vesselCode: String!
      vesselName: String!
      dueDate: String!
      shipDate: String!
      shippers: [UnpaidShipperInput]!
    }
    input UnpaidSalesUserInput {
      userCode: String!
      firstName: String!
      email: String!
      pastUnpaids: [UnpaidVesselInput]!
      currentUnpaids: [UnpaidVesselInput]!
      futureUnpaids: [UnpaidVesselInput]!
    }
    input UnpaidRemindersInput {
      message: String!
      startOfWeek: String!
      endOfWeek: String!
      unpaidReminders: [UnpaidSalesUserInput]!
    }
    extend type Mutation {
      sendUnpaidsNotificationEmails(input: UnpaidRemindersInput): String!
    }
  `,
  resolvers: {
    Mutation: {
      sendUnpaidsNotificationEmails: async (_query, args) => {
        const { unpaidReminders } = args.input;
        const results = [];
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

          await sendEmail({
            ccRecipients:
              process.env.REACT_APP_IS_PRODUCTION === 'true'
                ? ['jpaap@jacvandenberg.com', 'ashin@jacvandenberg.com']
                : [],
            toRecipients:
              process.env.REACT_APP_IS_PRODUCTION === 'true'
                ? [email]
                : ['hvandenberg@jacvandenberg.com'],
            body: `Dear ${firstName},<br /><br />
                ${args.input.message ? args.input.message + '<br /><br />' : ''}
                Please review the following list of unpaids. <a href="${baseUrl}">Complete unpaids here.</a><br /><br />
                ${getUnpaidsVesselContent(pastUnpaids, 'Past Due:', baseUrl)}
                ${getUnpaidsVesselContent(
                  currentUnpaids,
                  'This Week:',
                  baseUrl,
                )}
                ${getUnpaidsVesselContent(futureUnpaids, 'Upcoming:', baseUrl)}
                <br /><br />`,
            subject:
              'Unpaids Summary - ' +
              new Date().toLocaleDateString('en-us', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              }),
          })
            .then(() => {
              const successMessage = `Unpaids Summary email sent to ${userCode} at ${new Date()}`;
              console.log(successMessage);
              results.push(successMessage);
            })
            .catch(onError);
        }
        return results.join(',');
      },
    },
  },
});

module.exports = extendSchemaPlugin;
