import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import commonMiddleware from '../lib/commonMiddleware';
import { getAuctionById } from './getAuction';
import placeBidSchema from '../lib/schemas/placeBidSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const { highestBid, status } = await getAuctionById(id);

  if (status !== 'OPEN') {
    throw new createError.Forbidden('You cannot bid on closed auctions!');
  }

  if (amount <= highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than ${highestBid.amount}`
    );
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW', // returns the newly updated item
  };

  let updatedAuction;

  try {
    const { Attributes } = await dynamodb.update(params).promise();

    updatedAuction = Attributes;
  } catch (error) {
    throw new createError.InternalServerError('Error placing bid');
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid).use(
  validator({ inputSchema: placeBidSchema })
);
