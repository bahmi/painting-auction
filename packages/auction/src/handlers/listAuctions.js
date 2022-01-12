import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import commonMiddleware from '../lib/commonMiddleware';
import listAuctionsSchema from '../lib/schemas/listAuctionsSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function listAuctions(event, context) {
  const { status } = event.queryStringParameters; // get the status from the query string
  let auctions;

  // parameters for the query operation
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': status,
    },
  };

  try {
    const { Items } = await dynamodb.query(params).promise();

    auctions = Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError('Error getting auctions');
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(listAuctions).use(
  validator({
    inputSchema: listAuctionsSchema,
    useDefaults: true,
  })
);
