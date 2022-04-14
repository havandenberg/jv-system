import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import useItemSelector from 'components/item-selector';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import useTagManager, { CommonProductTag } from 'components/tag-manager';
import useUpdateItem from 'hooks/use-update-item';
import { useSortQueryParams } from 'hooks/use-query-params';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  CommonPackType,
  CommonSize,
  CommonSpecies,
  CommonSpeciesTag,
  CommonVariety,
  ProductSpecies,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import PackTypeList from '../pack-type/list';
import SizeList from '../size/list';
import { transformChangesOnUpdate } from '../utils';
import VarietyList from '../variety/list';
import { baseLabels } from './data-utils';

export const breadcrumbs = (species: CommonSpecies, selectedTabId: string) => [
  {
    text: 'Products',
    to: `/sales/products`,
  },
  {
    text: species?.commonCategory?.categoryName || '',
    to: `/sales/products/categories/${species?.commonCategory?.id}`,
  },
  { text: 'Species', to: `/sales/products/${species?.id}/${selectedTabId}` },
];

const tabs: (species: CommonSpecies, search: string) => Tab[] = (
  species,
  search,
) => [
  {
    id: 'varieties',
    text: 'Varieties',
    to: `/sales/products/${species?.id}/varieties${search}`,
  },
  {
    id: 'sizes',
    text: 'Sizes',
    to: `/sales/products/${species?.id}/sizes${search}`,
  },
  {
    id: 'packTypes',
    text: 'Pack Types',
    to: `/sales/products/${species?.id}/packTypes${search}`,
  },
];

const CommonSpeciesDetails = () => {
  const { speciesId } = useParams<{
    speciesId: string;
  }>();
  const { search } = useLocation();
  const [{ sortBy }, setSortQueryParams] = useSortQueryParams();
  const { data, error, loading } = api.useCommonSpecies(speciesId);

  const { TabBar, selectedTabId } = useTabBar(
    tabs(data as CommonSpecies, search),
    true,
  );

  const [handleUpdate] = api.useUpdateCommonSpecies();

  const updateFields = [
    'speciesName',
    'speciesDescription',
    'uiColor',
    'commonSpeciesTags',
    'productSpeciesId',
  ] as (keyof CommonSpecies)[];
  const updateVariables = { id: speciesId };

  const { changes, editing, handleChange, getUpdateActions } =
    useUpdateItem<CommonSpecies>({
      data: data as CommonSpecies,
      handleUpdate,
      transformChangesOnUpdate: (transformChanges) =>
        transformChangesOnUpdate(
          updateFields,
          transformChanges,
          (transformChanges.commonSpeciesTags?.nodes ||
            []) as CommonSpeciesTag[],
          (data?.commonSpeciesTags?.nodes || []) as CommonSpeciesTag[],
          'commonSpecies',
        ),
      updateFields,
      updateVariables,
    });

  useEffect(() => {
    if (selectedTabId === 'varieties') {
      if (!['varietyName', 'uiColor'].includes(sortBy)) {
        setSortQueryParams(
          {
            sortBy: 'varietyName',
            sortOrder: SORT_ORDER.ASC,
          },
          'replaceIn',
        );
      }
    } else if (selectedTabId === 'sizes') {
      if (sortBy !== 'sizeName') {
        setSortQueryParams(
          {
            sortBy: 'sizeName',
            sortOrder: SORT_ORDER.ASC,
          },
          'replaceIn',
        );
      }
    } else if (selectedTabId === 'packTypes') {
      if (sortBy !== 'packTypeName') {
        setSortQueryParams(
          {
            sortBy: 'packTypeName',
            sortOrder: SORT_ORDER.ASC,
          },
          'replaceIn',
        );
      }
    }
  }, [selectedTabId, setSortQueryParams, sortBy]);

  const List = () => {
    switch (selectedTabId) {
      case 'sizes':
        return (
          <SizeList
            baseUrl={`products/${speciesId}`}
            sizes={(data?.commonSizes.nodes || []) as CommonSize[]}
          />
        );
      case 'packTypes':
        return (
          <PackTypeList
            baseUrl={`products/${speciesId}`}
            packTypes={(data?.commonPackTypes.nodes || []) as CommonPackType[]}
          />
        );
      default:
        return (
          <VarietyList
            baseUrl={`products/${speciesId}`}
            varieties={(data?.commonVarieties.nodes || []) as CommonVariety[]}
          />
        );
    }
  };

  const { tagManager } = useTagManager({
    commonProductId: speciesId,
    editing,
    handleChange: (tags: CommonProductTag[]) => {
      handleChange('commonSpeciesTags', {
        nodes: tags,
      });
    },
    productIdKey: 'commonSpeciesId',
    tags: (changes?.commonSpeciesTags?.nodes || []) as CommonProductTag[],
  });

  const { data: productSpeciesData, loading: productSpeciesLoading } =
    api.useProductSpeciesList();

  const { ItemSelector } = useItemSelector({
    allItems: (productSpeciesData?.nodes || []) as ProductSpecies[],
    closeOnSelect: true,
    disabled: !editing,
    errorLabel: 'species',
    getItemContent: ({ id, speciesDescription }: ProductSpecies) => (
      <ty.BodyText pl={th.spacing.sm}>
        {id} - {speciesDescription}
      </ty.BodyText>
    ),
    height: 150,
    loading: productSpeciesLoading,
    nameKey: 'id',
    panelGap: 0,
    searchParamName: 'speciesSearch',
    selectItem: (item: any) => {
      handleChange &&
        handleChange(
          'productSpeciesByCommonSpeciesProductSpeciesCommonSpeciesIdAndProductSpeciesId',
          [
            ...changes
              .productSpeciesByCommonSpeciesProductSpeciesCommonSpeciesIdAndProductSpeciesId
              .nodes,
            item.id,
          ],
        );
    },
    width: 250,
  });

  return (
    <Page
      actions={getUpdateActions().defaultActions}
      breadcrumbs={breadcrumbs(data as CommonSpecies, selectedTabId)}
      title={data?.speciesName ? data.speciesName : 'Loading...'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<CommonSpecies>
            changes={changes}
            data={data}
            editing={editing}
            handleChange={handleChange}
            labels={baseLabels}
          />
          <l.Div ml={th.spacing.sm} my={th.spacing.lg}>
            {tagManager}
          </l.Div>
          <l.Div
            alignCenter
            ml={th.spacing.sm}
            mb={th.spacing.lg}
            mt={`-${th.spacing.sm}`}
          >
            <l.Flex mb={th.spacing.sm}>
              <ty.BodyText mr={th.spacing.lg}>Codes:</ty.BodyText>
            </l.Flex>
            {editing && ItemSelector}
          </l.Div>
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
            <l.AreaLink
              ml={th.spacing.md}
              to={`/sales/products/${data.id}/${selectedTabId}/create`}
            >
              <b.Primary>Create</b.Primary>
            </l.AreaLink>
          </l.Flex>
          <List />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default CommonSpeciesDetails;
