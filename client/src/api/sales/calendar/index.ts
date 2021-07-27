import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { Mutation, Query } from 'types';

const CALENDAR_EVENT_LIST_QUERY = loader('./list.gql');
const CALENDAR_EVENT_DETAILS_QUERY = loader('./details.gql');
const CALENDAR_EVENT_CREATE_QUERY = loader('./create.gql');
const CALENDAR_EVENT_UPDATE_QUERY = loader('./update.gql');
const CALENDAR_EVENT_DELETE_QUERY = loader('./delete.gql');

export const useCalendarEvents = () => {
  const { data, error, loading } = useQuery<Query>(CALENDAR_EVENT_LIST_QUERY);

  return {
    data: data ? data.calendarEvents : undefined,
    error,
    loading,
  };
};

export const useCalendarEvent = (id: string) => {
  const { data, error, loading } = useQuery<Query>(
    CALENDAR_EVENT_DETAILS_QUERY,
    {
      variables: {
        id,
      },
    },
  );

  return {
    data: data ? data.calendarEvents : undefined,
    error,
    loading,
  };
};

export const useCreateCalendarEvent = () =>
  useMutation<Mutation>(CALENDAR_EVENT_CREATE_QUERY, {
    refetchQueries: [
      {
        query: CALENDAR_EVENT_LIST_QUERY,
      },
    ],
  });

export const useUpdateCalendarEvent = () =>
  useMutation<Mutation>(CALENDAR_EVENT_UPDATE_QUERY, {
    refetchQueries: [
      {
        query: CALENDAR_EVENT_LIST_QUERY,
      },
    ],
  });

export const useDeleteCalendarEvent = () =>
  useMutation<Mutation>(CALENDAR_EVENT_DELETE_QUERY, {
    refetchQueries: [
      {
        query: CALENDAR_EVENT_LIST_QUERY,
      },
    ],
  });
