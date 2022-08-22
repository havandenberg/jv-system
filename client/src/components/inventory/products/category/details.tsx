import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import useUpdateItem from 'hooks/use-update-item';
import { CommonCategory, CommonSpecies } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import SpeciesList from '../species/list';
import { baseLabels } from './data-utils';

export const breadcrumbs = (id: string) => [
  {
    text: 'Products',
    to: `/inventory/products`,
  },
  { text: 'Category', to: `/inventory/products/categories/${id}` },
];

const tabs: Tab[] = [
  {
    id: 'species',
    text: 'Species',
  },
];

const CommonCategoryDetails = () => {
  const { categoryId } = useParams<{
    categoryId: string;
  }>();
  const { data, error, loading } = api.useCommonCategory(categoryId);

  const { TabBar } = useTabBar(tabs);

  const [handleUpdate] = api.useUpdateCommonCategory(categoryId);

  const updateFields = ['categoryName', 'categoryDescription', 'uiColor'];
  const updateVariables = { id: categoryId };

  const { changes, editing, handleChange, getUpdateActions } =
    useUpdateItem<CommonCategory>({
      data: data as CommonCategory,
      handleUpdate,
      updateFields,
      updateVariables,
    });

  return (
    <Page
      actions={getUpdateActions().defaultActions}
      breadcrumbs={breadcrumbs(categoryId)}
      title={data?.categoryName ? data.categoryName : 'Loading...'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<CommonCategory>
            changes={changes}
            data={data}
            editing={editing}
            handleChange={handleChange}
            labels={baseLabels}
          />
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
            <l.AreaLink
              ml={th.spacing.md}
              to={`/inventory/products/categories/${data.id}/create`}
            >
              <b.Primary>Create</b.Primary>
            </l.AreaLink>
          </l.Flex>
          <SpeciesList
            baseUrl={`products`}
            specieses={(data?.commonSpecieses?.nodes || []) as CommonSpecies[]}
          />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default CommonCategoryDetails;
