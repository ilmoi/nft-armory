const { Base64 } = require('js-base64');
const axios = require('axios');
require('dotenv').config();

exports.handler = async (event) => {
  const token = Base64.encode(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
  const { token_type, access_token } = (
    await axios.post(`${process.env.ISSUER}`, 'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${token}`,
      },
    })
  ).data;

  return {
    statusCode: 200,
    body: access_token,
  };
};
