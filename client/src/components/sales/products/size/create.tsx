import React, { Fragment, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import Page from 'components/page';
import { CommonSpecies, CommonSize } from 'types';
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
    to: `/sales/products/${species?.id}/sizes`,
  },
];

const initialState = {
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
  const cancelLink = `/sales/products/${speciesId}/sizes${search}`;

  const [handleCreate] = api.useCreateCommonSize();
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [changes, setChanges] = useState<CommonSize>(
    initialState as CommonSize,
  );

  const handleChange = (field: keyof CommonSize, value: any) => {
    setChanges({ ...changes, [field]: value } as CommonSize);
  };

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels)) {
      setLoading(true);
      handleCreate({
        variables: {
          commonSize: { ...changes, commonSpeciesId: speciesId },
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
      title="Create Size"
    >
      <ty.BodyText ml={th.spacing.sm} my={th.spacing.md}>
        Species:{' '}
        <ty.LinkText
          bold
          hover={false}
          to={`/sales/products/${species?.id}/sizes`}
        >
          {species?.speciesName}
        </ty.LinkText>
      </ty.BodyText>
      <BaseData<CommonSize>
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

export default CreateCommonSize;
