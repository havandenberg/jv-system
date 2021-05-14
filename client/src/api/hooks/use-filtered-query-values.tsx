import { OperationVariables, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { pathOr } from 'ramda';

import { Query } from 'types';

const DISTINCT_VALUES_QUERY = loader('../distinct-values.gql');

const useFilteredQueryValues = (
  queryValues: string,
  variables?: OperationVariables,
  query = DISTINCT_VALUES_QUERY,
  queryName: string = 'distinctValues',
) => {
  const { data } = useQuery<Query>(query, {
    variables,
  });
  const defaultValues: string[] = pathOr([], [queryName, 'nodes'], data)
    .filter((val) => !!val)
    .map((option: string) => option.trim());
  const filteredValues = queryValues
    ? queryValues
        .split(',')
        .filter((val: string) =>
          defaultValues.length > 0 ? defaultValues.includes(val) : false,
        )
    : [];
  return filteredValues.length > 0 ? filteredValues : defaultValues;
};

export default useFilteredQueryValues;
