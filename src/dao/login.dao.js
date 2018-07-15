const crypto = require('crypto');
const DaoBase = require('./base.dao');

module.exports = class loginDao {
  static login(username, password) {
    const params = {
      ExpressionAttributeValues: {
        ':username': {
          S: username,
        },
      },
      KeyConditionExpression: 'username = :username',
      TableName: 'user',
    };
    DaoBase.dynamodb.query(params, (err, data) => {
      if (err) console.log(err, err.stack);
      else if (data.Count === 1 && data.Items[0].password.S === password) {
        console.log('Login successfully');
        loginDao.updateSession(username);
      } else {
        console.log('Login failed');
      }
    });
  }

  static updateSession(username) {
    const addNewSession = (user) => {
      console.log('no session found');
      const generateSession = () => {
        const sha = crypto.createHash('sha256');
        sha.update(Math.random().toString());
        return sha.digest('hex');
      };
      const putParam = {
        Item: {
          username: {
            S: user,
          },
          sessionId: {
            S: generateSession(),
          },
          timestamp: {
            N: `${new Date().getTime()}`,
          },
        },
        ReturnConsumedCapacity: 'TOTAL',
        TableName: 'session',
      };
      DaoBase.dynamodb.putItem(putParam, (purErr, putData) => {
        console.log(`put session err: ${JSON.stringify(putData)}`);
        console.log(`put session data: ${JSON.stringify(putData)}`);
      });
    };

    const updateUnexpiredSession = (user) => {
      const updateParam = {
        TableName: 'session',
        Key: {
          username: {
            S: user,
          },
        },
        UpdateExpression: 'set #t = :timestamp',
        ExpressionAttributeValues: {
          ':timestamp': { N: `${new Date().getTime()}` },
        },
        ExpressionAttributeNames: { '#t': 'timestamp' },
        ReturnValues: 'UPDATED_NEW',
      };
      DaoBase.dynamodb.updateItem(updateParam, (updateErr, updatedData) => {
        console.log(`update session err: ${JSON.stringify(updateErr)}`);
        console.log(`update session data: ${JSON.stringify(updatedData)}`);
      });
    };
    // Query DB to see if session exists
    const params = {
      ExpressionAttributeValues: {
        ':username': {
          S: username,
        },
      },
      KeyConditionExpression: 'username = :username',
      TableName: 'session',
    };
    DaoBase.dynamodb.query(params, (err, data) => {
      console.log(`data:${JSON.stringify(data)}`);
      // if session exists and has not yet expired
      if (data.Count === 1) {
        if (new Date().getTime() - data.Items[0].timestamp.N < 24 * 60 * 60 * 1000) {
          updateUnexpiredSession(username);
          console.log(`sessionId ${data.Items[0].sessionId.S}`);
        } else { // session exists but expired, delete session then add a new one
          const deleteParams = {
            TableName: 'session',
            Key: {
              username: { S: username },
            },
          };
          DaoBase.dynamodb.deleteItem(
            deleteParams,
            (deleteErr, deletedData) => {
              console.log(`delete session err: ${JSON.stringify(deleteErr)}`);
              console.log(`delete session data: ${JSON.stringify(deletedData)}`);
              addNewSession(username);
            },
          );
        }
      }
      if (data.Count !== 1) {
        addNewSession(username);
      }
    });
  }

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
