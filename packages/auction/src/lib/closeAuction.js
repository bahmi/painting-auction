import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export async function closeAuction(auction) {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: auction.id },
    UpdateExpression: 'SET #status = :status',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': 'CLOSED',
    },
  };

  await dynamodb.update(params).promise();

  const { title, seller, highestBid } = auction;
  const { amount, bidder } = highestBid;

  // if there's no bid, then notify only the seller
  if (amount === 0) {
    await sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: 'No bids on your auction item!',
          recipient: seller,
          body: `Oh no! Your item ${title} didn't receive any bid! Better luck next time.`,
        }),
      })
      .promise();

    return;
  }

  // send message to the MailQueue
  const notifySeller = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: 'Your item has been sold!',
        recipient: seller,
        body: `Your item ${title} has been sold for $${amount}.`,
      }),
    })
    .promise();

  // send message to the MailQueue
  const notifyBidder = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: 'You won an auction!',
        recipient: bidder,
        body: `What a great deal! You got yourself a ${title} for $${amount}.`,
      }),
    })
    .promise();

  return Promise.all([notifySeller, notifyBidder]);
}
