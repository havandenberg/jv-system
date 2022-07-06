const fetch = require('node-fetch');

const sendEmail = async (body) =>
  await fetch(`${process.env.WORKER_SERVER_URL}/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

const db2Query = async (body) =>
  await fetch(`${process.env.WORKER_SERVER_URL}/db2-query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

const onError = (err) => {
  console.log(err.stack);
};

module.exports = {
  onError,
  db2Query,
  sendEmail,
};
