const AWS = require("aws-sdk");
const dateformat = require("dateformat");
AWS.config.update({
  region: "ap-south-1",
  endpoint: "https://dynamodb.ap-south-1.amazonaws.com",
});

const docClient = new AWS.DynamoDB.DocumentClient();

const getDailySummaryByMeterId = async (meterId, dateEpochMilli) => {
  console.log(`Date::${dateEpochMilli}`);
  let date = dateformat(Number(new Date(dateEpochMilli)), "yyyymmdd");
  let params = {
    TableName: "MeterReading",
    Key: {
      primaryKeyId: `DREAD_${meterId}`,
      sortKey: date,
    },
    ProjectionExpression: "meterId, readings",
  };
  const result = await docClient.get(params).promise();
  return result.Item;
};

const monthlyAggregation = async(meterId,fromDate,toDate) =>{
  let params = {
    TableName: "MeterReading",
    KeyConditionExpression: "primaryKeyId = :primaryKeyVal and sortKey between :Date1 and :Date2",
    ExpressionAttributeValues :{
    ":primaryKeyVal" :`DREAD_${meterId}`,
    ":Date1" :fromDate,
    ":Date2" :toDate
    },
   // ProjectionExpression : "date, readings",
  }
  const result = await docClient.query(params).promise();
  return result.Items;
};

module.exports = { getDailySummaryByMeterId,monthlyAggregation };
