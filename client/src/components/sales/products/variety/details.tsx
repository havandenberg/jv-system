import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import TagManager, { CommonProductTag } from 'components/tag-manager';
import useUpdateItem from 'hooks/use-update-item';
import { CommonVariety, CommonVarietyTag } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { transformChangesOnUpdate } from '../utils';
import { baseLabels } from './data-utils';

export const breadcrumbs = (variety: CommonVariety) => [
  {
    text: 'Products',
    to: `/sales/products`,
  },
  {
    text: variety?.commonSpecies?.commonCategory?.categoryName || '',
    to: `/sales/products/categories/${variety?.commonSpecies?.commonCategory?.id}`,
  },
  {
    text: variety?.commonSpecies?.speciesName || '',
    to: `/sales/products/${variety?.commonSpecies?.id}/varieties`,
  },
  {
    text: 'Variety',
    to: `/sales/products/${variety?.commonSpecies?.id}/varieties/${variety?.id}`,
  },
];

const CommonVarietyDetails = () => {
  const { varietyId } = useParams<{
    varietyId: string;
  }>();
  const { data, error, loading } = api.useCommonVariety(varietyId);

  const [handleUpdate] = api.useUpdateCommonVariety(varietyId);

  const updateFields = [
    'varietyName',
    'varietyDescription',
    'uiColor',
    'commonVarietyTags',
  ] as (keyof CommonVariety)[];
  const updateVariables = { id: varietyId };

  const { changes, editing, handleChange, getUpdateActions } =
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
            labels={baseLabels}
          />
          <l.Div ml={th.spacing.sm} my={th.spacing.lg}>
            <TagManager
              commonProductId={varietyId}
              editing={editing}
              handleChange={(tags: CommonProductTag[]) => {
                handleChange('commonVarietyTags', {
                  nodes: tags,
                });
              }}
              productIdKey="commonVarietyId"
              tags={
                (changes?.commonVarietyTags?.nodes || []) as CommonProductTag[]
              }
            />
          </l.Div>
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default CommonVarietyDetails;
