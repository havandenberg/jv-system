import { pluck, uniqBy } from 'ramda';

import { CommonProductTag } from 'components/tag-manager';

export const transformChangesOnUpdate = <T extends {}>(
  updateFields: (keyof T)[],
  changes: Partial<T>,
  tagChanges: CommonProductTag[],
  initialTags: CommonProductTag[],
  tagKey: 'commonSpecies' | 'commonVariety' | 'commonSize' | 'commonPackType',
): Partial<T> =>
  updateFields.reduce((acc, key) => {
    const isTagKey = key === `${tagKey}Tags`;
    const updateKey = isTagKey ? `${tagKey}TagsUsingId` : key;

    const tags = uniqBy(({ tagText }) => tagText, tagChanges);

    const newTags = tags
      .filter(({ nodeId, tagText }) => !!tagText && parseInt(nodeId, 10) < 0)
      .map(({ tagText }) => ({ tagText }));

    const existingTags = tags
      .filter(({ nodeId }) => isNaN(parseInt(nodeId, 10)))
      .map(({ nodeId, tagText }) => ({
        nodeId,
        patch: {
          tagText,
        },
      }));

    const removedTags = initialTags
      .filter(({ nodeId }) => !pluck('nodeId', tags).includes(nodeId))
      .map(({ nodeId }) => ({
        nodeId,
      }));

    const updateValue = isTagKey
      ? {
          create: newTags,
          deleteByNodeId: removedTags,
          updateByNodeId: existingTags,
        }
      : changes[key];

    return {
      ...acc,
      [updateKey]: updateValue,
    };
  }, {});
