import AWS from 'aws-sdk';

const dynamob = new AWS.DynamoDB.DocumentClient();

export async function getEndedAuctions() {
  const now = new Date();
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status AND endingAt <= :now', // query condition
    ExpressionAttributeNames: {
      // status is a reserved word in DynamoDB. to work around that, we use the ExpressionAttributeNames
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      // define values to the variables in the query condition
      ':status': 'OPEN',
      ':now': now.toISOString(),
    },
  };

  const { Items } = await dynamob.query(params).promise();
  return Items;
}
