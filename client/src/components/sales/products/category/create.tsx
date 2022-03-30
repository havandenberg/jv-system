import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import Page from 'components/page';
import { CommonCategory } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import { breadcrumbs } from '..';
import { baseLabels } from './data-utils';

const initialState = {
  categoryName: '',
  categoryDescription: '',
};

const CreateCommonCategory = () => {
  const history = useHistory();
  const cancelLink = '/sales/products';

  const [handleCreate] = api.useCreateCommonCategory();
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [changes, setChanges] = useState<CommonCategory>(
    initialState as CommonCategory,
  );

  const handleChange = (field: keyof CommonCategory, value: any) => {
    setChanges({ ...changes, [field]: value } as CommonCategory);
  };

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels)) {
      setLoading(true);
      handleCreate({
        variables: {
          commonCategory: changes,
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
      breadcrumbs={breadcrumbs}
      title="Create Category"
    >
      <BaseData<CommonCategory>
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

export default CreateCommonCategory;
