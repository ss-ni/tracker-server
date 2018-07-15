const AWS = require('aws-sdk');
const path = require('path');

AWS.config.loadFromPath(path.resolve(__dirname, '../../keystore.json'));

const dynamodb = new AWS.DynamoDB();

module.exports = class DaoBase {
  static get dynamodb() {
    return dynamodb;
  }

  static putItem(param) {
    dynamodb.putItem(param, (err, data) => {
      if (err) console.log(err, err.stack);
      else console.log(data); // successful response
      /*
             data = {
              ConsumedCapacity: {
               CapacityUnits: 1, 
               TableName: 'Music'
              }
             }
             */
    });
  }
};
