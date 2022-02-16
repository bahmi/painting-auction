import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';
import createError from 'http-errors';
import { getAuctionById } from './getAuction';
import { uploadPictureToS3 } from '../lib/uploadPictureToS3';
import { setAuctionPictureUrl } from '../lib/setAuctionPictureUrl';
import uploadPictureSchema from '../lib/schemas/uploadPictureSchema';

export async function uploadPicture(event) {
  const { id } = event.pathParameters;
  const { email } = event.requestContext.authorizer;
  const auction = await getAuctionById(id);

  // validate that the auction belongs to the user
  if (auction.seller !== email) {
    throw new createError.Forbidden('You are not the seller of the auction');
  }

  // sometimes base64 string can be difficult for S3 to handle,
  // strip off some characters that could cause issues
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64'); // create buffer from the base64 string

  let updatedAuction;

  try {
    const pictureUrl = await uploadPictureToS3(auction.id + '.jpg', buffer);
    updatedAuction = await setAuctionPictureUrl(auction.id, pictureUrl);
  } catch (error) {
    throw new createError.InternalServerError(
      'Failed to update auction picture'
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = middy(uploadPicture)
  .use(httpErrorHandler())
  .use(validator({ inputSchema: uploadPictureSchema }));
