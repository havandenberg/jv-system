const fs = require('fs');
const fetch = require('node-fetch');

const { gql, gqlClient } = require('../../api');
const { onError } = require('../../utils');

const AUTH_ARRIVAL_REPORTS = 'arrivalReports';
const AUTH_PICTURES = 'pictures';

const CREATE_PSA_ARRIVAL_REPORT = gql`
  mutation CREATE_PSA_ARRIVAL_REPORT($input: CreatePsaArrivalReportInput!) {
    createPsaArrivalReport(input: $input) {
      clientMutationId
    }
  }
`;

const CREATE_PSA_ARRIVAL_PICTURE = gql`
  mutation CREATE_PSA_ARRIVAL_PICTURE($input: CreatePsaArrivalPictureInput!) {
    createPsaArrivalPicture(input: $input) {
      clientMutationId
    }
  }
`;

const authenticate = (type) =>
  fetch(process.env.PSA_AUTH_URL, {
    method: 'POST',
    body: `client_id=${process.env.PSA_CLIENT_ID}&client_secret=${process.env.PSA_CLIENT_SECRET}&grant_type=client_credentials&scope=${type}:read`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((res) => res.json());

const downloadPicture = (
  access_token,
  dateDirectory,
  { pictureId, arrivalCode, exporterId },
) =>
  fetch(`${process.env.PSA_REST_API_URL}/pictures/${pictureId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
    .then(async (res) => {
      const reportDirectory = `${dateDirectory}/${arrivalCode.replace(
        "'",
        '',
      )}-${exporterId}`;

      if (!fs.existsSync(reportDirectory)) {
        fs.mkdirSync(reportDirectory);
      }

      const fileStream = fs.createWriteStream(
        `${reportDirectory}/${pictureId}.jpg`,
      );

      await new Promise(() => {
        res.body.pipe(fileStream);
        res.body.on('error', onError);
        fileStream.on('finish', () => {
          console.log(`Picture ${pictureId} downloaded`);
        });
      });
    })
    .catch(onError);

const fetchPictures = (dateTime) =>
  authenticate(AUTH_PICTURES)
    .then(({ access_token }) =>
      fetch(process.env.PSA_GRAPHQL_API_URL, {
        method: 'POST',
        body: `
          query {
            picturesBulk(dateTimeAdded: "${dateTime}"){
              pictureId
              arrivalCode
              description
              exporterId
              palletId
              productCode
              varietyName
            }
          }
        `,
        headers: {
          'Content-Type': 'application/graphql',
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((res) => res.json())
        .then(({ data }) => {
          console.log(`${data.picturesBulk.length} pictures found\n`);

          const dateDirectory = `/psa-arrival-inspections/${dateTime}`;

          if (!fs.existsSync(dateDirectory)) {
            fs.mkdirSync(dateDirectory);
          }

          data.picturesBulk.forEach((picture) => {
            const { description, pictureId, ...rest } = picture;

            gqlClient
              .request(CREATE_PSA_ARRIVAL_PICTURE, {
                input: {
                  psaArrivalPicture: {
                    id: pictureId,
                    pictureDescription: description,
                    pictureDate: dateTime,
                    ...rest,
                  },
                },
              })
              .then(() => {
                console.log(`Picture ${pictureId} info added to database`);
                downloadPicture(access_token, dateDirectory, picture);
              });
          });
        })
        .catch(onError),
    )
    .catch(onError);

const downloadArrivalReport = (
  access_token,
  dateDirectory,
  { id, arrivalCode, exporterId },
) =>
  fetch(`${process.env.PSA_REST_API_URL}/arrivalReports/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
    .then(async (res) => {
      const reportDirectory = `${dateDirectory}/${arrivalCode.replace(
        "'",
        '',
      )}-${exporterId}`;

      if (!fs.existsSync(reportDirectory)) {
        fs.mkdirSync(reportDirectory);
      }

      const fileStream = fs.createWriteStream(
        `${reportDirectory}/report-${id}.pdf`,
      );

      await new Promise(() => {
        res.body.pipe(fileStream);
        res.body.on('error', onError);
        fileStream.on('finish', () => {
          console.log(`Report ${id} downloaded`);
        });
      });
    })
    .catch(onError);

const fetchArrivalReports = (dateTime) =>
  authenticate(AUTH_ARRIVAL_REPORTS)
    .then(({ access_token }) =>
      fetch(process.env.PSA_GRAPHQL_API_URL, {
        method: 'POST',
        body: `
          query {
            arrivalReportsBulk(dateTimeAdded: "${dateTime}") {
              id
              locationName
              arrivalCode
              arrivalName
              exporterId
              exporterName
            }
          }
        `,
        headers: {
          'Content-Type': 'application/graphql',
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((res) => res.json())
        .then(({ data }) => {
          console.log(`${data.arrivalReportsBulk.length} reports found\n`);

          const dateDirectory = `/psa-arrival-inspections/${dateTime}`;

          if (!fs.existsSync(dateDirectory)) {
            fs.mkdirSync(dateDirectory);
          }

          data.arrivalReportsBulk.forEach((report) => {
            gqlClient
              .request(CREATE_PSA_ARRIVAL_REPORT, {
                input: {
                  psaArrivalReport: { ...report, reportDate: dateTime },
                },
              })
              .then(() => {
                console.log(`Report ${report.id} added to database`);
                downloadArrivalReport(access_token, dateDirectory, report);
              })
              .catch(onError);
          });
        })
        .catch(onError),
    )
    .catch(onError);

const fetchPsaArrivalInspections = () => {
  console.log(
    `\n\nFetching PSA arrival inspections: ${new Date().toString()}\n\n`,
  );

  const today = new Date();
  const dateTime = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  fetchArrivalReports(dateTime);
  fetchPictures(dateTime);
};

module.exports = {
  fetchPsaArrivalInspections,
};
