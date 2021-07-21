import React, { useEffect, useState } from 'react';
import { OperationVariables, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { snakeCase } from 'change-case';
import { loader } from 'graphql.macro';
import { pathOr } from 'ramda';

import FilterImg from 'assets/images/filter';
import InfoPanel from 'components/info-panel';
import usePrevious from 'hooks/use-previous';
import { useQueryValue } from 'hooks/use-query-params';
import { Query } from 'types';
import { FilterCheckbox } from 'ui/checkbox';
import l, { DivProps } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const DISTINCT_VALUES_QUERY = loader('../api/distinct-values.gql');

const SearchInput = styled.input({ width: 100 });

export interface FilterPanelProps {
  columnCount?: number;
  customStyles?: DivProps;
  queryProps?: {
    query: any;
    queryName: string;
    queryVariables?: OperationVariables;
  };
  showSearch?: boolean;
}

interface Props<T> extends FilterPanelProps {
  filterKey: keyof T;
  schemaName: string;
  tableName: string;
  visible: boolean;
}

const FilterPanel = <T extends {}>({
  columnCount = 2,
  customStyles,
  filterKey,
  queryProps,
  schemaName,
  showSearch,
  tableName,
  visible,
}: Props<T>) => {
  const [search, setSearch] = useState('');
  const [tabId] = useQueryValue('reportType');
  const previousTabId = usePrevious(tabId);

  const defaultQueryVariables = {
    columnName: snakeCase(`${filterKey}`),
    tableName,
    schemaName,
  };

  const query = queryProps ? queryProps.query : DISTINCT_VALUES_QUERY;
  const queryName = queryProps ? queryProps.queryName : 'distinctValues';
  const variables = queryProps
    ? queryProps.queryVariables || defaultQueryVariables
    : defaultQueryVariables;

  const { data } = useQuery<Query>(query, {
    variables,
  });

  const filterOptions: string[] = pathOr([], [queryName, 'nodes'], data)
    .map((option: string) => option && option.trim())
    .sort();
  const previousFilterOptions = usePrevious(filterOptions);
  const filterOptionsBySearch = filterOptions.filter(
    (option: string) =>
      !!option && option.toLowerCase().includes(search.toLowerCase()),
  );

  const [queryValue, setQueryValue] = useQueryValue(`${filterKey}`);
  const queryValueList = queryValue ? queryValue.split(',') : [];
  const queryFilterValues = queryValueList.filter((val: string) =>
    filterOptions ? !filterOptions.includes(val) : false,
  );
  const filterValues = queryValueList.filter((val: string) =>
    filterOptions ? filterOptions.includes(val) : false,
  );
  const [selectedValues, setSelectedValues] = useState<string[]>(filterValues);

  const dirty =
    selectedValues.sort().join(',') !== filterValues.sort().join(',');

  const apply = () => {
    const allValues = [0, filterOptions.length].includes(selectedValues.length);
    if (allValues) setSelectedValues(queryFilterValues);
    setQueryValue(
      allValues
        ? queryFilterValues.length > 0
          ? queryFilterValues.join(',')
          : undefined
        : [...queryFilterValues, ...selectedValues].join(','),
    );
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
  };

  const handleFilterChange = (newFilterKey: string) => {
    if (selectedValues.includes(newFilterKey)) {
      const newValues = selectedValues.filter(
        (filter) => filter !== newFilterKey,
      );
      setSelectedValues(newValues.length > 0 ? newValues : []);
    } else {
      setSelectedValues([...selectedValues, newFilterKey]);
    }
  };

  useEffect(() => {
    if (filterOptions && !previousFilterOptions) {
      setSelectedValues(filterValues);
    }
  }, [filterOptions, filterValues, previousFilterOptions]);

  useEffect(() => {
    if (tabId !== previousTabId) {
      setSelectedValues(filterValues);
    }
  }, [filterValues, previousTabId, tabId]);

  return (
    <InfoPanel
      content={({ setShow }) => (
        <>
          <l.Flex
            alignCenter
            justifyBetween
            mb={th.spacing.sm}
            mt={th.spacing.xs}
            mx={th.spacing.xs}
            pb={th.spacing.xs}
          >
            <l.Flex alignCenter>
              <ty.CaptionText mr={th.spacing.sm} secondary>
                Filter by:
              </ty.CaptionText>
              {showSearch && (
                <SearchInput
                  autoFocus
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  value={search}
                />
              )}
            </l.Flex>
            <l.Flex>
              {selectedValues.length > 0 && (
                <ty.CaptionText link onClick={clear} secondary>
                  Clear
                </ty.CaptionText>
              )}
              {dirty && (
                <ty.CaptionText
                  link
                  ml={th.spacing.md}
                  onClick={() => {
                    apply();
                    setShow(false);
                  }}
                  secondary
                >
                  Apply
                </ty.CaptionText>
              )}
            </l.Flex>
          </l.Flex>
          <l.Grid
            gridTemplateColumns={`repeat(${columnCount}, 1fr)`}
            maxHeight={260}
            overflowY="auto"
          >
            {filterOptionsBySearch.map((option) => (
              <FilterCheckbox
                checked={selectedValues.includes(option)}
                key={option}
                label={option}
                onChange={() => handleFilterChange(option)}
              />
            ))}
          </l.Grid>
        </>
      )}
      customStyles={customStyles}
      triggerIcon={<FilterImg height={14} width={14} />}
      visible={visible}
    />
  );
};

export default FilterPanel;
