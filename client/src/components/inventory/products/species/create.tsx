import React, { Fragment, useState } from 'react';
import { omit, pluck, uniqBy } from 'ramda';
import { useHistory, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import Page from 'components/page';
import useTagManager, { CommonProductTag } from 'components/tag-manager';
import { useQueryValue } from 'hooks/use-query-params';
import {
  CommonCategory,
  CommonSpecies,
  CommonSpeciesTagsConnection,
  ProductSpecies,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { breadcrumbs as indexBreadcrumbs } from '..';
import { baseLabels } from './data-utils';

const breadcrumbs = (category: CommonCategory) => [
  ...indexBreadcrumbs,
  {
    text: category?.categoryName || '',
    to: `/inventory/products/categories/${category?.id}`,
  },
];

const CreateCommonSpecies = () => {
  const history = useHistory();

  const [categoryIdQuery] = useQueryValue('categoryId');
  const { categoryId: categoryParam } = useParams<{ categoryId: string }>();
  const categoryId = categoryParam || categoryIdQuery;
  const { data: category } = api.useCommonCategory(categoryId || '');

  const { data: speciesesData } = api.useCommonSpecieses();
  const specieses = speciesesData
    ? (speciesesData.nodes as CommonSpecies[])
    : [];
  const { data: productSpeciesData } = api.useProductSpeciesList();
  const productSpecieses = (productSpeciesData?.nodes ||
    []) as ProductSpecies[];

  const initialState = {
    commonSpeciesTags: {
      edges: [],
      nodes: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      totalCount: 0,
    } as CommonSpeciesTagsConnection,
    speciesName: '',
    speciesDescription: '',
    uiColor: category?.uiColor || undefined,
  };

  const cancelLink = `/inventory/products/${
    categoryParam ? 'categories/' + categoryParam : ''
  }`;

  const [handleCreate] = api.useCreateCommonSpecies();
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [changes, setChanges] = useState<CommonSpecies>(
    initialState as CommonSpecies,
  );

  const tags = (changes?.commonSpeciesTags?.nodes || []) as CommonProductTag[];
  const suggestedTags = uniqBy(
    (tag) => tag?.tagText,
    pluck('commonSpeciesTags', specieses)
      .map(({ nodes }) => nodes)
      .flat(),
  ) as CommonProductTag[];

  const { tagManager } = useTagManager({
    commonProductId: '',
    editing: true,
    handleChange: (tags: CommonProductTag[]) => {
      handleChange('commonSpeciesTags', {
        nodes: tags,
      });
    },
    productIdKey: 'commonSpeciesId',
    tags,
    suggestedTags,
  });

  const handleChange = (field: keyof CommonSpecies, value: any) => {
    setChanges({ ...changes, [field]: value } as CommonSpecies);
  };

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels(productSpecieses))) {
      setLoading(true);
      handleCreate({
        variables: {
          commonSpecies: {
            ...omit(['commonSpeciesTags'], changes),
            commonCategoryId: categoryId,
            commonSpeciesTagsUsingId: {
              create: changes.commonSpeciesTags.nodes.map((tag) => ({
                tagText: tag?.tagText || '',
              })),
            },
          },
        },
      }).then(() => {
        history.push(cancelLink);
      });
    }
  };

  return (
    <Page
      actions={[
        <Fragment key={0}>
          <l.AreaLink to={cancelLink}>
            <b.Error width={88}>Cancel</b.Error>
          </l.AreaLink>
          <b.Success ml={th.spacing.md} onClick={handleSave} width={88}>
            {createLoading ? (
              <l.Flex alignCenter justifyCenter>
                <ClipLoader
                  color={th.colors.brand.secondary}
                  size={th.sizes.xs}
                />
              </l.Flex>
            ) : (
              'Create'
            )}
          </b.Success>
        </Fragment>,
      ]}
      breadcrumbs={breadcrumbs(category as CommonCategory)}
      title="Create Species"
    >
      <ty.BodyText ml={th.spacing.sm} my={th.spacing.md}>
        Category:{' '}
        <ty.LinkText
          bold
          hover={false}
          to={`/inventory/products/categories/${category?.id}`}
        >
          {category?.categoryName}
        </ty.LinkText>
      </ty.BodyText>
      <BaseData<CommonSpecies>
        changes={changes}
        data={changes}
        editing={true}
        handleChange={handleChange}
        labels={baseLabels(productSpecieses)}
        showValidation={saveAttempt}
      />
      <l.Div ml={th.spacing.sm} my={th.spacing.lg}>
        {tagManager}
      </l.Div>
    </Page>
  );
};

export default CreateCommonSpecies;
