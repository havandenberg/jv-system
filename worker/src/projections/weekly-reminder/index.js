const EWS = require('node-ews');
const { gqlClient, PROJECTION_REMINDERS } = require('../../api');

const ewsConfig = {
  username: process.env.PDI_USERNAME,
  password: process.env.PDI_PASSWORD,
  host: process.env.PDI_EWS_SERVER,
};

const ews = new EWS(ewsConfig);

const ewsArgs = ({ EmailAddress, name, shipperId }) => ({
  attributes: {
    MessageDisposition: 'SendAndSaveCopy',
  },
  SavedItemFolderId: {
    DistinguishedFolderId: {
      attributes: {
        Id: 'sentitems',
      },
    },
  },
  Items: {
    Message: {
      ItemClass: 'IPM.Note',
      Subject: 'Jac Vandenberg 4 Week Projection Reminder',
      Body: {
        attributes: {
          BodyType: 'HTML',
        },
        $value: `Hi ${name},<br /><br />This is your weekly reminder to fill out the 4 week projections for Jac Vandenberg. <a href="${process.env.REACT_APP_CLIENT_URL}/sales/projections?shipperId=${shipperId}&view=grid">Click here to complete your 4 week projection.</a><br /><br />Best,<br /><br />Jac. Vandenberg, Inc`,
      },
      ToRecipients: {
        Mailbox: [{ EmailAddress }],
      },
      IsRead: 'false',
    },
  },
});

const onError = (err) => {
  console.log(err.stack);
};

const sendProjectionReminders = () => {
  gqlClient.request(PROJECTION_REMINDERS).then(({ shippers: { nodes } }) => {
    const shippersInfo = nodes.map((shipper) => {
      const primaryContact = shipper.shipperPersonContacts?.nodes.filter(
        (shipperContact) => !!shipperContact?.personContact?.isPrimary,
      )[0]?.personContact;

      console.log(primaryContact);

      return {
        EmailAddress: primaryContact?.email,
        name: primaryContact?.firstName,
        shipperId: shipper.id,
        shipperName: shipper.shipperName,
      };
    });
    console.log(JSON.stringify(ewsArgs(shippersInfo[0])));

    shippersInfo.forEach(async (shipperInfo) => {
      if (shipperInfo.EmailAddress) {
        let result = '';

        await ews
          .run('CreateItem', ewsArgs(shipperInfo))
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
