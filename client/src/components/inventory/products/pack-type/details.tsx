import React from 'react';
import { pluck, uniqBy } from 'ramda';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import useTagManager, { CommonProductTag } from 'components/tag-manager';
import useUpdateItem from 'hooks/use-update-item';
import {
  CommonPackType,
  CommonPackTypeTag,
  PackMaster,
  RepackStyle,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { transformChangesOnUpdate } from '../utils';
import { baseLabels, repackStyleBaseLabels } from './data-utils';

export const breadcrumbs = (packType: CommonPackType) => [
  {
    text: 'Products',
    to: `/inventory/products`,
  },
  {
    text: packType?.commonSpecies?.commonCategory?.categoryName || '',
    to: `/inventory/products/categories/${packType?.commonSpecies?.commonCategory?.id}`,
  },
  {
    text: packType?.commonSpecies?.speciesName || '',
    to: `/inventory/products/${packType?.commonSpecies?.id}/packTypes`,
  },
  {
    text: 'Pack Type',
    to: `/inventory/products/${packType?.commonSpecies?.id}/packTypes/${packType?.id}`,
  },
];

const CommonPackTypeDetails = () => {
  const { packTypeId } = useParams<{
    packTypeId: string;
  }>();
  const { data, error, loading } = api.useCommonPackType(packTypeId);

  const { data: packMasterData } = api.usePackMasterList();
  const packMasters = (packMasterData?.nodes || []) as PackMaster[];

  const { data: repackStyleData } = api.useRepackStyleList();
  const repackStyles = (repackStyleData?.nodes || []) as RepackStyle[];

  const [handleUpdate] = api.useUpdateCommonPackType();

  const updateFields = [
    'packTypeName',
    'packTypeDescription',
    'uiColor',
    'commonPackTypeTags',
    'packMasterId',
    'defaultInvSortKey',
    'repackStyleId',
    'palletWeight',
    'boxCount',
  ] as (keyof CommonPackType)[];
  const updateVariables = { id: packTypeId };

  const { changes, editing, handleChange, getUpdateActions, saveAttempt } =
    useUpdateItem<CommonPackType>({
      data: data as CommonPackType,
      handleUpdate,
      transformChangesOnUpdate: (transformChanges) =>
        transformChangesOnUpdate<CommonPackType>(
          updateFields,
          transformChanges,
          (transformChanges.commonPackTypeTags?.nodes ||
            []) as CommonPackTypeTag[],
          (data?.commonPackTypeTags?.nodes || []) as CommonPackTypeTag[],
          'commonPackType',
        ),
      updateFields,
      updateVariables,
      validationLabels: baseLabels(packMasters, repackStyles),
    });

  const selectedRepackStyle = repackStyles.find(
    (repackStyle) => repackStyle?.id === changes?.repackStyleId,
  );

  const tags = (changes?.commonPackTypeTags?.nodes || []) as CommonProductTag[];
  const suggestedTags = uniqBy(
    (tag) => tag?.tagText,
    pluck(
      'commonPackTypeTags',
      (data?.commonSpecies?.commonPackTypes?.nodes || []) as CommonPackType[],
    )
      .map(({ nodes }) => nodes)
      .flat(),
  ) as CommonProductTag[];

  const { tagManager } = useTagManager({
    commonProductId: packTypeId,
    editing: editing,
    handleChange: (tags: CommonProductTag[]) => {
      handleChange('commonPackTypeTags', {
        nodes: tags,
      });
    },
    productIdKey: 'commonPackTypeId',
    tags,
    suggestedTags,
  });

  return (
    <Page
      actions={getUpdateActions().defaultActions}
      breadcrumbs={breadcrumbs(data as CommonPackType)}
      title={data?.packTypeName ? data.packTypeName : 'Loading...'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<CommonPackType>
            changes={changes}
            data={data}
            editing={editing}
            handleChange={handleChange}
            labels={baseLabels(packMasters, repackStyles)}
            showValidation={saveAttempt}
          />
          <l.Div ml={th.spacing.sm} my={th.spacing.lg}>
            {tagManager}
          </l.Div>
          {selectedRepackStyle && (
            <>
              <ty.CaptionText my={th.spacing.md}>Repack Style:</ty.CaptionText>
              <BaseData<RepackStyle>
                data={selectedRepackStyle}
                editing={false}
                labels={repackStyleBaseLabels}
              />
            </>
          )}
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default CommonPackTypeDetails;
