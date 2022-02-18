const schema = {
  type: 'object',
  properties: {
    body: {
      type: 'string',
      minLength: 1,
      pattern: '^data:image/\\w+;base64,',
    },
  },
  required: ['body'],
};

export default schema;
