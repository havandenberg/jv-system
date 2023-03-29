import React from 'react';
import { ApolloError } from '@apollo/client';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { equals } from 'ramda';

import CloseInCircle from 'assets/images/close-in-circle';
import { formatDate } from 'components/date-range-picker';
import { DataMessage } from 'components/page/message';
import StatusIndicator from 'components/status-indicator';
import { useProjectionsQueryParams } from 'hooks/use-query-params';
import {
  Maybe,
  Shipper,
  ShipperProjection,
  ShipperProjectionVesselInfo,
  Vessel,
} from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import { Select } from 'ui/input';
import l, { divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { hexColorWithTransparency } from 'ui/utils';
import { getCurrentWeekNumber, getWeekNumber } from 'utils/date';

import CommentsModal from '../comments';
import { ShipperProjectionGridProps } from '../types';
import VesselHeader, { GhostVesselHeader, ParentVesselHeader } from './header';

export const VesselWrapper = styled(l.Grid)(
  ({
    index,
    selectedShipper,
    status,
    vesselId,
  }: {
    index?: number;
    selectedShipper?: Maybe<Shipper>;
    status?: keyof typeof th.colors.status;
    vesselId?: string | null;
  }) => ({
    alignItems: 'center',
    background: status
      ? hexColorWithTransparency(th.colors.status[status], 0.2)
      : index !== undefined && index % 2 === 0
      ? th.colors.brand.containerBackground
      : undefined,
    border: th.borders.secondary,
    gridTemplateRows: `repeat(${selectedShipper || !vesselId ? 4 : 5}, 1fr)`,
    padding: th.spacing.sm,
    position: 'relative',
    height: `calc(${th.sizes.fill} - ${th.spacing.md} - 2px)`,
    '.react-date-picker': {
      width: th.sizes.fill,
    },
    '.react-date-picker__wrapper': {
      background: th.colors.background,
      border: 0,
    },
    '.react-date-picker__inputGroup__input': {
      fontSize: th.fontSizes.caption,
      color: th.colors.text.default,
    },
  }),
  divPropsSet,
);

interface Props extends ShipperProjectionGridProps {
  currentProjections?: Maybe<ShipperProjection>[];
  error?: ApolloError;
  ghostVesselDates: string[];
  gridTemplateColumns: string;
  hasVessels: boolean;
  loading: boolean;
  matchAllCommonProducts: boolean;
  parentVessels: Vessel[];
  productCount: number;
  selectedVessel?: Vessel;
  showErrors: boolean;
  showOnlyCommonNames: boolean;
  skippedWeeks: string[];
  toggleMatchAllCommonProducts: () => void;
  toggleShowOnlyCommonNames: () => void;
  toggleSkippedWeeks: (weekToSkip: string) => void;
  vesselId?: string | null;
  vessels: ShipperProjectionVesselInfo[];
}

const Vessels = ({
  currentProjections,
  currentProjection,
  error,
  gridTemplateColumns,
  hasVessels,
  loading,
  matchAllCommonProducts,
  parentVessels,
  productCount,
  selectedShipper,
  toggleMatchAllCommonProducts,
  toggleShowOnlyCommonNames,
  selectedVessel,
  showErrors,
  showOnlyCommonNames,
  showParentVessels,
  skippedWeeks,
  toggleSkippedWeeks,
  vesselId,
  vessels,
  ...rest
}: Props) => {
  const [{ startDate }, setProjectionsParams] = useProjectionsQueryParams();
  const selectedWeekNumber = startDate
    ? getWeekNumber(new Date(startDate.replace(/-/g, '/')))
    : getCurrentWeekNumber();

  const { isAllProjections, isPortal } = rest;
  const editable = isPortal && isAllProjections;

  const hasSelectedVessels = selectedVessel || vesselId === 'all';
  const vesselCount = showParentVessels ? parentVessels.length : vessels.length;

  return (
    <>
      <l.Grid
        alignCenter
        bg={th.colors.background}
        gridColumnGap={th.spacing.md}
        gridTemplateColumns={gridTemplateColumns}
        height={150}
        pt={th.sizes.md}
        position="sticky"
        top={0}
        zIndex={5}
      >
        <l.Flex alignCenter justifyBetween height={th.sizes.fill}>
          <l.Flex column justifyBetween height={th.sizes.fill} width={280}>
            <l.Flex mt={`-${th.sizes.icon}`}>
              {currentProjections ? (
                <l.Div flex={1}>
                  <ty.SmallText ml={th.spacing.sm} mb={th.spacing.sm} secondary>
                    {currentProjections.length} projection
                    {currentProjections.length === 1 ? '' : 's'} submitted
                    {currentProjections.length > 0 ? ':' : ''}
                  </ty.SmallText>
                  <>
                    <l.Flex alignCenter mb={th.spacing.md}>
                      <Select
                        onChange={(e) => {
                          setProjectionsParams({
                            projectionId: e.target.value,
                          });
                        }}
                        value={currentProjection?.id}
                      >
                        <option key="all" value="all">
                          {isPortal ? 'New projection' : 'Latest projections'}
                        </option>
                        {currentProjections.map((projection) => {
                          const { id, submittedAt } = projection || {};
                          return (
                            <option
                              key={id}
                              style={{
                                color:
                                  th.colors.status[
                                    projection?.reviewStatus === 2
                                      ? 'success'
                                      : currentProjection?.reviewStatus === 0
                                      ? 'error'
                                      : 'warning'
                                  ],
                              }}
                              value={id}
                            >
                              {format(
                                new Date(submittedAt),
                                'EE, MMM d, h:mm a',
                              )}
                            </option>
                          );
                        })}
                      </Select>
                      {!isPortal && (
                        <>
                          {currentProjection && (
                            <l.Div ml={th.spacing.md}>
                              <StatusIndicator
                                status={
                                  currentProjection?.reviewStatus === 2
                                    ? 'success'
                                    : currentProjection?.reviewStatus === 0
                                    ? 'error'
                                    : 'warning'
                                }
                              />
                            </l.Div>
                          )}
                          <l.Div ml={th.spacing.md}>
                            <CommentsModal
                              currentProjectionId={currentProjection?.id}
                              currentProjections={
                                currentProjections as ShipperProjection[]
                              }
                              selectedShipper={selectedShipper as Shipper}
                            />
                          </l.Div>
                        </>
                      )}
                    </l.Flex>
                    {!isPortal && currentProjection && (
                      <>
                        <l.Div mb={th.spacing.sm}>
                          <LineItemCheckbox
                            checked={matchAllCommonProducts}
                            label={
                              <ty.SmallText ml={th.spacing.sm} nowrap>
                                Match all linked products
                              </ty.SmallText>
                            }
                            onChange={toggleMatchAllCommonProducts}
                          />
                        </l.Div>
                        <LineItemCheckbox
                          checked={showOnlyCommonNames}
                          label={
                            <ty.SmallText ml={th.spacing.sm} nowrap>
                              Show linked names
                            </ty.SmallText>
                          }
                          onChange={toggleShowOnlyCommonNames}
                        />
                      </>
                    )}
                  </>
                </l.Div>
              ) : (
                <l.Div />
              )}
            </l.Flex>
            <l.Flex justifyBetween mt={th.sizes.icon}>
              <ty.BodyText bold>Products &#x2193;</ty.BodyText>
              <ty.BodyText bold>
                {isPortal || !vesselId ? 'Vessels' : 'Loadings'}{' '}
                <ty.Span fontWeight={th.fontWeights.normal}>
                  (
                  {
                    (
                      (showParentVessels ? parentVessels : vessels) as (
                        | Vessel
                        | ShipperProjectionVesselInfo
                      )[]
                    ).filter((v) => v.id !== 0).length
                  }
                  )
                </ty.Span>{' '}
                &#x2192;
              </ty.BodyText>
            </l.Flex>
          </l.Flex>
          {!isPortal && !currentProjection && (
            <VesselWrapper
              display={selectedVessel ? undefined : 'flex'}
              height={132}
              ml={th.spacing.md}
              width={118}
            >
              <l.Flex
                alignCenter
                justifyBetween
                ml={selectedVessel ? undefined : `-${th.spacing.sm}`}
                position="absolute"
                top={`-${th.sizes.icon}`}
                width={th.sizes.fill}
              >
                <ty.SmallText secondary>Selected vessel:</ty.SmallText>
                {hasSelectedVessels ? (
                  <l.HoverButton
                    dark
                    onClick={() => {
                      setProjectionsParams({ vesselId: undefined });
                    }}
                  >
                    <CloseInCircle height={th.sizes.xs} width={th.sizes.xs} />
                  </l.HoverButton>
                ) : (
                  <l.Div width={th.sizes.xs} />
                )}
              </l.Flex>
              {selectedVessel && (
                <ty.LinkText
                  bold
                  hover
                  fontSize={th.fontSizes.caption}
                  to={`/inventory/vessels/${selectedVessel.id}?isPre=${
                    selectedVessel.isPre ? 1 : 0
                  }`}
                >
                  {selectedVessel.vesselCode}
                </ty.LinkText>
              )}
              {selectedVessel && (
                <ty.CaptionText
                  bold
                  nowrap
                  overflow="hidden"
                  textOverflow="ellipsis"
                  title={selectedVessel.vesselName}
                >
                  {selectedVessel.vesselName}
                </ty.CaptionText>
              )}
              {selectedVessel && (
                <ty.CaptionText>
                  {format(
                    new Date(selectedVessel.departureDate.replace(/-/g, '/')),
                    'EEE, MMM dd',
                  )}
                </ty.CaptionText>
              )}
              {selectedVessel && (
                <ty.CaptionText>
                  {format(
                    new Date(selectedVessel.arrivalDate.replace(/-/g, '/')),
                    'EEE, MMM dd',
                  )}
                </ty.CaptionText>
              )}
              {!selectedVessel &&
                (vesselId === 'all' ? (
                  <ty.CaptionText center width={th.sizes.fill}>
                    All vessels
                  </ty.CaptionText>
                ) : (
                  <l.Div width={th.sizes.fill}>
                    <ty.CaptionText center>None</ty.CaptionText>
                    <ty.TriggerText
                      active
                      bold
                      center
                      fontSize={th.fontSizes.caption}
                      mt={th.spacing.sm}
                      onClick={() => {
                        setProjectionsParams({ vesselId: 'all' });
                      }}
                    >
                      Select All
                    </ty.TriggerText>
                  </l.Div>
                ))}
            </VesselWrapper>
          )}
          <VesselWrapper
            border={0}
            selectedShipper={selectedShipper}
            vesselId={vesselId}
          >
            <ty.CaptionText
              position="absolute"
              right={th.spacing.sm}
              secondary
              top={`-${th.sizes.icon}`}
            >
              Week Number:
            </ty.CaptionText>
            {(!selectedShipper || !vesselId) && (
              <ty.CaptionText textAlign="right" secondary>
                {vesselId ? 'Shipper Name:' : 'Vessel Code:'}
              </ty.CaptionText>
            )}
            <ty.CaptionText textAlign="right" secondary>
              Vessel Name
              {isPortal ? (
                <ty.Span color={th.colors.status.error}>*</ty.Span>
              ) : (
                ''
              )}
              :
            </ty.CaptionText>
            <ty.CaptionText textAlign="right" secondary>
              Est. Departure Date
              {isPortal ? (
                <ty.Span color={th.colors.status.error}>*</ty.Span>
              ) : (
                ''
              )}
              :
            </ty.CaptionText>
            <ty.CaptionText textAlign="right" secondary>
              Est. Arrival Date
              {isPortal ? (
                <ty.Span color={th.colors.status.error}>*</ty.Span>
              ) : (
                ''
              )}
              :
            </ty.CaptionText>
            {vesselId && (
              <ty.CaptionText textAlign="right" secondary>
                Vessel Status
                {isPortal ? (
                  <ty.Span color={th.colors.status.error}>*</ty.Span>
                ) : (
                  ''
                )}
                :
              </ty.CaptionText>
            )}
          </VesselWrapper>
        </l.Flex>
        {!loading && (parentVessels.length > 0 || vessels.length > 0) ? (
          <>
            {
              (
                (showParentVessels ? parentVessels : vessels) as (
                  | Vessel
                  | ShipperProjectionVesselInfo
                )[]
              ).reduce<{
                components: React.ReactNode[];
                previousStartDate?: Date;
              }>(
                ({ components, previousStartDate }, vessel, idx) => {
                  const vesselStartDate = new Date(
                    vessel.departureDate.replace(/-/g, '/'),
                  );
                  const showDateDescription = !equals(
                    vesselStartDate,
                    previousStartDate,
                  );
                  const previousWeekNumber =
                    previousStartDate && getWeekNumber(previousStartDate);
                  const vesselWeekNumber = getWeekNumber(vesselStartDate);
                  const showLastWeekMarker = !!(
                    previousWeekNumber &&
                    previousWeekNumber !== vesselWeekNumber &&
                    previousWeekNumber <= selectedWeekNumber &&
                    vesselWeekNumber === selectedWeekNumber
                  );

                  return {
                    components: [
                      ...components,
                      vessel.id === 0 ? (
                        <GhostVesselHeader
                          editable={editable}
                          isSkipped={skippedWeeks.includes(
                            formatDate(vesselStartDate),
                          )}
                          selectedShipper={selectedShipper}
                          showDateDescription={showDateDescription}
                          showLastWeekMarker={showLastWeekMarker}
                          showErrors={showErrors}
                          showParentVessels={showParentVessels}
                          startDate={vesselStartDate}
                          toggleSkippedWeeks={() => {
                            toggleSkippedWeeks(formatDate(vesselStartDate));
                          }}
                          key={idx}
                          {...rest}
                        />
                      ) : showParentVessels ? (
                        <ParentVesselHeader
                          key={idx}
                          index={idx}
                          selectedShipper={selectedShipper}
                          showDateDescription={showDateDescription}
                          showLastWeekMarker={showLastWeekMarker}
                          showParentVessels={showParentVessels}
                          vessel={vessel as Vessel}
                          {...rest}
                        />
                      ) : (
                        <VesselHeader
                          key={idx}
                          index={idx}
                          editable={editable}
                          selectedShipper={selectedShipper}
                          showDateDescription={showDateDescription}
                          showLastWeekMarker={showLastWeekMarker}
                          showErrors={showErrors}
                          showParentVessels={showParentVessels}
                          vessel={vessel as ShipperProjectionVesselInfo}
                          vesselCount={vessels.length}
                          {...rest}
                        />
                      ),
                    ],
                    previousStartDate: vesselStartDate,
                  };
                },
                { components: [] },
              ).components
            }
          </>
        ) : (
          <DataMessage
            data={vessels}
            emptyProps={{
              header: 'No vessels found',
              wrapperStyles: {
                height: th.sizes.fill,
                width: 500,
              },
            }}
            loadingProps={{
              text: '',
              wrapperStyles: {
                height: th.sizes.fill,
                width: 500,
              },
            }}
            error={error}
            loading={loading}
          />
        )}
      </l.Grid>
      {hasVessels && !loading && (
        <l.Grid
          bg={th.colors.background}
          gridColumnGap={th.spacing.sm}
          gridTemplateColumns={gridTemplateColumns}
          pb={th.spacing.sm}
          pt={th.spacing.md}
          position="sticky"
          top={198}
          zIndex={5}
        >
          <l.Grid
            gridColumnGap={th.spacing.xs}
            gridTemplateColumns="repeat(2, 1fr) repeat(3, 0.7fr) 1fr"
            marginLeft={52}
            relative
          >
            <ty.CaptionText secondary>
              Species
              {isPortal ? (
                <ty.Span color={th.colors.status.error}>*</ty.Span>
              ) : (
                ''
              )}
            </ty.CaptionText>
            <ty.CaptionText secondary>
              Variety
              {isPortal ? (
                <ty.Span color={th.colors.status.error}>*</ty.Span>
              ) : (
                ''
              )}
            </ty.CaptionText>
            <ty.CaptionText secondary>
              Size
              {isPortal ? (
                <ty.Span color={th.colors.status.error}>*</ty.Span>
              ) : (
                ''
              )}
            </ty.CaptionText>
            <ty.CaptionText nowrap secondary>
              Pack Type
              {isPortal ? (
                <ty.Span color={th.colors.status.error}>*</ty.Span>
              ) : (
                ''
              )}
            </ty.CaptionText>
            <ty.CaptionText secondary>PLU/GTIN</ty.CaptionText>
            <ty.CaptionText secondary>Customer</ty.CaptionText>
            {hasVessels && !loading && (
              <l.Div
                borderTop={th.borders.secondary}
                position="absolute"
                left={-52}
                bottom={`-${th.spacing.sm}`}
                width={`calc(${th.sizes.fill} + ${vesselCount - 3} * 156px - ${
                  th.sizes.icon
                } + 544px)`}
              />
            )}
          </l.Grid>
        </l.Grid>
      )}
    </>
  );
};

export default Vessels;
