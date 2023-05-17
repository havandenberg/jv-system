import React from 'react';
import { Redirect, useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { useActiveUser } from 'components/user/context';
import { CheckHeader } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { baseLabels } from './data-utils';

const breadcrumbs = (id: string) => [
  {
    text: 'Checks',
    to: `/accounting/checks`,
  },
  {
    text: 'Check',
    to: `/accounting/checks/${id}`,
  },
];

const Details = () => {
  const {
    roles: { isAccounting },
  } = useActiveUser();

  const { checkNumber } = useParams<{
    checkNumber: string;
  }>();

  const { data: check, error, loading } = api.useCheck(checkNumber);

  if (!isAccounting) {
    return <Redirect to="/accounting" />;
  }

  return (
    <Page
      breadcrumbs={breadcrumbs(checkNumber)}
      title={check ? 'Check' : 'Loading...'}
    >
      {check ? (
        <>
          <BaseData<CheckHeader> data={check} labels={baseLabels} />
          <l.Div height={th.spacing.xxl} />
        </>
      ) : (
        <DataMessage data={check || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
