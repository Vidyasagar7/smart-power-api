const {
  SmartPowerTable,
  getItem,
  deleteItem,
  queryBySecondaryIndex,
  insertItem,
} = require("../Dynamodb/DynamoDbClient");

const USER_ENTITY = "USER";

const getUserAccountByUserId = async (userId) => {
  return getItem(userId, USER_ENTITY);
};

const getUserAccountByMeterId = async (meterId) => {
  const keyCondition = `${SmartPowerTable.sortyKey} = :sortKeyVal and ${SmartPowerTable.gsiRegionKey} = :regionKeyVal`;
  const expressionAttributes = {
    ":sortKeyVal": USER_ENTITY,
    ":regionKeyVal": meterId,
  };
  return queryBySecondaryIndex(keyCondition, expressionAttributes);
};

const linkUserAccount = async (userAccountId, meterId) => {
  const userAccountDetails = {
    userAccountId: userAccountId,
    meterId: meterId,
  };

  return insertItem(userAccountId, USER_ENTITY, meterId, userAccountDetails);
};


const deleteUserAccountByUserId = async (userId) => {
  return deleteItem(userId, USER_ENTITY);
};

module.exports = {
  getUserAccountByUserId,
  getUserAccountByMeterId,
  linkUserAccount,
  deleteUserAccountByUserId,
};
