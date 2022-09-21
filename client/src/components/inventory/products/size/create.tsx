import React, { Fragment, useState } from 'react';
import { uniqBy, pluck, omit } from 'ramda';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import useTagManager, { CommonProductTag } from 'components/tag-manager';
import Page from 'components/page';
import {
  CommonSpecies,
  CommonSize,
  ProductSize,
  CommonSizeTagsConnection,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { breadcrumbs as indexBreadcrumbs } from '..';
import { baseLabels } from './data-utils';

const breadcrumbs = (species: CommonSpecies) => [
  ...indexBreadcrumbs,
  {
    text: species?.commonCategory?.categoryName || '',
    to: `/inventory/products/categories/${species?.commonCategory?.id}`,
  },
  {
    text: species?.speciesName || '',
    to: `/inventory/products/${species?.id}/sizes`,
  },
];

const initialState = {
  commonSizeTags: {
    edges: [],
    nodes: [],
    pageInfo: { hasNextPage: false, hasPreviousPage: false },
    totalCount: 0,
  } as CommonSizeTagsConnection,
  sizeName: '',
  sizeDescription: '',
};

const CreateCommonSize = () => {
  const { search } = useLocation();
  const history = useHistory();

  const { speciesId } = useParams<{
    speciesId: string;
  }>();
  const { data: species } = api.useCommonSpecies(speciesId || '');

  const { data: productSizeData } = api.useProductSizeList();
  const productSizes = (productSizeData?.nodes || []) as ProductSize[];

  const cancelLink = `/inventory/products/${speciesId}/sizes${search}`;

  const [handleCreate] = api.useCreateCommonSize();
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [changes, setChanges] = useState<CommonSize>(
    initialState as CommonSize,
  );

  const tags = (changes?.commonSizeTags?.nodes || []) as CommonProductTag[];
  const suggestedTags = uniqBy(
    (tag) => tag?.tagText,
    pluck('commonSizeTags', (species?.commonSizes?.nodes || []) as CommonSize[])
      .map(({ nodes }) => nodes)
      .flat(),
  ) as CommonProductTag[];

  const { tagManager } = useTagManager({
    commonProductId: '',
    editing: true,
    handleChange: (tags: CommonProductTag[]) => {
      handleChange('commonSizeTags', {
        nodes: tags,
      });
    },
    productIdKey: 'commonSizeId',
    tags,
    suggestedTags,
  });

  const handleChange = (field: keyof CommonSize, value: any) => {
    setChanges({ ...changes, [field]: value } as CommonSize);
  };

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels(productSizes))) {
      setLoading(true);
      handleCreate({
        variables: {
          commonSize: {
            ...omit(['commonSizeTags'], changes),
            commonSpeciesId: speciesId,
            commonSizeTagsUsingId: {
              create: changes.commonSizeTags.nodes.map((tag) => ({
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
      breadcrumbs={breadcrumbs(species as CommonSpecies)}
      title="Create Size"
    >
      <ty.BodyText ml={th.spacing.sm} my={th.spacing.md}>
        Species:{' '}
        <ty.LinkText
          bold
          hover={false}
          to={`/inventory/products/${species?.id}/sizes`}
        >
          {species?.speciesName}
        </ty.LinkText>
      </ty.BodyText>
      <BaseData<CommonSize>
        changes={changes}
        data={changes}
        editing={true}
        handleChange={handleChange}
        labels={baseLabels(productSizes)}
        showValidation={saveAttempt}
      />
      <l.Div ml={th.spacing.sm} my={th.spacing.lg}>
        {tagManager}
      </l.Div>
    </Page>
  );
};

export default CreateCommonSize;
