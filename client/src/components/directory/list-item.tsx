import React from 'react';
import styled from '@emotion/styled';

import Chevron from 'assets/images/chevron';
import { baseDataTransforms } from 'components/base-data';
import { LabelInfo } from 'components/column-label';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

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
  onSelectItem,
  selected,
  slug,
}: {
  data: T;
  gridTemplateColumns: string;
  listLabels: LabelInfo<T>[];
  onSelectItem: () => void;
  selected: boolean;
  slug: string;
}) => (
  <l.Div mb={th.spacing.sm}>
    <l.AreaLink to={`/directory/${slug}`}>
      <GridContainer gridTemplateColumns={gridTemplateColumns}>
        <l.Flex justifyStart centered height={th.sizes.fill}>
          <LineItemCheckbox checked={selected} onChange={onSelectItem} />
        </l.Flex>
        {listLabels.map(({ key, getValue, transformKey }) => (
          <l.Flex
            alignCenter
            key={`${key}`}
            overflow="hidden"
            p={th.spacing.sm}
          >
            <ty.BodyText
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
              }}
            >
              {transformKey
                ? baseDataTransforms[transformKey](data[key])
                : getValue
                ? getValue(data)
                : data[key]}
            </ty.BodyText>
          </l.Flex>
        ))}
        <l.Flex centered height={th.sizes.fill}>
          <Chevron height={th.spacing.md} />
        </l.Flex>
      </GridContainer>
    </l.AreaLink>
  </l.Div>
);

export default ListItem;
