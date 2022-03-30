import React, { Fragment, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import Page from 'components/page';
import { CommonSpecies, CommonVariety } from 'types';
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
    to: `/sales/products/categories/${species?.commonCategory?.id}`,
  },
  {
    text: species?.speciesName || '',
    to: `/sales/products/${species?.id}/varieties`,
  },
];

const initialState = {
  varietyName: '',
  varietyDescription: '',
};

const CreateCommonVariety = () => {
  const { search } = useLocation();
  const history = useHistory();

  const { speciesId } = useParams<{
    speciesId: string;
  }>();
  const { data: species } = api.useCommonSpecies(speciesId || '');
  const cancelLink = `/sales/products/${speciesId}/varieties${search}`;

  const [handleCreate] = api.useCreateCommonVariety();
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [changes, setChanges] = useState<CommonVariety>(
    initialState as CommonVariety,
  );

  const handleChange = (field: keyof CommonVariety, value: any) => {
    setChanges({ ...changes, [field]: value } as CommonVariety);
  };

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels)) {
      setLoading(true);
      handleCreate({
        variables: {
          commonVariety: { ...changes, commonSpeciesId: speciesId },
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
      title="Create Variety"
    >
      <ty.BodyText ml={th.spacing.sm} my={th.spacing.md}>
        Species:{' '}
        <ty.LinkText bold hover={false} to={`/sales/products/${species?.id}`}>
          {species?.speciesName}
        </ty.LinkText>
      </ty.BodyText>
      <BaseData<CommonVariety>
        changes={changes}
        data={changes}
        editing={true}
        handleChange={handleChange}
        labels={baseLabels}
        showValidation={saveAttempt}
      />
    </Page>
  );
};

export default CreateCommonVariety;
