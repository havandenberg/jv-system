import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { formatDate } from 'components/date-range-picker';
import { useDateRangeQueryParams } from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const AGENDA_ITEMS_QUERY = loader('./items.gql');
const AGENDA_ITEMS_UPDATE = loader('./update.gql');
const AGENDA_ITEM_DELETE = loader('./delete.gql');

const useDateVariables = () => {
  const [{ startDate = formatDate(new Date()) }] = useDateRangeQueryParams();
  return {
    date: formatDate(new Date(startDate.replace(/-/g, '/'))),
  };
};

export const useAgendaItems = () => {
  const variables = useDateVariables();
  const { data, error, loading } = useQuery<Query>(AGENDA_ITEMS_QUERY, {
    variables,
  });

  return {
    data: data ? data.agendaItems : undefined,
    error,
    loading,
  };
};

export const useUpdateAgendaItems = () => {
  const variables = useDateVariables();
  return useMutation<Mutation>(AGENDA_ITEMS_UPDATE, {
    refetchQueries: [
      {
        query: AGENDA_ITEMS_QUERY,
        variables,
      },
    ],
  });
};

export const useDeleteAgendaItem = () => {
  const variables = useDateVariables();
  return useMutation<Mutation>(AGENDA_ITEM_DELETE, {
    refetchQueries: [
      {
        query: AGENDA_ITEMS_QUERY,
        variables,
      },
    ],
  });
};
