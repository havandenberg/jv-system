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
  CommonVariety,
  CommonVarietyTagsConnection,
  ProductVariety,
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
    to: `/inventory/products/${species?.id}/varieties`,
  },
];

const CreateCommonVariety = () => {
  const { search } = useLocation();
  const history = useHistory();

  const { speciesId } = useParams<{
    speciesId: string;
  }>();
  const { data: species } = api.useCommonSpecies(speciesId || '');

  const { data: productVarietyData } = api.useProductVarietyList();
  const productVarieties = (productVarietyData?.nodes ||
    []) as ProductVariety[];

  const cancelLink = `/inventory/products/${speciesId}/varieties${search}`;

  const [handleCreate] = api.useCreateCommonVariety();
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const initialState = {
    commonVarietyTags: {
      edges: [],
      nodes: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      totalCount: 0,
    } as CommonVarietyTagsConnection,
    varietyName: '',
    varietyDescription: '',
    uiColor: species?.uiColor || undefined,
  };

  const [changes, setChanges] = useState<CommonVariety>(
    initialState as CommonVariety,
  );

  const tags = (changes?.commonVarietyTags?.nodes || []) as CommonProductTag[];
  const suggestedTags = uniqBy(
    (tag) => tag?.tagText,
    pluck(
      'commonVarietyTags',
      (species?.commonVarieties.nodes || []) as CommonVariety[],
    )
      .map(({ nodes }) => nodes)
      .flat(),
  ) as CommonProductTag[];

  const { tagManager } = useTagManager({
    commonProductId: '',
    editing: true,
    handleChange: (tags: CommonProductTag[]) => {
      handleChange('commonVarietyTags', {
        nodes: tags,
      });
    },
    productIdKey: 'commonVarietyId',
    tags,
    suggestedTags,
  });

  const handleChange = (field: keyof CommonVariety, value: any) => {
    setChanges({ ...changes, [field]: value } as CommonVariety);
  };

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels(productVarieties))) {
      setLoading(true);
      handleCreate({
        variables: {
          commonVariety: {
            ...omit(['commonVarietyTags'], changes),
            commonSpeciesId: speciesId,
            commonVarietyTagsUsingId: {
              create: changes.commonVarietyTags.nodes.map((tag) => ({
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
      title="Create Variety"
    >
      <ty.BodyText ml={th.spacing.sm} my={th.spacing.md}>
        Species:{' '}
        <ty.LinkText
          bold
          hover={false}
          to={`/inventory/products/${species?.id}`}
        >
          {species?.speciesName}
        </ty.LinkText>
      </ty.BodyText>
      <BaseData<CommonVariety>
        changes={changes}
        data={changes}
        editing={true}
        handleChange={handleChange}
        labels={baseLabels(productVarieties)}
        showValidation={saveAttempt}
      />
      <l.Div ml={th.spacing.sm} my={th.spacing.lg}>
        {tagManager}
      </l.Div>
    </Page>
  );
};

export default CreateCommonVariety;
