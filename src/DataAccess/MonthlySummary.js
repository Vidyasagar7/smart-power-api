const { getItem } = require("../Dynamodb/DynamoDbClient");

const getMonthlySummaryByMeterId = async (meterId, year) => {
  const primaryKeyVal = `MAGGR_${meterId}`;
  const projectionExpression = "meterId, summary";
  return getItem(primaryKeyVal, year, projectionExpression);
};

module.exports = { getMonthlySummaryByMeterId };
