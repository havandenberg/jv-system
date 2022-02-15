import React from 'react';
import styled from '@emotion/styled';

import Chevron from 'assets/images/chevron';
import { baseDataTransforms } from 'components/base-data';
import { LabelInfo } from 'components/column-label';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { useQuerySet } from 'hooks/use-query-params';
import { StringParam } from 'use-query-params';

const GridContainer = styled(l.Grid)(
  ({ selected }: { selected?: boolean }) => ({
    background: selected
      ? th.colors.brand.containerBackgroundAccent
      : th.colors.brand.containerBackground,
    border: selected ? th.borders.secondary : th.borders.disabled,
    borderRadius: th.borderRadii.default,
    paddingLeft: th.spacing.sm,
    transition: th.transitions.default,
    ':hover': {
      background: th.colors.brand.containerBackgroundAccent,
      border: th.borders.secondary,
    },
  }),
);

const ListItem = <T extends {}>({
  data,
  gridTemplateColumns,
  handleDateChange,
  listLabels,
  shipperId,
  startDate,
}: {
  data: T;
  gridTemplateColumns: string;
  handleDateChange: () => void;
  listLabels: LabelInfo<T>[];
  shipperId?: string;
  startDate?: string;
}) => {
  const [, setQueryParams] = useQuerySet({
    endDate: StringParam,
    shipperId: StringParam,
    startDate: StringParam,
    view: StringParam,
  });
  return (
    <l.Div mb={th.spacing.sm}>
      <l.Div
        cursor="pointer"
        onClick={() => {
          handleDateChange();
          setQueryParams({
            endDate: startDate,
            shipperId,
            startDate,
            view: 'grid',
          });
        }}
      >
        <GridContainer gridTemplateColumns={gridTemplateColumns}>
          {listLabels.map(({ allowClick, key, getValue, transformKey }) => (
            <l.Flex
              alignCenter
              key={`${key}`}
              overflow="hidden"
              p={th.spacing.sm}
            >
              <ty.BodyText
                nowrap
                onClick={(e: React.MouseEvent) => {
                  !allowClick && e.stopPropagation();
                }}
              >
                {(transformKey
                  ? baseDataTransforms[transformKey](data[key])
                  : getValue
                  ? getValue(data)
                  : data[key]) || '-'}
              </ty.BodyText>
            </l.Flex>
          ))}
          <l.Flex centered height={th.sizes.fill}>
            <Chevron height={th.spacing.md} />
          </l.Flex>
        </GridContainer>
      </l.Div>
    </l.Div>
  );
};

export default ListItem;
