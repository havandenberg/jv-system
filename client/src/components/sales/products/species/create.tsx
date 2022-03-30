import React, { Fragment, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import Page from 'components/page';
import { useQueryValue } from 'hooks/use-query-params';
import { CommonCategory, CommonSpecies } from 'types';
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
    to: `/sales/products/categories/${category?.id}`,
  },
];

const initialState = {
  speciesName: '',
  speciesDescription: '',
};

const CreateCommonSpecies = () => {
  const history = useHistory();

  const [categoryIdQuery] = useQueryValue('categoryId');
  const { categoryId: categoryParam } = useParams<{ categoryId: string }>();
  const categoryId = categoryParam || categoryIdQuery;
  const { data: category } = api.useCommonCategory(categoryId || '');

  const cancelLink = `/sales/products/${
    categoryParam ? 'categories/' + categoryParam : ''
  }`;

  const [handleCreate] = api.useCreateCommonSpecies();
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [changes, setChanges] = useState<CommonSpecies>(
    initialState as CommonSpecies,
  );

  const handleChange = (field: keyof CommonSpecies, value: any) => {
    setChanges({ ...changes, [field]: value } as CommonSpecies);
  };

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels)) {
      setLoading(true);
      handleCreate({
        variables: {
          commonSpecies: { ...changes, commonCategoryId: categoryId },
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
      breadcrumbs={breadcrumbs(category as CommonCategory)}
      title="Create Species"
    >
      <ty.BodyText ml={th.spacing.sm} my={th.spacing.md}>
        Category:{' '}
        <ty.LinkText
          bold
          hover={false}
          to={`/sales/products/categories/${category?.id}`}
        >
          {category?.categoryName}
        </ty.LinkText>
      </ty.BodyText>
      <BaseData<CommonSpecies>
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

export default CreateCommonSpecies;
