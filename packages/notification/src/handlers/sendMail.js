import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: process.env.APP_AWS_REGION });

// eslint-disable-next-line no-unused-vars
async function sendMail(event, context) {
  // get the first email details
  const [record] = event.Records;

  const email = JSON.parse(record.body);
  const { subject, body, recipient } = email;

  // parameters for sending the email
  const params = {
    Source: process.env.SES_SOURCE_EMAIL,
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    return result;
  } catch (error) {
    console.error("Couldn't send the email");
  }
}

export const handler = sendMail;
