import React, { Fragment, useState } from 'react';
import { noCase } from 'change-case';
import { isEmpty, sortBy } from 'ramda';

import api from 'api';
import AddItem from 'components/add-item';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useSearch from 'hooks/use-search';
import { CommonCategory, CommonSpecies } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { listLabels as categoryListLabels } from './category/data-utils';
import ListItem from './list-item';
import { listLabels as speciesListLabels } from './species/data-utils';

export const breadcrumbs = [{ text: 'Products', to: '/inventory/products' }];

const gridTemplateColumns = '1fr 0.5fr 1fr 1fr 30px';

const CommonProductIndex = () => {
  const { Search } = useSearch();
  const [editing, setEditing] = useState(false);

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = api.useCommonCategories();
  const categories = categoriesData ? categoriesData.nodes : [];

  const {
    data: speciesData,
    loading: speciesLoading,
    error: speciesError,
  } = api.useCommonSpecieses();
  const specieses = speciesData ? speciesData.nodes : [];

  const loading = categoriesLoading || speciesLoading;

  const columnLabels = useColumns<CommonSpecies>(
    'speciesName',
    SORT_ORDER.ASC,
    speciesListLabels(true),
    'product',
    'common_species',
  );

  return (
    <Page
      actions={
        editing ? (
          [
            <l.AreaLink
              key={0}
              ml={th.spacing.md}
              to="/inventory/products/categories/create"
            >
              <b.Primary>Create Category</b.Primary>
            </l.AreaLink>,
            <b.Primary
              key={1}
              ml={th.spacing.md}
              onClick={() => {
                setEditing(false);
              }}
            >
              Cancel
            </b.Primary>,
          ]
        ) : (
          <b.Warning
            onClick={() => {
              setEditing(true);
            }}
            width={88}
          >
            Edit
          </b.Warning>
        )
      }
      breadcrumbs={breadcrumbs}
      extraPaddingTop={117}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.lg} justifyBetween>
            <div>
              <l.Flex alignCenter justifyBetween mb={th.spacing.sm}>
                <ty.SmallText secondary>Search</ty.SmallText>
                {!loading && (
                  <ty.SmallText secondary>
                    Results: {specieses.length || '-'}
                  </ty.SmallText>
                )}
              </l.Flex>
              {Search}
            </div>
          </l.Flex>
          {!loading && (
            <l.Grid
              gridTemplateColumns={gridTemplateColumns}
              mb={th.spacing.sm}
              pl={th.spacing.sm}
              pr={
                speciesData
                  ? speciesData.totalCount > 12
                    ? th.spacing.md
                    : 0
                  : 0
              }
            >
              {columnLabels}
            </l.Grid>
          )}
        </>
      }
      title="All Species"
    >
      {!loading && !isEmpty(categories) ? (
        sortBy(
          (c) => c?.categoryName || '',
          categories as CommonCategory[],
        ).map((category) => {
          const speciesList = specieses.filter(
            (species) => species?.commonCategory?.id === category?.id,
          );
          return (
            category && (
              <Fragment key={category.id}>
                <ListItem<CommonCategory>
                  data={category}
                  gridTemplateColumns={gridTemplateColumns}
                  listLabels={categoryListLabels}
                  slug={`products/categories/${category.id}`}
                />
                {speciesList.map(
                  (species) =>
                    species && (
                      <ListItem<CommonSpecies>
                        data={species}
                        gridTemplateColumns={gridTemplateColumns}
                        key={species.id}
                        listLabels={speciesListLabels(true)}
                        slug={`products/${species.id}`}
                      />
                    ),
                )}
                {editing && (
                  <l.Div ml={th.spacing.md} my={th.spacing.md}>
                    <l.AreaLink
                      to={`/inventory/products/create?categoryId=${category.id}`}
                    >
                      <AddItem
                        text={`Create ${noCase(
                          category.categoryName || '',
                        )} species`}
                      />
                    </l.AreaLink>
                  </l.Div>
                )}
                <l.Div height={th.spacing.md} />
              </Fragment>
            )
          );
        })
      ) : (
        <DataMessage
          data={specieses}
          error={speciesError || categoriesError}
          loading={loading}
          emptyProps={{
            header: 'No products found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default CommonProductIndex;
