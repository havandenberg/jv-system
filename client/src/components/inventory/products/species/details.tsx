import React, { useEffect } from 'react';
import { pluck, uniqBy } from 'ramda';
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
    to: `/inventory/products`,
  },
  {
    text: species?.commonCategory?.categoryName || '',
    to: `/inventory/products/categories/${species?.commonCategory?.id}`,
  },
  {
    text: 'Species',
    to: `/inventory/products/${species?.id}/${selectedTabId}`,
  },
];

const tabs: (species: CommonSpecies, search: string) => Tab[] = (
  species,
  search,
) => [
  {
    id: 'varieties',
    text: 'Varieties',
    to: `/inventory/products/${species?.id}/varieties${search}`,
  },
  {
    id: 'sizes',
    text: 'Sizes',
    to: `/inventory/products/${species?.id}/sizes${search}`,
  },
  {
    id: 'pack-types',
    text: 'Pack Types',
    to: `/inventory/products/${species?.id}/pack-types${search}`,
  },
];

const CommonSpeciesDetails = () => {
  const { speciesId } = useParams<{
    speciesId: string;
  }>();
  const { search } = useLocation();
  const [{ sortBy }, setSortQueryParams] = useSortQueryParams();
  const { data: speciesesData, error, loading } = api.useCommonSpecieses();
  const specieses = speciesesData
    ? (speciesesData.nodes as CommonSpecies[])
    : [];
  const data = specieses.find((species) => species && species.id === speciesId);

  const { data: productSpeciesData, loading: productSpeciesLoading } =
    api.useProductSpeciesList();
  const productSpecieses = (productSpeciesData?.nodes ||
    []) as ProductSpecies[];

  const { TabBar, selectedTabId } = useTabBar({
    tabs: tabs(data as CommonSpecies, search),
    isRoute: true,
  });

  const [handleUpdate] = api.useUpdateCommonSpecies();

  const updateFields = [
    'speciesName',
    'speciesDescription',
    'uiColor',
    'commonSpeciesTags',
    'productSpeciesId',
    'defaultInvSortKey',
    'palletWeight',
  ] as (keyof CommonSpecies)[];
  const updateVariables = { id: speciesId };

  const { changes, editing, handleChange, getUpdateActions, saveAttempt } =
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
      validationLabels: baseLabels(productSpecieses),
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
    } else if (selectedTabId === 'pack-types') {
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
            baseUrl={`/inventory/products/${speciesId}`}
            sizes={(data?.commonSizes.nodes || []) as CommonSize[]}
          />
        );
      case 'pack-types':
        return (
          <PackTypeList
            baseUrl={`/inventory/products/${speciesId}`}
            packTypes={(data?.commonPackTypes.nodes || []) as CommonPackType[]}
          />
        );
      default:
        return (
          <VarietyList
            baseUrl={`/inventory/products/${speciesId}`}
            varieties={(data?.commonVarieties.nodes || []) as CommonVariety[]}
          />
        );
    }
  };

  const tags = (changes?.commonSpeciesTags?.nodes || []) as CommonProductTag[];
  const suggestedTags = uniqBy(
    (tag) => tag?.tagText,
    pluck('commonSpeciesTags', specieses)
      .map(({ nodes }) => nodes)
      .flat(),
  ) as CommonProductTag[];

  const { tagManager } = useTagManager({
    commonProductId: speciesId,
    editing,
    handleChange: (tags: CommonProductTag[]) => {
      handleChange('commonSpeciesTags', {
        nodes: tags,
      });
    },
    productIdKey: 'commonSpeciesId',
    tags,
    suggestedTags,
  });

  const { ItemSelector } = useItemSelector({
    allItems: () => productSpecieses,
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
            labels={baseLabels(productSpecieses)}
            showValidation={saveAttempt}
          />
          <l.Div ml={th.spacing.sm} my={th.spacing.lg}>
            {tagManager}
          </l.Div>
          {/* <l.Div
            alignCenter
            ml={th.spacing.sm}
            mb={th.spacing.lg}
            mt={`-${th.spacing.sm}`}
          >
            <l.Flex mb={th.spacing.sm}>
              <ty.BodyText mr={th.spacing.lg}>Codes:</ty.BodyText>
            </l.Flex>
            {editing && <l.Div width={250}>{ItemSelector}</l.Div>}
          </l.Div> */}
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
            <l.AreaLink
              ml={th.spacing.md}
              to={`/inventory/products/${data.id}/${selectedTabId}/create`}
            >
              <b.Success>Create</b.Success>
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
