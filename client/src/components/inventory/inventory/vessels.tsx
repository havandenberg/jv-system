import React from 'react';
import styled from '@emotion/styled';
import { times } from 'ramda';

import ArrowInCircle from 'assets/images/arrow-in-circle';
import { formatDate } from 'components/date-range-picker';
import { useDateRangeQueryParams } from 'hooks/use-query-params';
import { Vessel } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { gridTemplateColumns } from '.';
import { useInventoryContext } from './context';
import { getFilteredVessels, getInventoryStartDayIndex } from './utils';
import { hexColorWithTransparency } from 'ui/utils';

const VesselLink = styled(l.Flex)(({ isPre }: { isPre: boolean }) => ({
  alignItems: 'center',
  background: isPre
    ? `${th.colors.status.warning}33`
    : th.colors.brand.containerBackground,
  border: isPre ? th.borders.warning : th.borders.secondary,
  borderRadius: th.borderRadii.input,
  justifyContent: 'center',
  padding: `${th.spacing.tn} ${th.spacing.xs}`,
  transition: th.transitions.default,
  width: 26,
  ':hover': {
    background: isPre
      ? hexColorWithTransparency(th.colors.status.warning, 0.4)
      : th.colors.brand.containerBackgroundAccent,
  },
}));

interface Props {
  vessels: (Vessel & { shipperId?: string })[];
}

const InventoryVessels = ({ vessels }: Props) => {
  const [{ startDate = formatDate(new Date()) }] = useDateRangeQueryParams();
  const currentStartOfWeek = new Date(startDate.replace(/-/g, '/'));
  const inventoryStartDayIndex = getInventoryStartDayIndex(startDate);

  const [{ vesselsIsOpen: isOpen, ...state }, setState] = useInventoryContext();

  return (
    <>
      <l.Grid
        alignStart
        gridTemplateColumns={gridTemplateColumns(startDate)}
        height={isOpen ? undefined : th.sizes.lg}
        minHeight={th.sizes.lg}
        overflow={isOpen ? 'visible' : 'hidden'}
      >
        <l.Flex
          borderLeft={th.borders.disabled}
          cursor="pointer"
          height={th.sizes.fill}
          justifyCenter
          onClick={() => setState({ ...state, vesselsIsOpen: !isOpen })}
          pt={th.sizes.icon}
        >
          <ty.BodyText mr={th.spacing.sm}>Vessels</ty.BodyText>
          <l.Div
            height={th.sizes.xs}
            mt={th.spacing.xs}
            width={th.sizes.xs}
            transform={`translate(${isOpen ? -1 : -1}px,${
              isOpen ? -1 : -1
            }px) rotate(${isOpen ? -90 : 180}deg)`}
          >
            <ArrowInCircle height={th.sizes.xs} width={th.sizes.xs} />
          </l.Div>
        </l.Flex>
        <l.Div
          borderLeft={th.borders.disabled}
          height={th.sizes.fill}
          width={`calc(${th.sizes.fill} - 1px)`}
        />
        {times((idx) => {
          const filteredVessels =
            idx !== 7 - inventoryStartDayIndex &&
            idx < 12 - inventoryStartDayIndex - 1
              ? getFilteredVessels(
                  vessels,
                  idx > 7 - inventoryStartDayIndex ? idx - 1 : idx,
                  currentStartOfWeek,
                )
              : [];
          return (
            <l.Div
              borderLeft={idx === 0 ? th.borders.disabled : 0}
              borderRight={
                idx >= 12 - inventoryStartDayIndex ? th.borders.disabled : 0
              }
              height={`calc(${th.sizes.fill} - ${th.spacing.sm})`}
              key={idx}
              pb={th.spacing.xs}
              pt={th.spacing.sm}
            >
              <l.Flex flexWrap="wrap" mx="auto">
                {filteredVessels.map((vessel, idy) => (
                  <l.Div key={idy} mb={th.spacing.xs} mx={th.spacing.tn}>
                    <l.AreaLink
                      title={`${vessel.vesselName} (${vessel.vesselCode})`}
                      to={`/inventory/vessels/${vessel.vesselCode}?isPre=${
                        vessel.isPre ? 1 : 0
                      }`}
                    >
                      <VesselLink isPre={!!vessel.isPre}>
                        <ty.SmallText>
                          {vessel.vesselName?.slice(0, 3)}
                        </ty.SmallText>
                      </VesselLink>
                    </l.AreaLink>
                  </l.Div>
                ))}
                <l.Div />
              </l.Flex>
            </l.Div>
          );
        }, 13 - inventoryStartDayIndex)}
        <l.Div
          borderRight={th.borders.disabled}
          height={th.sizes.fill}
          width={`calc(${th.sizes.fill} - 1px)`}
        />
      </l.Grid>
      <l.Grid
        alignCenter
        borderLeft={th.borders.disabled}
        gridTemplateColumns={gridTemplateColumns(startDate)}
      >
        <l.Div />
        <l.Div borderLeft={th.borders.disabled} height={th.spacing.xs} />
        <l.Div
          borderLeft={th.borders.disabled}
          borderRight={th.borders.disabled}
          height={th.spacing.xs}
          gridColumn={`3 / ${16 - inventoryStartDayIndex}`}
        />
        <l.Div borderRight={th.borders.disabled} height={th.spacing.xs} />
      </l.Grid>
    </>
  );
};

export default InventoryVessels;
