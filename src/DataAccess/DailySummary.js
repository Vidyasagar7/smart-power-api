const {
  SmartPowerTable,
  getItem,
  queryByPrimaryIndex,
} = require("../Dynamodb/DynamoDbClient");


const getDailyReadMeterId = (meterId) => {
  return `DREAD_${meterId}`
}

const getDailySummaryByMeterId = async (meterId, date) => {
  return getItem(getDailyReadMeterId(meterId), date);
};



const getDailySummaries = async (meterId, fromDate, toDate) => {
  const keyCondition = `${SmartPowerTable.partitionKey} = :primaryKeyVal and ${SmartPowerTable.sortyKey} between :fromDateVal and :toDateVal`;
  const expressionAttributes = {
    ":primaryKeyVal": getDailyReadMeterId(meterId),
    ":fromDateVal": fromDate,
    ":toDateVal": toDate,
  };
  const projectionExpression = "#meterDate, readings";
  const expressionAttributeNames = {
    "#meterDate": "date"
  }
  return queryByPrimaryIndex(keyCondition, expressionAttributes, projectionExpression, expressionAttributeNames);
};

module.exports = { getDailySummaryByMeterId, getDailySummaries };
