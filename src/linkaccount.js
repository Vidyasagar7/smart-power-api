const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
  endpoint: "https://dynamodb.ap-south-1.amazonaws.com",
});

const docClient = new AWS.DynamoDB.DocumentClient();

const getAccountByMeterId = async (meterId) => {
  let params = {
    TableName: "MeterReading",
    IndexName: "gsi_1",
    KeyConditionExpression:
      "sortKey = :sortKeyVal and regionKey = :regionKeyVal",
    ExpressionAttributeValues: {
      ":sortKeyVal": "USER",
      ":regionKeyVal": meterId,
    },
  };
  const result = await docClient.query(params).promise();
  console.log(`Result::${JSON.stringify(result)}`);
  return result.Items;
};

const linkMeterId = async (userAccountId, meterId) => {
  const userAccountDetails = {
    userAccountId: userAccountId,
    meterId: meterId,
  };
  let params = {
    TableName: "MeterReading",
    Item: {
      primaryKeyId: userAccountId,
      sortKey: "USER",
      regionKey: meterId,
      ...userAccountDetails,
    },
  };
  const result = await docClient.put(params).promise();
  console.log(result);
  return result.Item;
};
const deleteUserById = async (userId) => {
  let params = {
    TableName: "MeterReading",
    Key: {
      primaryKeyId: userId,
      sortKey: "USER",
    },
  };
  const result = await docClient.delete(params).promise();
  return result.Item;
};
module.exports = { getAccountByMeterId, linkMeterId, deleteUserById };
