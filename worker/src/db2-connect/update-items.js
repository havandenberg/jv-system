const { difference, equals, map, times } = require('ramda');

const { gqlClient } = require('../api');
const { getSlicedChunks, onError } = require('../utils');

const defaultIterationLimit = 5000;
const LOG_ONLY = false;

const db2UpdateItems = async (
  db,
  {
    db2Query,
    listQuery,
    deleteQuery,
    upsertQuery,
    itemName,
    itemPluralName,
    itemQueryName,
    iterationLimit = defaultIterationLimit,
    upsertQueryName,
    getUpdatedItem,
    idKey,
    getId,
    chunkSize,
    useIndexAsId,
  },
) => {
  const uppercasePluralName =
    itemPluralName.charAt(0).toUpperCase() + itemPluralName.slice(1);

  console.log(
    `\nUpdating ${itemName} database from DB2 at: ${new Date().toString()}\n`,
  );
  const startTime = Date.now();

  const itemsData = await gqlClient.request(listQuery).catch(onError);
  const itemCount = (itemsData?.[itemQueryName]?.nodes || []).length;
  const db2ItemsData = await db.query(db2Query).catch(onError);
  const db2ItemCount = db2ItemsData.length;
  const iterationMap = times(
    (iteration) => iteration,
    Math.ceil(db2ItemCount / iterationLimit),
  );

  for (const iteration of iterationMap) {
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
    const idsToDelete = difference(itemIds, db2ItemIds);

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

    const newItems = newIds
      .map((id) => getUpdatedItem({}, db2Items[id], null))
      .filter((newItem) => newItem !== null);

    const itemsToUpsert = [...updatedItems, ...newItems];
    const itemsToDelete = idsToDelete.map((id) => items[id]);

    const chunks = getSlicedChunks(itemsToUpsert, chunkSize);

    if (!LOG_ONLY) {
      for (let values of chunks) {
        await gqlClient
          .request(upsertQuery, {
            input: { [upsertQueryName]: values },
          })
          .catch(onError);
      }

      if (!!deleteQuery) {
        await gqlClient
          .request(deleteQuery, {
            input: { idsToDelete },
          })
          .catch(onError);
      }
    }

    const newItemsLog =
      newItems.length > 0
        ? `New ${itemPluralName}: ${JSON.stringify(newItems.slice(0, 5))}\n\n`
        : '';
    const updatedItemsLog =
      updatedItems.length > 0
        ? `Updated ${itemPluralName}: ${JSON.stringify(
            updatedItems.slice(0, 5).map((updatedItem) => ({
              oldItem: items[updatedItem.id],
              updatedItem: updatedItem,
            })),
          )}\n\n`
        : '';
    const deletedItemsLog =
      itemsToDelete.length > 0
        ? `Deleted ${itemPluralName}: ${JSON.stringify(
            itemsToDelete.slice(0, 5),
          )}\n\n`
        : '';

    console.log(
      `\n${newItemsLog}${updatedItemsLog}${deletedItemsLog}${uppercasePluralName} update summary (${
        iteration + 1
      }/${iterationMap.length}, ${
        (Date.now() - startTime) / 1000
      }s):\n\nCount: ${
        itemIds.length + iteration * iterationLimit
      }/${itemCount}, DB2 count: ${
        db2ItemIds.length + iteration * iterationLimit
      }/${db2ItemCount}, New: ${newItems.length}, Updated: ${
        updatedItems.length
      }, Deleted: ${idsToDelete.length}\n`,
    );
  }
};

module.exports = db2UpdateItems;
