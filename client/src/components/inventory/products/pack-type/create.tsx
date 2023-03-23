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
  CommonPackType,
  PackMaster,
  CommonPackTypeTagsConnection,
  RepackStyle,
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
    to: `/inventory/products/${species?.id}/pack-types`,
  },
];

const initialState = {
  commonPackTypeTags: {
    edges: [],
    nodes: [],
    pageInfo: { hasNextPage: false, hasPreviousPage: false },
    totalCount: 0,
  } as CommonPackTypeTagsConnection,
  packTypeName: '',
  packTypeDescription: '',
};

const CreateCommonPackType = () => {
  const { search } = useLocation();
  const history = useHistory();

  const { speciesId } = useParams<{
    speciesId: string;
  }>();
  const { data: species } = api.useCommonSpecies(speciesId || '');

  const { data: packMasterData } = api.usePackMasterList();
  const packMasters = (packMasterData?.nodes || []) as PackMaster[];

  const { data: repackStyleData } = api.useRepackStyleList();
  const repackStyles = (repackStyleData?.nodes || []) as RepackStyle[];

  const cancelLink = `/inventory/products/${speciesId}/pack-types${search}`;

  const [handleCreate] = api.useCreateCommonPackType();
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [changes, setChanges] = useState<CommonPackType>(
    initialState as CommonPackType,
  );

  const tags = (changes?.commonPackTypeTags?.nodes || []) as CommonProductTag[];
  const suggestedTags = uniqBy(
    (tag) => tag?.tagText,
    pluck(
      'commonPackTypeTags',
      (species?.commonPackTypes?.nodes || []) as CommonPackType[],
    )
      .map(({ nodes }) => nodes)
      .flat(),
  ) as CommonProductTag[];

  const { tagManager } = useTagManager({
    commonProductId: '',
    editing: true,
    handleChange: (tags: CommonProductTag[]) => {
      handleChange('commonPackTypeTags', {
        nodes: tags,
      });
    },
    productIdKey: 'commonPackTypeId',
    tags,
    suggestedTags,
  });

  const handleChange = (field: keyof CommonPackType, value: any) => {
    setChanges({ ...changes, [field]: value } as CommonPackType);
  };

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels(packMasters, repackStyles))) {
      setLoading(true);
      handleCreate({
        variables: {
          commonPackType: {
            ...omit(['commonPackTypeTags'], changes),
            commonSpeciesId: speciesId,
            commonPackTypeTagsUsingId: {
              create: changes.commonPackTypeTags.nodes.map((tag) => ({
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
      title="Create Pack Type"
    >
      <ty.BodyText ml={th.spacing.sm} my={th.spacing.md}>
        Species:{' '}
        <ty.LinkText
          bold
          hover={false}
          to={`/inventory/products/${species?.id}/pack-types`}
        >
          {species?.speciesName}
        </ty.LinkText>
      </ty.BodyText>
      <BaseData<CommonPackType>
        changes={changes}
        data={changes}
        editing={true}
        handleChange={handleChange}
        labels={baseLabels(packMasters, repackStyles)}
        showValidation={saveAttempt}
      />
      <l.Div ml={th.spacing.sm} my={th.spacing.lg}>
        {tagManager}
      </l.Div>
    </Page>
  );
};

export default CreateCommonPackType;
