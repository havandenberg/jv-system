import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { loader } from 'graphql.macro';
import { pathOr } from 'ramda';

import FilterImg from 'assets/images/filter';
import useOutsideClickRef from 'hooks/use-outside-click-ref';
import usePrevious from 'hooks/use-previous';
import { useQueryValue } from 'hooks/use-query-params';
import { Query } from 'types';
import Checkbox from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const DISTINCT_VALUES_QUERY = loader('../api/distinct-values.gql');

const Panel = styled(l.Div)({
  borderRadius: th.borderRadii.default,
  border: th.borders.secondary,
  background: th.colors.background,
  boxShadow: th.shadows.box,
  cursor: 'default',
  height: 300,
  left: `-${th.spacing.xs}`,
  padding: th.spacing.sm,
  opacity: 1,
  position: 'absolute',
  top: 24,
  width: 300,
  zIndex: 5,
});

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

const FilterPanel = <T extends {}>({
  filterKey,
  tableName,
  visible,
}: {
  filterKey: keyof T;
  tableName: string;
  visible: boolean;
}) => {
  const [show, setShow] = useState(false);
  const ref = useOutsideClickRef(() => {
    setShow(false);
  });
  const [tabId] = useQueryValue('reportType');
  const previousTabId = usePrevious(tabId);

  const { data } = useQuery<Query>(DISTINCT_VALUES_QUERY, {
    variables: {
      columnName: filterKey,
      tableName,
    },
  });
  const filterOptions: string[] = pathOr([], ['distinctValues', 'nodes'], data);
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
        <Panel key={`${filterKey}`}>
          <l.Flex
            justifyBetween
            mb={th.spacing.sm}
            mt={th.spacing.xs}
            mx={th.spacing.xs}
            pb={th.spacing.xs}
          >
            <ty.CaptionText mr={th.spacing.md} secondary>
              Filter by:
            </ty.CaptionText>
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
          {filterOptions.map((option) => (
            <Checkbox
              checked={selectedValues.includes(option)}
              key={option}
              label={option}
              onChange={() => handleFilterChange(option)}
            />
          ))}
        </Panel>
      )}
    </l.Div>
  );
};

export default FilterPanel;
