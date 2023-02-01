import React, { useEffect, useState } from 'react';
import { OperationVariables, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { snakeCase } from 'change-case';
import { loader } from 'graphql.macro';
import { Ord, pathOr, sortBy } from 'ramda';

import FilterImg from 'assets/images/filter';
import InfoPanel from 'components/info-panel';
import usePrevious from 'hooks/use-previous';
import { useQueryValue } from 'hooks/use-query-params';
import { Query } from 'types';
import { FilterCheckbox } from 'ui/checkbox';
import l, { DivProps } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { ArrayParam, useQueryParam } from 'use-query-params';

const DISTINCT_VALUES_QUERY = loader('../api/distinct-values.gql');

const SearchInput = styled.input({ width: 100 });

export interface FilterPanelProps {
  columnCount?: number;
  customOptions?: string[];
  customOptionsSort?: (opt: string) => Ord;
  customStyles?: DivProps;
  portalId?: string;
  portalLeft?: number;
  portalTop?: number;
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
  showPanel: boolean;
  setShowPanel: (show: boolean) => void;
  sortKey?: string;
  tableName: string;
  visible: boolean;
}

const FilterPanel = <T extends {}>({
  columnCount = 2,
  customOptions,
  customOptionsSort,
  customStyles,
  filterKey,
  queryProps,
  schemaName,
  setShowPanel,
  showPanel,
  showSearch,
  sortKey,
  tableName,
  visible,
  ...rest
}: Props<T>) => {
  const [search, setSearch] = useState('');
  const [tabId] = useQueryValue('reportType');
  const previousTabId = usePrevious(tabId);

  const defaultQueryVariables = {
    columnName: snakeCase(`${String(filterKey)}`),
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

  const filterOptions: string[] = sortBy(
    customOptionsSort ? customOptionsSort : (opt) => opt,
    customOptions ||
      pathOr([], [queryName, 'nodes'], data).map(
        (option: string) => option && option.trim(),
      ),
  );
  const previousFilterOptions = usePrevious(filterOptions);
  const filterOptionsBySearch = filterOptions.filter(
    (option: string) =>
      !!option && option.toLowerCase().includes(search.toLowerCase()),
  );

  const [queryValue, setQueryValue] = useQueryParam(
    sortKey ? sortKey : `${String(filterKey)}`,
    ArrayParam,
  );

  const queryValueList = (queryValue || []) as string[];
  const queryFilterValues = queryValueList.filter((val) =>
    val && filterOptions ? !filterOptions.includes(val) : false,
  ) as string[];
  const filterValues = queryValueList.filter((val) =>
    val && filterOptions ? filterOptions.includes(val) : false,
  ) as string[];
  const [selectedValues, setSelectedValues] = useState<string[]>(filterValues);

  const sortedOptions = sortBy(
    (option) => !selectedValues.includes(option),
    filterOptionsBySearch,
  );

  const dirty =
    selectedValues.sort().join(',') !== filterValues.sort().join(',');

  const apply = () => {
    const allValues = [0, filterOptions.length].includes(selectedValues.length);
    if (allValues) setSelectedValues(queryFilterValues);
    setQueryValue(
      allValues
        ? queryFilterValues.length > 0
          ? queryFilterValues
          : undefined
        : [...queryFilterValues, ...selectedValues],
    );
  };

  const clear = () => {
    setSelectedValues([]);
    setQueryValue(queryFilterValues.length > 0 ? queryFilterValues : undefined);
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
    if (
      filterOptions.length > 0 &&
      previousFilterOptions &&
      previousFilterOptions.length === 0
    ) {
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
      content={
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
                <ty.CaptionText
                  link
                  onClick={() => {
                    clear();
                    setShowPanel(false);
                  }}
                  secondary
                >
                  Clear
                </ty.CaptionText>
              )}
              {dirty && (
                <l.Div cursor="pointer">
                  <ty.CaptionText
                    color={th.colors.status.error}
                    ml={th.spacing.md}
                    onClick={() => {
                      apply();
                      setShowPanel(false);
                    }}
                  >
                    Apply
                  </ty.CaptionText>
                </l.Div>
              )}
            </l.Flex>
          </l.Flex>
          <l.Grid
            gridTemplateColumns={`repeat(${columnCount}, 1fr)`}
            maxHeight={260}
            overflowY="auto"
          >
            {sortedOptions.map((option) => (
              <l.Div key={option} mb={th.spacing.sm}>
                <FilterCheckbox
                  checked={selectedValues.includes(option)}
                  label={option}
                  onChange={() => handleFilterChange(option)}
                />
              </l.Div>
            ))}
          </l.Grid>
        </>
      }
      customStyles={customStyles}
      setShow={setShowPanel}
      show={showPanel}
      triggerIcon={<FilterImg height={14} width={14} />}
      hasFilters={filterValues.length > 0}
      visible={visible}
      {...rest}
    />
  );
};

export default FilterPanel;
