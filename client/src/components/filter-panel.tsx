import React, { useEffect, useState } from 'react';
import { OperationVariables, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { snakeCase } from 'change-case';
import { loader } from 'graphql.macro';
import { pathOr } from 'ramda';

import FilterImg from 'assets/images/filter';
import useOutsideClickRef from 'hooks/use-outside-click-ref';
import usePrevious from 'hooks/use-previous';
import { useQueryValue } from 'hooks/use-query-params';
import { Query } from 'types';
import { FilterCheckbox } from 'ui/checkbox';
import l, { DivProps, divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const DISTINCT_VALUES_QUERY = loader('../api/distinct-values.gql');

const Panel = styled(l.Div)(
  {
    borderRadius: th.borderRadii.default,
    border: th.borders.secondary,
    background: th.colors.background,
    boxShadow: th.shadows.box,
    cursor: 'default',
    maxHeight: 300,
    left: `-${th.spacing.xs}`,
    padding: th.spacing.sm,
    opacity: 1,
    position: 'absolute',
    top: 24,
    width: 300,
    zIndex: 5,
  },
  divPropsSet,
);

const Trigger = styled(l.Div)(
  ({
    hasFilters,
    show,
    visible,
  }: {
    hasFilters: boolean;
    show: boolean;
    visible: boolean;
  }) => ({
    background: th.colors.background,
    opacity: hasFilters || show ? 1 : visible ? th.opacities.secondary : 0,
    transition: th.transitions.default,
    ':hover': {
      opacity: 1,
    },
  }),
);

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
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useOutsideClickRef(() => {
    setShow(false);
  });
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
    .filter(
      (option: string) =>
        !!option && option.toLowerCase().includes(search.toLowerCase()),
    )
    .map((option: string) => option.trim())
    .sort();
  const previousFilterOptions = usePrevious(filterOptions);
  const [queryValue, setQueryValue] = useQueryValue(`${filterKey}`);
  const queryValueList = queryValue ? queryValue.split(',') : [];
  const externalFilterValues = queryValueList.filter((val: string) =>
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
    if (allValues) setSelectedValues(externalFilterValues);
    setQueryValue(
      allValues
        ? externalFilterValues.length > 0
          ? externalFilterValues.join(',')
          : undefined
        : [...externalFilterValues, ...selectedValues].join(','),
    );
    setShow(false);
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

  const toggleShow = () => {
    setShow(!show);
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
    <l.Div relative ref={ref}>
      <Trigger
        hasFilters={filterValues.length > 0}
        onClick={toggleShow}
        show={show}
        visible={visible}
      >
        <FilterImg height={14} width={14} />
      </Trigger>
      {show && (
        <Panel key={`${filterKey}`} {...customStyles}>
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
                  onClick={apply}
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
            {filterOptions.map((option) => (
              <FilterCheckbox
                checked={selectedValues.includes(option)}
                key={option}
                label={option}
                onChange={() => handleFilterChange(option)}
              />
            ))}
          </l.Grid>
        </Panel>
      )}
    </l.Div>
  );
};

export default FilterPanel;
