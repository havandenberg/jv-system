const { difference, equals, map, times } = require('ramda');

const { gqlClient } = require('../api');
const { getSlicedChunks, onError } = require('../utils');

const iterationLimit = 5000;
const LOG_ONLY = false;

const db2UpdateItems = async (
  db,
  {
    db2Query,
    listQuery,
    upsertQuery,
    itemName,
    itemPluralName,
    itemQueryName,
    upsertQueryName,
    getUpdatedItem,
    useIndexAsId,
    idKey,
    getId,
    chunkSize,
  },
) => {
  const uppercasePluralName =
    itemPluralName.charAt(0).toUpperCase() + itemPluralName.slice(1);

  console.log(
    `\n\nUpdating ${itemName} database from DB2 at: ${new Date().toString()}\n\n`,
  );

  const itemsData = await gqlClient.request(listQuery).catch(onError);

  const db2ItemsData = await db.query(db2Query).catch(onError);
  const db2ItemCount = db2ItemsData.length;
  const iterations = Math.ceil(db2ItemCount / iterationLimit);

  times((iteration) => {
    const items = (itemsData?.[itemQueryName]?.nodes || [])
      .slice(iteration * iterationLimit, (iteration + 1) * iterationLimit)
      .reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: item,
        }),
        {},
      );

    const db2Items = (db2ItemsData || [])
      .slice(iteration * iterationLimit, (iteration + 1) * iterationLimit)
      .reduce((acc, db2Item, idx) => {
        const itemId = getId
          ? getId(db2Item, items)
          : useIndexAsId
          ? iteration * iterationLimit + idx + 1
          : db2Item[idKey].trimEnd();

        return {
          ...acc,
          [itemId]: map(
            (val) => (typeof val === 'string' ? val.trimEnd() : val),
            db2Item,
          ),
        };
      }, {});

    const db2ItemIds = Object.keys(db2Items);
    const itemIds = Object.keys(items);
    const newIds = difference(db2ItemIds, itemIds);

    const updatedItems = Object.keys(items)
      .map((itemId) => {
        const item = items[itemId];
        const db2Item = db2Items[itemId];
        const updatedItem =
          item && db2Item ? getUpdatedItem(item, db2Item, itemId) : null;

        const hasChanges = !equals(item, updatedItem);

        return hasChanges ? updatedItem : null;
      })
      .filter((updatedItem) => updatedItem !== null);

    const newItems = newIds.map((id) => getUpdatedItem({}, db2Items[id], null));

    const itemsToUpsert = [...updatedItems, ...newItems];

    if (itemsToUpsert.length === 0) {
      console.log(
        `${uppercasePluralName} count: ${itemIds.length}\n\nDB2 ${itemPluralName} count: ${db2ItemIds.length}\n\nNo new or updated ${itemPluralName}.\n\n`,
      );
    }

    if (LOG_ONLY) {
      console.log(
        `${uppercasePluralName} update summary:\n\n${uppercasePluralName} count: ${itemIds.length}\n\nDB2 ${itemPluralName} count: ${db2ItemIds.length}\n\nNew ${itemPluralName} count: ${newItems.length}\n\nUpdated ${itemPluralName} count: ${updatedItems.length}\n\n`,
      );
      return;
    }

    getSlicedChunks(itemsToUpsert, chunkSize).forEach(async (values) => {
      await gqlClient
        .request(upsertQuery, {
          input: { [upsertQueryName]: values },
        })
        .then(() => {
          console.log(
            `New ${itemPluralName}: ${JSON.stringify(
              newItems.slice(0, 5),
            )}\n\nUpdated ${itemPluralName}: ${JSON.stringify(
              updatedItems.slice(0, 5).map((updatedItem) => ({
                oldItem: items[updatedItem.id],
                updatedItem: updatedItem,
              })),
            )}\n\n${uppercasePluralName} update summary:\n\n${uppercasePluralName} count: ${
              itemIds.length
            }\n\nDB2 ${itemPluralName} count: ${
              db2ItemIds.length
            }\n\nNew ${itemPluralName} count: ${
              newItems.length
            }\n\nUpdated ${itemPluralName} count: ${updatedItems.length}\n\n`,
          );
        })
        .catch(onError);
    });
  }, iterations);
};

module.exports = db2UpdateItems;
