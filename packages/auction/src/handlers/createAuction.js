import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import commonMiddleware from '../lib/commonMiddleware';
import createAuctionSchema from '../lib/schemas/createAuctionSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient(); // allows us to interact with the dynamodb tables

async function createAuction(event, context) {
  const { title } = event.body;
  const endDate = new Date();
  endDate.setHours(new Date().getHours() + 1); // add 1 hour to the current time

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
  };

  // add the auction to the database
  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError('Error creating auction');
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(createAuction).use(
  validator({ inputSchema: createAuctionSchema })
);
