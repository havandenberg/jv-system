const { gql, gqlClient } = require('../../api');
const { ews, ewsCreateAndSendArgs, onError } = require('../../utils/server');

const PROJECTION_REMINDERS = gql`
  query PROJECTION_REMINDERS {
    shippers {
      nodes {
        id
        sendProjectionRequest
        shipperName
        shipperPersonContacts {
          nodes {
            personContact {
              firstName
              id
              email
              lastName
              isPrimary
            }
          }
        }
      }
    }
  }
`;

const sendProjectionReminders = () => {
  console.log(`\nSending projection reminders at: ${new Date().toString()}\n`);

  gqlClient.request(PROJECTION_REMINDERS).then(({ shippers: { nodes } }) => {
    const shippersInfo = nodes.map((shipper) => {
      const primaryContact = shipper.shipperPersonContacts?.nodes.filter(
        (shipperContact) => !!shipperContact?.personContact?.isPrimary,
      )[0]?.personContact;

      return {
        EmailAddress: primaryContact?.email,
        name: primaryContact?.firstName,
        shipperId: shipper.id,
        shipperName: shipper.shipperName,
      };
    });

    shippersInfo.forEach(async (shipperInfo) => {
      if (shipperInfo.EmailAddress) {
        let result = '';

        await ews
          .run(
            'CreateItem',
            ewsCreateAndSendArgs({
              toRecipients: [shipperInfo.EmailAddress],
              body: `Hi ${shipperInfo.name},<br /><br />This is your weekly reminder to fill out the 4 week projections for Jac Vandenberg.<br /><br /><a href="${process.env.REACT_APP_CLIENT_URL}/sales/projections?shipperId=${shipperInfo.shipperId}&view=grid">Click here to complete your 4 week projection.</a><br /><br />Best,<br /><br />Jac. Vandenberg, Inc`,
              subject: 'Jac Vandenberg 4 Week Projection Reminder',
            }),
          )
          .then(() => {
            const successMessage = `\nShipper projection request email sent to \"${
              shipperInfo.shipperName
            }\" at ${new Date()}\n`;
            result = successMessage;
            console.log(successMessage);
          })
          .catch(onError);

        return result;
      }
    });
  });
};

module.exports = sendProjectionReminders;
