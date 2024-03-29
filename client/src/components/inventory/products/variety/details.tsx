import React from 'react';
import { pluck, uniqBy } from 'ramda';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import useTagManager, { CommonProductTag } from 'components/tag-manager';
import useUpdateItem from 'hooks/use-update-item';
import { CommonVariety, CommonVarietyTag, ProductVariety } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { transformChangesOnUpdate } from '../utils';
import { baseLabels } from './data-utils';

export const breadcrumbs = (variety: CommonVariety) => [
  {
    text: 'Products',
    to: `/inventory/products`,
  },
  {
    text: variety?.commonSpecies?.commonCategory?.categoryName || '',
    to: `/inventory/products/categories/${variety?.commonSpecies?.commonCategory?.id}`,
  },
  {
    text: variety?.commonSpecies?.speciesName || '',
    to: `/inventory/products/${variety?.commonSpecies?.id}/varieties`,
  },
  {
    text: 'Variety',
    to: `/inventory/products/${variety?.commonSpecies?.id}/varieties/${variety?.id}`,
  },
];

const CommonVarietyDetails = () => {
  const { varietyId } = useParams<{
    varietyId: string;
  }>();
  const { data, error, loading } = api.useCommonVariety(varietyId);

  const { data: productVarietyData } = api.useProductVarietyList();
  const productVarieties = (productVarietyData?.nodes ||
    []) as ProductVariety[];

  const [handleUpdate] = api.useUpdateCommonVariety(varietyId);

  const updateFields = [
    'varietyName',
    'varietyDescription',
    'uiColor',
    'commonVarietyTags',
    'productVarietyId',
    'defaultInvSortKey',
  ] as (keyof CommonVariety)[];
  const updateVariables = { id: varietyId };

  const { changes, editing, handleChange, getUpdateActions, saveAttempt } =
    useUpdateItem<CommonVariety>({
      data: data as CommonVariety,
      handleUpdate,
      transformChangesOnUpdate: (transformChanges) =>
        transformChangesOnUpdate(
          updateFields,
          transformChanges,
          (transformChanges.commonVarietyTags?.nodes ||
            []) as CommonVarietyTag[],
          (data?.commonVarietyTags?.nodes || []) as CommonVarietyTag[],
          'commonVariety',
        ),
      updateFields,
      updateVariables,
      validationLabels: baseLabels(productVarieties),
    });

  const tags = (changes?.commonVarietyTags?.nodes || []) as CommonProductTag[];
  const suggestedTags = uniqBy(
    (tag) => tag?.tagText,
    pluck(
      'commonVarietyTags',
      (data?.commonSpecies?.commonVarieties?.nodes || []) as CommonVariety[],
    )
      .map(({ nodes }) => nodes)
      .flat(),
  ) as CommonProductTag[];

  const { tagManager } = useTagManager({
    commonProductId: varietyId,
    editing: editing,
    handleChange: (tags: CommonProductTag[]) => {
      handleChange('commonVarietyTags', {
        nodes: tags,
      });
    },
    productIdKey: 'commonVarietyId',
    tags,
    suggestedTags,
  });

  return (
    <Page
      actions={getUpdateActions().defaultActions}
      breadcrumbs={breadcrumbs(data as CommonVariety)}
      title={data?.varietyName ? data.varietyName : 'Loading...'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<CommonVariety>
            changes={changes}
            data={data}
            editing={editing}
            handleChange={handleChange}
            labels={baseLabels(productVarieties)}
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

export default CommonVarietyDetails;
