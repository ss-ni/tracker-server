const DaoBase = require('./base.dao');

module.exports = class loginDao {
  static register(username, password) {
    const params = {
      Item: {
        username: {
          S: username,
        },
        password: {
          S: password,
        },
      },
      ReturnConsumedCapacity: 'TOTAL',
      TableName: 'user',
    };
    DaoBase.dynamodb.putItem(params);
  }
};
