import React, { Fragment, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import Page from 'components/page';
import { CommonSpecies, CommonPackType, PackMaster } from 'types';
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
    to: `/inventory/products/${species?.id}/packTypes`,
  },
];

const initialState = {
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

  const cancelLink = `/inventory/products/${speciesId}/packTypes${search}`;

  const [handleCreate] = api.useCreateCommonPackType();
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [changes, setChanges] = useState<CommonPackType>(
    initialState as CommonPackType,
  );

  const handleChange = (field: keyof CommonPackType, value: any) => {
    setChanges({ ...changes, [field]: value } as CommonPackType);
  };

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels(packMasters))) {
      setLoading(true);
      handleCreate({
        variables: {
          commonPackType: { ...changes, commonSpeciesId: speciesId },
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
            <b.Primary width={88}>Cancel</b.Primary>
          </l.AreaLink>
          <b.Primary ml={th.spacing.md} onClick={handleSave} width={88}>
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
          </b.Primary>
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
          to={`/inventory/products/${species?.id}/packTypes`}
        >
          {species?.speciesName}
        </ty.LinkText>
      </ty.BodyText>
      <BaseData<CommonPackType>
        changes={changes}
        data={changes}
        editing={true}
        handleChange={handleChange}
        labels={baseLabels(packMasters)}
        showValidation={saveAttempt}
      />
    </Page>
  );
};

export default CreateCommonPackType;
