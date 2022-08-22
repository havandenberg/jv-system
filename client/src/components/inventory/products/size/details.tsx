import React from 'react';
import { pluck, uniqBy } from 'ramda';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import useTagManager, { CommonProductTag } from 'components/tag-manager';
import useUpdateItem from 'hooks/use-update-item';
import { CommonSize, CommonSizeTag, ProductSize } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { transformChangesOnUpdate } from '../utils';
import { baseLabels } from './data-utils';

export const breadcrumbs = (size: CommonSize) => [
  {
    text: 'Products',
    to: `/inventory/products`,
  },
  {
    text: size?.commonSpecies?.commonCategory?.categoryName || '',
    to: `/inventory/products/categories/${size?.commonSpecies?.commonCategory?.id}`,
  },
  {
    text: size?.commonSpecies?.speciesName || '',
    to: `/inventory/products/${size?.commonSpecies?.id}/sizes`,
  },
  {
    text: 'Size',
    to: `/inventory/products/${size?.commonSpecies?.id}/sizes/${size?.id}`,
  },
];

const CommonSizeDetails = () => {
  const { sizeId } = useParams<{
    sizeId: string;
  }>();
  const { data, error, loading } = api.useCommonSize(sizeId);

  const { data: productSizeData } = api.useProductSizeList();
  const productSizes = (productSizeData?.nodes || []) as ProductSize[];

  const [handleUpdate] = api.useUpdateCommonSize();

  const updateFields = [
    'sizeName',
    'sizeDescription',
    'uiColor',
    'commonSizeTags',
    'productSizeId',
    'defaultInvSortKey',
  ] as (keyof CommonSize)[];
  const updateVariables = { id: sizeId };

  const { changes, editing, handleChange, getUpdateActions, saveAttempt } =
    useUpdateItem<CommonSize>({
      data: data as CommonSize,
      handleUpdate,
      transformChangesOnUpdate: (transformChanges) =>
        transformChangesOnUpdate(
          updateFields,
          transformChanges,
          (transformChanges.commonSizeTags?.nodes || []) as CommonSizeTag[],
          (data?.commonSizeTags?.nodes || []) as CommonSizeTag[],
          'commonSize',
        ),
      updateFields,
      updateVariables,
      validationLabels: baseLabels(productSizes),
    });

  const tags = (changes?.commonSizeTags?.nodes || []) as CommonProductTag[];
  const suggestedTags = uniqBy(
    (tag) => tag?.tagText,
    pluck(
      'commonSizeTags',
      (data?.commonSpecies?.commonSizes?.nodes || []) as CommonSize[],
    )
      .map(({ nodes }) => nodes)
      .flat(),
  ) as CommonProductTag[];

  const { tagManager } = useTagManager({
    commonProductId: sizeId,
    editing: editing,
    handleChange: (tags: CommonProductTag[]) => {
      handleChange('commonSizeTags', {
        nodes: tags,
      });
    },
    productIdKey: 'commonSizeId',
    tags,
    suggestedTags,
  });

  return (
    <Page
      actions={getUpdateActions().defaultActions}
      breadcrumbs={breadcrumbs(data as CommonSize)}
      title={data?.sizeName ? data.sizeName : 'Loading...'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<CommonSize>
            changes={changes}
            data={data}
            editing={editing}
            handleChange={handleChange}
            labels={baseLabels(productSizes)}
            showValidation={saveAttempt}
          />
          <l.Div ml={th.spacing.sm} my={th.spacing.lg}>
            {tagManager}
          </l.Div>
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default CommonSizeDetails;
