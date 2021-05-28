const fetch = require('node-fetch');

const fetchPSAArrivalInspections = () => {
  console.log(
    `\nFetching PSA arrival inspections: ${new Date().toLocaleString()}\n`,
  );
  fetch(process.env.PSA_AUTH_URL, {
    method: 'POST',
    body: `client_id=${process.env.PSA_CLIENT_ID}&client_secret=${process.env.PSA_CLIENT_SECRET}&grant_type=client_credentials&scope=pictures:read&scope=arrivalReports:read`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json, `Bearer ${json.access_token}`);
      fetch(process.env.PSA_API_URL, {
        method: 'POST',
        body: `
          query PSA_ARRIVAL_INSPECTION_LIST {
            arrivalReportsBulk(dateTimeAdded: "02/11/21") {
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
          Authorization: `Bearer ${json.access_token}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
        })
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));
};

module.exports = {
  fetchPSAArrivalInspections,
};
