import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import TagManager, { CommonProductTag } from 'components/tag-manager';
import useUpdateItem from 'hooks/use-update-item';
import { CommonPackType, CommonPackTypeTag } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { transformChangesOnUpdate } from '../utils';
import { baseLabels } from './data-utils';

export const breadcrumbs = (packType: CommonPackType) => [
  {
    text: 'Products',
    to: `/sales/products`,
  },
  {
    text: packType?.commonSpecies?.commonCategory?.categoryName || '',
    to: `/sales/products/categories/${packType?.commonSpecies?.commonCategory?.id}`,
  },
  {
    text: packType?.commonSpecies?.speciesName || '',
    to: `/sales/products/${packType?.commonSpecies?.id}/packTypes`,
  },
  {
    text: 'Pack Type',
    to: `/sales/products/${packType?.commonSpecies?.id}/packTypes/${packType?.id}`,
  },
];

const CommonPackTypeDetails = () => {
  const { packTypeId } = useParams<{
    packTypeId: string;
  }>();
  const { data, error, loading } = api.useCommonPackType(packTypeId);

  const [handleUpdate] = api.useUpdateCommonPackType();

  const updateFields = [
    'packTypeName',
    'packTypeDescription',
    'uiColor',
    'commonPackTypeTags',
  ] as (keyof CommonPackType)[];
  const updateVariables = { id: packTypeId };

  const { changes, editing, handleChange, getUpdateActions } =
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
            labels={baseLabels}
          />
          <l.Div ml={th.spacing.sm} my={th.spacing.lg}>
            <TagManager
              commonProductId={packTypeId}
              editing={editing}
              handleChange={(tags: CommonProductTag[]) => {
                handleChange('commonPackTypeTags', {
                  nodes: tags,
                });
              }}
              productIdKey="commonPackTypeId"
              tags={
                (changes?.commonPackTypeTags?.nodes || []) as CommonProductTag[]
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

export default CommonPackTypeDetails;
