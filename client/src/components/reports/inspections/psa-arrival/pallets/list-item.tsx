import React from 'react';
import styled from '@emotion/styled';

import Chevron from 'assets/images/chevron';
import { baseDataTransforms } from 'components/base-data';
import { LabelInfo } from 'components/column-label';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { gridTemplateColumns as defaultGridTemplateColumns } from '.';

const GridContainer = styled(l.Grid)({
  background: th.colors.brand.containerBackground,
  border: th.borders.disabled,
  borderRadius: th.borderRadii.default,
  paddingLeft: th.spacing.sm,
  transition: th.transitions.default,
  ':hover': {
    background: th.colors.brand.containerBackgroundAccent,
    border: th.borders.secondary,
  },
});

const ListItem = <T extends {}>({
  data,
  gridTemplateColumns,
  listLabels,
  slug,
}: {
  data: T;
  gridTemplateColumns?: string;
  listLabels: LabelInfo<T>[];
  slug: string;
}) => (
  <l.Div mb={th.spacing.sm}>
    <l.AreaLink to={`/reports/inspections/arrival/${slug}`}>
      <GridContainer
        gridTemplateColumns={gridTemplateColumns || defaultGridTemplateColumns}
      >
        {listLabels.map(({ key, getValue, transformKey, transformValue }) => {
          const value = transformKey
            ? baseDataTransforms[transformKey](data[key])
            : getValue
            ? getValue(data)
            : transformValue
            ? transformValue(data[key])
            : data[key];
          return (
            <l.Flex
              alignCenter
              key={`${key}`}
              overflow="hidden"
              p={th.spacing.sm}
            >
              <ty.BodyText>{value}</ty.BodyText>
            </l.Flex>
          );
        })}
        <l.Flex centered height={th.sizes.fill}>
          <Chevron height={th.spacing.md} />
        </l.Flex>
      </GridContainer>
    </l.AreaLink>
  </l.Div>
);

export default ListItem;
