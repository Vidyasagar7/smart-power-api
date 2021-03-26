const AWS = require("aws-sdk");
const { ApiConfig } = require("../config/api-config");

AWS.config.update({
  region: "ap-south-1",
  endpoint: ApiConfig.dynamoDbEndpoint,
});

const docClient = new AWS.DynamoDB.DocumentClient();

const SmartPowerTable = {
  tableName: "MeterReading",
  partitionKey: "primaryKeyId",
  sortyKey: "sortKey",
  gsiIndexName: "gsi_1",
  gsiRegionKey: "regionKey",

  userEntitySortKey: "USER",
  meterEntitySortKey: "METER",
};

const insertItem = async (primaryKeyVal, sortKeyVal, regionKeyVal, data) => {
    let params = {
        TableName: SmartPowerTable.tableName,
        Item: {
          primaryKeyId: primaryKeyVal,
          sortKey: sortKeyVal,
          regionKey: regionKeyVal,
          ...data,
        },
      };
      const result = await docClient.put(params).promise();
      return result.Item;
}

const getItem = async (primaryKeyVal, sortKeyVal, projectionExpression,expressionAttributeNames) => {
  let params = {
    TableName: SmartPowerTable.tableName,
    Key: {
      primaryKeyId: primaryKeyVal,
      sortKey: sortKeyVal,
    },
    ...(projectionExpression && { ProjectionExpression: projectionExpression }),
    ...(expressionAttributeNames && {
      ExpressionAttributeNames: expressionAttributeNames,
    }),
  };
  const result = await docClient.get(params).promise();
  return result.Item;
};

const queryByPrimaryIndex = async (
  keyCondition,
  expressionAttributes,
  projectionExpression,
  expressionAttributeNames
) => {
  let params = {
    TableName: SmartPowerTable.tableName,
    KeyConditionExpression: keyCondition,
    ExpressionAttributeValues: expressionAttributes,
    ...(projectionExpression && { ProjectionExpression: projectionExpression }),
    ...(expressionAttributeNames && {
      ExpressionAttributeNames: expressionAttributeNames,
    }),
  };
  const result = await docClient.query(params).promise();
  return result.Items;
};

const queryBySecondaryIndex = async (
    keyCondition,
    expressionAttributes,
    projectionExpression,
    expressionAttributeNames
  ) => {
    let params = {
      TableName: SmartPowerTable.tableName,
      IndexName: SmartPowerTable.gsiIndexName,
      KeyConditionExpression: keyCondition,
      ExpressionAttributeValues: expressionAttributes,
      ...(projectionExpression && { ProjectionExpression: projectionExpression }),
      ...(expressionAttributeNames && {
        ExpressionAttributeNames: expressionAttributeNames,
      }),
    };
    const result = await docClient.query(params).promise();
    return result.Items;
  };

const deleteItem = async (primaryKeyVal, sortKeyVal) => {
  let params = {
    TableName: SmartPowerTable.tableName,
    Key: {
      primaryKeyId: primaryKeyVal,
      sortKey: sortKeyVal,
    },
  };
  return docClient.delete(params).promise();
};

module.exports = { SmartPowerTable, insertItem, getItem, deleteItem, queryByPrimaryIndex, queryBySecondaryIndex };
