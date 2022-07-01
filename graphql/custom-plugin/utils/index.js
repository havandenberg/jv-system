const fetch = require('node-fetch');

const sendEmail = async (body) =>
  await fetch(`${process.env.WORKER_SERVER_URL}/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

const onError = (err) => {
  console.log(err.stack);
};

module.exports = {
  onError,
  sendEmail,
};
