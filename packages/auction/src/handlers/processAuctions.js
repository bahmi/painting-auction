import createError from 'http-errors';
import { getEndedAuctions } from '../lib/getEndedAuctions';
import { closeAuction } from '../lib/closeAuction';

async function processAuctions(event, context) {
  try {
    const auctionsToClose = await getEndedAuctions(); // get the list of auctions to be closed
    const closePromises = auctionsToClose.map(
      (auction) => closeAuction(auction) // pass the auctions to the closeAuction, returns promise for each auction
    );

    await Promise.all(closePromises);

    return { closed: closePromises.length };
  } catch (error) {
    throw new createError.InternalServerError('Error processing auctions');
  }
}

export const handler = processAuctions;
