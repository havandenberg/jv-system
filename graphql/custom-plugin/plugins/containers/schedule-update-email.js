const { gql, makeExtendSchemaPlugin } = require('graphile-utils');
const XLSX = require('xlsx');

const { onError, sendEmail } = require('../../utils');

const extendSchemaPlugin = makeExtendSchemaPlugin({
  typeDefs: gql`
    input ContainerScheduleUpdateInput {
      message: String!
      data: String!
    }
    extend type Mutation {
      containerScheduleUpdateNotify(
        input: ContainerScheduleUpdateInput
      ): String!
    }
  `,
  resolvers: {
    Mutation: {
      containerScheduleUpdateNotify: async (_query, args) => {
        const dateString = new Date().toLocaleDateString('en-us', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });

        const rows = JSON.parse(args.input.data);
        const worksheet = XLSX.utils.aoa_to_sheet(rows);
        worksheet['!cols'] = rows[0].map((row, idx) =>
          rows.reduce(
            ({ wch }, r) => ({ wch: Math.max(wch, r[idx]?.length || 0) }),
            {
              wch: 10,
            },
          ),
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          `JV Containers - ${dateString}`,
        );
        const encodedFile = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'base64',
        });

        let result = '';
        await sendEmail({
          toRecipients:
            process.env.REACT_APP_IS_PRODUCTION === 'true'
              ? []
              : ['hvandenberg@jacvandenberg.com'],
          ccRecipients:
            process.env.REACT_APP_IS_PRODUCTION === 'true'
              ? ['tdeissler@jacvandenberg.com']
              : [],
          body: `Dear PSA,${args.input.message}`,
          subject: `Jac Vandenberg Container Schedule - ${dateString}`,
          attachments: [
            {
              name: `JV Container Schedule - ${dateString}.xlsx`,
              content: encodedFile,
            },
          ],
        })
          .then(() => {
            const successMessage = `Container Schedule Update email sent to PSA at ${new Date()}`;
            result = successMessage;
            console.log(successMessage);
          })
          .catch(onError);
        return result;
      },
    },
  },
});

module.exports = extendSchemaPlugin;
