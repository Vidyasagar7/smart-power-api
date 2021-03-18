const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
  endpoint: "https://dynamodb.ap-south-1.amazonaws.com",
});

const docClient = new AWS.DynamoDB.DocumentClient();

const getMeterDataById = async (meterId) => {
  let params = {
    TableName: "MeterReading",
    Key: {
      "primaryKeyId": meterId,
      "sortKey": "METER",
    },
  };
  const result = await docClient.get(params).promise();
  console.log(`Result:::${JSON.stringify(result)}`);
  return result.Item;
};

module.exports = { getMeterDataById };
