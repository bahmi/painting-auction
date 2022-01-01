import AWS from 'aws-sdk';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function listAuctions(event, context) {
  let auctions;

  try {
    const { Items } = await dynamodb
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME,
      })
      .promise();

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

export const handler = middy(listAuctions)
  .use(jsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
