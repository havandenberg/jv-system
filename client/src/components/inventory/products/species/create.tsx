import React, { Fragment, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import Page from 'components/page';
import { useQueryValue } from 'hooks/use-query-params';
import { CommonCategory, CommonSpecies, ProductSpecies } from 'types';
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

  const { data: productSpeciesData } = api.useProductSpeciesList();
  const productSpecieses = (productSpeciesData?.nodes ||
    []) as ProductSpecies[];

  const initialState = {
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

  const handleChange = (field: keyof CommonSpecies, value: any) => {
    setChanges({ ...changes, [field]: value } as CommonSpecies);
  };

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels(productSpecieses))) {
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
    </Page>
  );
};

export default CreateCommonSpecies;
