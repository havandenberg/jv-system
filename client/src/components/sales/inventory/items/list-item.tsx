import React from 'react';
import styled from '@emotion/styled';

import Chevron from 'assets/images/chevron';
import { baseDataTransforms } from 'components/base-data';
import { LabelInfo } from 'components/column-label';
import { InventoryItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { hexColorWithTransparency } from 'ui/utils';

const GridContainer = styled(l.Grid)(
  ({ distress, selected }: { distress?: boolean; selected?: boolean }) => ({
    background: distress
      ? hexColorWithTransparency(th.colors.status.error, 0.2)
      : selected
      ? th.colors.brand.containerBackgroundAccent
      : th.colors.brand.containerBackground,
    border: selected ? th.borders.secondary : th.borders.disabled,
    borderRadius: th.borderRadii.default,
    paddingLeft: th.spacing.sm,
    transition: th.transitions.default,
    ':hover': {
      background: distress
        ? hexColorWithTransparency(th.colors.status.error, 0.4)
        : th.colors.brand.containerBackgroundAccent,
      border: th.borders.secondary,
    },
  }),
);

const ListItem = ({
  data,
  gridTemplateColumns,
  listLabels,
  to,
}: {
  data: InventoryItem;
  gridTemplateColumns: string;
  listLabels: LabelInfo<InventoryItem>[];
  to: string;
}) => (
  <l.Div mb={th.spacing.sm}>
    <l.AreaLink to={to}>
      <GridContainer
        distress={data ? data.jvLotNumber === 'D0000' : false}
        gridTemplateColumns={gridTemplateColumns}
      >
        {listLabels.map(
          ({ customStyles, key, getValue, transformKey }, idx) => {
            const value =
              (transformKey
                ? baseDataTransforms[transformKey](data[key])
                : getValue
                ? getValue(data)
                : data[key]) || '-';
            return (
              <l.Flex
                alignCenter
                key={idx}
                overflow="hidden"
                p={th.spacing.sm}
                title={value}
              >
                <ty.BodyText
                  nowrap
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                  }}
                  {...customStyles?.label}
                >
                  {value}
                </ty.BodyText>
              </l.Flex>
            );
          },
        )}
        <l.Flex centered height={th.sizes.fill}>
          <Chevron height={th.spacing.md} />
        </l.Flex>
      </GridContainer>
    </l.AreaLink>
  </l.Div>
);

export default ListItem;
