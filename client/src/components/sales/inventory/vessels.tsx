import React from 'react';
import styled from '@emotion/styled';
import { startOfISOWeek } from 'date-fns';
import { times } from 'ramda';

import ArrowInCircle from 'assets/images/arrow-in-circle';
import { formatDate } from 'components/date-range-picker';
import {
  useDateRangeQueryParams,
  useInventoryQueryParams,
} from 'hooks/use-query-params';
import { Vessel } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { gridTemplateColumns } from '.';
import { useInventoryContext } from './context';
import { getFilteredVessels } from './utils';

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
    background: th.colors.brand.containerBackgroundAccent,
  },
}));

interface Props {
  vessels: (Vessel & { shipperId?: string })[];
}

const InventoryVessels = ({ vessels }: Props) => {
  const [{ coast }] = useInventoryQueryParams();
  const [
    { startDate = formatDate(new Date()), endDate = formatDate(new Date()) },
  ] = useDateRangeQueryParams();
  const currentStartOfWeek = startOfISOWeek(
    new Date(startDate.replace(/-/g, '/')),
  );

  const [{ vesselsIsOpen: isOpen, ...state }, setState] = useInventoryContext();

  return (
    <>
      <l.Grid
        alignStart
        gridTemplateColumns={gridTemplateColumns}
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
          const filteredVessels = getFilteredVessels(
            vessels,
            idx,
            currentStartOfWeek,
          );
          return (
            <l.Div
              borderLeft={idx === 0 ? th.borders.disabled : 0}
              borderRight={idx >= 11 ? th.borders.disabled : 0}
              height={`calc(${th.sizes.fill} - ${th.spacing.sm})`}
              key={idx}
              pb={th.spacing.xs}
              pt={th.spacing.sm}
            >
              <l.Flex flexWrap="wrap" mx="auto">
                {filteredVessels.map((vessel, idy) => {
                  const isPre = vessel.vesselCode.includes('PRE-');
                  if (isPre && idx < 7) {
                    return null;
                  }
                  return (
                    <l.Div key={idy} mb={th.spacing.xs} mx={th.spacing.tn}>
                      <l.AreaLink
                        title={`${vessel.vesselName} (${vessel.vesselCode})`}
                        to={
                          isPre
                            ? `/sales/projections?coast=${coast}&startDate=${startDate}&endDate=${endDate}&view=grid&shipperId=${vessel.shipperId}`
                            : `/sales/vessels/${vessel.id}`
                        }
                      >
                        <VesselLink isPre={isPre}>
                          <ty.SmallText>
                            {coast === 'EC'
                              ? vessel.vesselName?.slice(0, 3)
                              : vessel.vesselName?.slice(3, 6)}
                          </ty.SmallText>
                        </VesselLink>
                      </l.AreaLink>
                    </l.Div>
                  );
                })}
                <l.Div />
              </l.Flex>
            </l.Div>
          );
        }, 12)}
        <l.Div
          borderRight={th.borders.disabled}
          height={th.sizes.fill}
          width={`calc(${th.sizes.fill} - 1px)`}
        />
      </l.Grid>
      <l.Grid
        alignCenter
        borderLeft={th.borders.disabled}
        gridTemplateColumns={gridTemplateColumns}
      >
        <l.Div />
        <l.Div borderLeft={th.borders.disabled} height={th.spacing.xs} />
        <l.Div
          borderLeft={th.borders.disabled}
          borderRight={th.borders.disabled}
          height={th.spacing.xs}
          gridColumn="3 / 15"
        />
        <l.Div borderRight={th.borders.disabled} height={th.spacing.xs} />
      </l.Grid>
    </>
  );
};

export default InventoryVessels;
