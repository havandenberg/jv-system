import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { CommonProductTag } from 'components/tag-manager';
import useUpdateItem from 'hooks/use-update-item';
import { CommonSize, CommonSizeTag } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { transformChangesOnUpdate } from '../utils';
import { baseLabels } from './data-utils';
import useTagManager from 'components/tag-manager';

export const breadcrumbs = (size: CommonSize) => [
  {
    text: 'Products',
    to: `/sales/products`,
  },
  {
    text: size?.commonSpecies?.commonCategory?.categoryName || '',
    to: `/sales/products/categories/${size?.commonSpecies?.commonCategory?.id}`,
  },
  {
    text: size?.commonSpecies?.speciesName || '',
    to: `/sales/products/${size?.commonSpecies?.id}/sizes`,
  },
  {
    text: 'Size',
    to: `/sales/products/${size?.commonSpecies?.id}/sizes/${size?.id}`,
  },
];

const CommonSizeDetails = () => {
  const { sizeId } = useParams<{
    sizeId: string;
  }>();
  const { data, error, loading } = api.useCommonSize(sizeId);

  const [handleUpdate] = api.useUpdateCommonSize();

  const updateFields = [
    'sizeName',
    'sizeDescription',
    'uiColor',
    'commonSizeTags',
  ] as (keyof CommonSize)[];
  const updateVariables = { id: sizeId };

  const { changes, editing, handleChange, getUpdateActions } =
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
    });

  const { tagManager } = useTagManager({
    commonProductId: sizeId,
    editing: editing,
    handleChange: (tags: CommonProductTag[]) => {
      handleChange('commonSizeTags', {
        nodes: tags,
      });
    },
    productIdKey: 'commonSizeId',
    tags: (changes?.commonSizeTags?.nodes || []) as CommonProductTag[],
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
            labels={baseLabels}
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
