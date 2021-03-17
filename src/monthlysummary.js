const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
  endpoint: "https://dynamodb.ap-south-1.amazonaws.com",
});

const docClient = new AWS.DynamoDB.DocumentClient();

const getMonthlySummaryByMeterId = async (meterId, year) => {
  let params = {
    TableName: "MeterReading",
    Key: {
      "primaryKeyId": `MAGGR_${meterId}`,
      "sortKey": year,
    },
    "ProjectionExpression": "meterId, summary"
  };
  const result = await docClient.get(params).promise();
  return result.Item;
};

module.exports = { getMonthlySummaryByMeterId };
