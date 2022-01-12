const schema = {
  type: 'object',
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['OPEN', 'CLOSED'],
          default: 'OPEN', // if nothing is provided, defaults to OPEN
        },
      },
    },
  },
  required: ['queryStringParameters'],
};

export default schema;
