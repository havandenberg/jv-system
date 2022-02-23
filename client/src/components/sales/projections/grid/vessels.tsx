import React from 'react';
import { ApolloError } from '@apollo/client';
import styled from '@emotion/styled';
import { add, endOfISOWeek, format, isAfter, startOfISOWeek } from 'date-fns';
import { equals } from 'ramda';
import DatePicker from 'react-date-picker';
import { useLocation } from 'react-router-dom';

import MinusInCircle from 'assets/images/minus-in-circle';
import PlusInCircle from 'assets/images/plus-in-circle';
import { formatDate } from 'components/date-range-picker';
import EditableCell from 'components/editable-cell';
import { DataMessage } from 'components/page/message';
import StatusIndicator from 'components/status-indicator';
import { useQueryValue } from 'hooks/use-query-params';
import {
  Maybe,
  Shipper,
  ShipperProjection,
  ShipperProjectionVesselInfo,
} from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import { Select } from 'ui/input';
import l, { divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { hexColorWithTransparency } from 'ui/utils';
import { getWeekNumber, isCurrentWeek } from 'utils/date';

import CommentsModal from './comments';
import { ShipperProjectionGridProps } from './types';

const datePickerProps = {
  calendarIcon: null,
  clearIcon: null,
  disableClock: true,
  locale: 'en-US',
  required: true,
};

const vesselStatusOptions = [
  { value: 'projected', text: 'PROJECTED' },
  { value: 'loading', text: 'LOADING' },
  { value: 'executed', text: 'EXECUTED' },
  { value: 'cancelled', text: 'CANCELLED' },
];

const getVesselStatus = (vesselStatus: string) => {
  switch (vesselStatus) {
    case 'loading':
      return 'warning';
    case 'executed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return undefined;
  }
};

const GhostVesselColumn = ({
  isSkipped,
  selectedShipper,
  showDateDescription,
  showErrors,
  startDate,
  toggleSkippedWeeks,
  newItemHandlers: { handleNewVessel },
}: ShipperProjectionGridProps & {
  isSkipped: boolean;
  showDateDescription: boolean;
  showErrors: boolean;
  startDate: Date;
  toggleSkippedWeeks: () => void;
}) => {
  const [coast = 'EC'] = useQueryValue('coast');

  const newVessel = {
    id: -1,
    vesselName: 'Unknown',
    departureDate: formatDate(startDate),
    arrivalDate: formatDate(add(startDate, { weeks: 1 })),
    arrivalPort: coast,
    vesselStatus: 'projected',
    shipperProjectionEntriesByVesselInfoId: {
      edges: [],
      nodes: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
      totalCount: 0,
    },
  };

  return (
    <l.Flex
      alignCenter
      background={th.colors.brand.containerBackground}
      border={
        showErrors && !isSkipped ? th.borders.error : th.borders.secondary
      }
      column
      height={`calc(${th.sizes.fill} - ${th.spacing.md} - 2px)`}
      justifyCenter
      padding={th.spacing.sm}
      relative
    >
      <ty.CaptionText
        alignSelf="flex-start"
        bold
        left={`-${th.spacing.tn}`}
        position="absolute"
        disabled
        top={`-${th.sizes.icon}`}
      >
        {getWeekNumber(startDate)}
        {showDateDescription &&
          ` (${format(startOfISOWeek(startDate), 'MMM dd')})`}
      </ty.CaptionText>
      {!isSkipped && selectedShipper && (
        <l.HoverButton
          onClick={() => {
            handleNewVessel(newVessel);
          }}
        >
          <l.Flex mb={th.spacing.md}>
            <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
            <ty.CaptionText ml={th.spacing.sm} opacity={1}>
              Add Vessel
            </ty.CaptionText>
          </l.Flex>
        </l.HoverButton>
      )}
      {selectedShipper && (
        <l.Div opacity={isSkipped ? 1 : th.opacities.secondary}>
          <LineItemCheckbox
            checked={isSkipped}
            onChange={toggleSkippedWeeks}
            label={
              <ty.CaptionText ml={th.spacing.sm}>No Vessels</ty.CaptionText>
            }
          />
        </l.Div>
      )}
      {!selectedShipper && <ty.BodyText disabled>No Vessels</ty.BodyText>}
    </l.Flex>
  );
};

const VesselWrapper = styled(l.Grid)(
  ({
    index,
    selectedShipper,
    status,
  }: {
    index?: number;
    selectedShipper?: Maybe<Shipper>;
    status?: keyof typeof th.colors.status;
  }) => ({
    alignItems: 'center',
    background: status
      ? hexColorWithTransparency(th.colors.status[status], 0.2)
      : index !== undefined && index % 2 === 0
      ? th.colors.brand.containerBackground
      : undefined,
    border: th.borders.secondary,
    gridTemplateRows: `repeat(${selectedShipper ? 4 : 5}, 1fr)`,
    padding: th.spacing.sm,
    position: 'relative',
    height: `calc(${th.sizes.fill} - ${th.spacing.md} - 2px)`,
    zIndex: 3,
    '.react-date-picker': {
      width: th.sizes.fill,
    },
    '.react-date-picker__wrapper': {
      background: th.colors.background,
      border: 0,
    },
    '.react-date-picker__inputGroup__input': {
      fontSize: th.fontSizes.caption,
    },
  }),
  divPropsSet,
);

const VesselHeader = (
  props: {
    index: number;
    showDateDescription: boolean;
    showErrors: boolean;
    vessel: ShipperProjectionVesselInfo;
    vesselCount: number;
  } & ShipperProjectionGridProps,
) => {
  const { pathname } = useLocation();
  const [startDateQuery] = useQueryValue('startDate');
  const [coast] = useQueryValue('coast');
  const startDate = startDateQuery
    ? new Date(startDateQuery.replace(/-/g, '/'))
    : new Date();

  const {
    changeHandlers: { handleVesselChange },
    newItemHandlers: { handleNewVessel },
    removeItemHandlers: { handleRemoveNewVessel },
    index,
    selectedShipper,
    showDateDescription,
    showErrors,
    valueGetters: { getVesselValue },
    vessel,
    vesselCount,
  } = props;

  const isNew = vessel.id < 0;

  const newVessel = {
    id: -1,
    vesselName: 'Unknown',
    departureDate: getVesselValue(vessel, 'departureDate').value,
    arrivalDate: getVesselValue(vessel, 'arrivalDate').value,
    arrivalPort: vessel.arrivalPort,
    vesselStatus: '-',
    shipperProjectionEntriesByVesselInfoId: {
      edges: [],
      nodes: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
      totalCount: 0,
    },
  };

  const updatedVessel = {
    id: vessel.id,
    vesselName: getVesselValue(vessel, 'vesselName').value,
    departureDate: getVesselValue(vessel, 'departureDate').value,
    arrivalDate: getVesselValue(vessel, 'arrivalDate').value,
    arrivalPort: vessel.arrivalPort,
    vesselStatus: getVesselValue(vessel, 'vesselStatus').value,
  };

  const updatedDepartureDate = new Date(
    updatedVessel.departureDate.replace(/-/g, '/'),
  );
  const formattedDepartureDate = formatDate(
    startOfISOWeek(updatedDepartureDate),
  );

  return (
    <VesselWrapper
      index={index}
      selectedShipper={selectedShipper}
      status={getVesselStatus(updatedVessel.vesselStatus)}
    >
      <ty.CaptionText
        bold={isCurrentWeek(getWeekNumber(updatedDepartureDate))}
        position="absolute"
        top={`-${th.sizes.icon}`}
      >
        {getWeekNumber(updatedDepartureDate)}
        {showDateDescription &&
          ` (${format(startOfISOWeek(updatedDepartureDate), 'MMM dd')})`}
      </ty.CaptionText>
      {!selectedShipper && (
        <l.Div position="absolute" right={0} top={-20}>
          <StatusIndicator
            diameter={12}
            status={
              vessel.projection?.approvedAt
                ? 'success'
                : vessel.projection?.rejectedAt
                ? 'error'
                : 'warning'
            }
          />
        </l.Div>
      )}
      {selectedShipper && (
        <l.HoverButton
          onClick={() => {
            handleNewVessel(newVessel);
          }}
          position="absolute"
          top={`-${th.sizes.icon}`}
          right={0}
        >
          <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
        </l.HoverButton>
      )}
      {isNew && vesselCount > 1 && (
        <l.HoverButton
          onClick={() => {
            handleRemoveNewVessel(updatedVessel.id);
          }}
          position="absolute"
          top={`-${th.sizes.icon}`}
          right={th.sizes.icon}
        >
          <MinusInCircle height={th.sizes.xs} width={th.sizes.xs} />
        </l.HoverButton>
      )}
      {!selectedShipper && (
        <ty.LinkText
          bold
          fontSize={th.fontSizes.caption}
          hover
          nowrap
          to={`${pathname}?coast=${coast}&startDate=${formattedDepartureDate}&endDate=${formattedDepartureDate}&shipperId=${vessel.vessel?.shipper?.id}&view=grid`}
          overflow="hidden"
          textDecoration="underline"
          textOverflow="ellipsis"
        >
          {vessel.vessel?.shipper?.shipperName}
        </ty.LinkText>
      )}
      {selectedShipper ? (
        <EditableCell
          content={{ dirty: false, value: updatedVessel.vesselName || '' }}
          defaultChildren={null}
          editing={true}
          error={
            showErrors && ['', 'Unknown'].includes(updatedVessel.vesselName)
          }
          inputProps={{
            width: 116,
          }}
          onChange={(e) => {
            handleVesselChange({
              ...updatedVessel,
              vesselName: e.target.value,
            });
          }}
        />
      ) : (
        <ty.CaptionText
          bold
          ellipsis
          // title={`${vessel.vesselName}${
          //   vessel.previousName ? ' (' + vessel.previousName + ')' : ''
          // }`}
        >
          {vessel.vesselName}
          {/* {vessel.previousName ? ` (${vessel.previousName})` : ''} */}
        </ty.CaptionText>
      )}
      {selectedShipper ? (
        <l.Div border={th.borders.secondary}>
          <DatePicker
            maxDate={endOfISOWeek(add(startDate, { weeks: 5 }))}
            minDate={startOfISOWeek(startDate)}
            onChange={(date: Date) =>
              handleVesselChange({
                ...updatedVessel,
                departureDate: formatDate(date),
              })
            }
            value={new Date(updatedVessel.departureDate.replace(/-/g, '/'))}
            {...datePickerProps}
          />
        </l.Div>
      ) : (
        <ty.CaptionText nowrap overflow="hidden" textOverflow="ellipsis">
          {format(
            new Date(updatedVessel.departureDate.replace(/-/g, '/')),
            'EEE, MMM dd',
          )}
        </ty.CaptionText>
      )}
      {selectedShipper ? (
        <l.Div
          border={
            showErrors &&
            !isAfter(
              new Date(updatedVessel.arrivalDate),
              new Date(updatedVessel.departureDate),
            )
              ? th.borders.error
              : th.borders.secondary
          }
        >
          <DatePicker
            maxDate={endOfISOWeek(add(startDate, { weeks: 6 }))}
            minDate={startOfISOWeek(startDate)}
            onChange={(date: Date) =>
              handleVesselChange({
                ...updatedVessel,
                arrivalDate: formatDate(date),
              })
            }
            value={new Date(updatedVessel.arrivalDate.replace(/-/g, '/'))}
            {...datePickerProps}
          />
        </l.Div>
      ) : (
        <ty.CaptionText nowrap overflow="hidden" textOverflow="ellipsis">
          {format(
            new Date(updatedVessel.arrivalDate.replace(/-/g, '/')),
            'EEE, MMM dd',
          )}
        </ty.CaptionText>
      )}
      {selectedShipper ? (
        <select
          onChange={(e) => {
            handleVesselChange({
              ...updatedVessel,
              vesselStatus: e.target.value,
            });
          }}
          value={updatedVessel.vesselStatus}
        >
          {vesselStatusOptions.map(({ text, value }, idx) => (
            <option key={idx} value={value}>
              {text}
            </option>
          ))}
        </select>
      ) : (
        <ty.CaptionText nowrap overflow="hidden" textOverflow="ellipsis">
          {
            vesselStatusOptions.find(
              (status) => status.value === vessel.vesselStatus,
            )?.text
          }
        </ty.CaptionText>
      )}
    </VesselWrapper>
  );
};

interface Props extends ShipperProjectionGridProps {
  currentProjections?: Maybe<ShipperProjection>[];
  error?: ApolloError;
  ghostVesselDates: string[];
  gridTemplateColumns: string;
  loading: boolean;
  setProjectionId: (projectionId: string) => void;
  showErrors: boolean;
  skippedWeeks: string[];
  toggleSkippedWeeks: (weekToSkip: string) => void;
  vessels: ShipperProjectionVesselInfo[];
}

const Vessels = ({
  currentProjections,
  currentProjection,
  error,
  gridTemplateColumns,
  loading,
  selectedShipper,
  setProjectionId,
  showErrors,
  skippedWeeks,
  toggleSkippedWeeks,
  vessels,
  ...rest
}: Props) => (
  <l.Grid
    alignCenter
    gridColumnGap={th.spacing.md}
    gridTemplateColumns={gridTemplateColumns}
    height={150}
    mt={th.sizes.md}
  >
    <l.Flex alignCenter justifyBetween height={th.sizes.fill}>
      <l.Flex column justifyBetween height={th.sizes.fill}>
        <l.Div mt={`-${th.sizes.icon}`}>
          {currentProjections ? (
            <div>
              <ty.SmallText ml={th.spacing.sm} mb={th.spacing.sm} secondary>
                {currentProjections.length} projection
                {currentProjections.length === 1 ? '' : 's'} submitted
                {currentProjections.length > 0 ? ':' : ''}
              </ty.SmallText>
              {currentProjections && currentProjections.length > 0 && (
                <l.Flex alignCenter>
                  <Select
                    onChange={(e) => {
                      setProjectionId(e.target.value);
                    }}
                    value={currentProjection?.id}
                  >
                    {currentProjections.map((projection) => {
                      const { id, submittedAt } = projection || {};
                      return (
                        <option key={id} value={id}>
                          {format(new Date(submittedAt), 'EE, MMM d, h:mm a')}
                        </option>
                      );
                    })}
                  </Select>
                  <l.Div ml={th.spacing.md}>
                    <CommentsModal
                      currentProjectionId={currentProjection?.id}
                      currentProjections={
                        currentProjections as ShipperProjection[]
                      }
                      selectedShipper={selectedShipper as Shipper}
                    />
                  </l.Div>
                </l.Flex>
              )}
            </div>
          ) : (
            <div />
          )}
        </l.Div>
        <l.Flex mb={th.spacing.md}>
          <ty.BodyText bold mr={120}>
            Products &#x2193;
          </ty.BodyText>
          <ty.BodyText bold>Vessels &#x2192;</ty.BodyText>
        </l.Flex>
      </l.Flex>
      <VesselWrapper border={0} selectedShipper={selectedShipper}>
        <ty.CaptionText
          position="absolute"
          right={th.spacing.sm}
          secondary
          top={`-${th.sizes.icon}`}
        >
          Week Number:
        </ty.CaptionText>
        {!selectedShipper && (
          <ty.CaptionText textAlign="right" secondary>
            Shipper Name:
          </ty.CaptionText>
        )}
        <ty.CaptionText textAlign="right" secondary>
          Vessel Name:
        </ty.CaptionText>
        <ty.CaptionText textAlign="right" secondary>
          Est. Departure Date:
        </ty.CaptionText>
        <ty.CaptionText textAlign="right" secondary>
          Est. Arrival Date:
        </ty.CaptionText>
        <ty.CaptionText textAlign="right" secondary>
          Vessel Status:
        </ty.CaptionText>
      </VesselWrapper>
    </l.Flex>
    {!loading && vessels.length > 0 ? (
      vessels.reduce<{
        components: React.ReactNode[];
        previousStartDate?: Date;
      }>(
        ({ components, previousStartDate }, vessel, idx) => {
          const startDate = new Date(vessel.departureDate.replace(/-/g, '/'));
          const showDateDescription = !equals(startDate, previousStartDate);
          return {
            components: [
              ...components,
              vessel.id === 0 ? (
                <GhostVesselColumn
                  isSkipped={skippedWeeks.includes(formatDate(startDate))}
                  selectedShipper={selectedShipper}
                  showDateDescription={showDateDescription}
                  showErrors={showErrors}
                  startDate={startDate}
                  toggleSkippedWeeks={() => {
                    toggleSkippedWeeks(formatDate(startDate));
                  }}
                  key={idx}
                  {...rest}
                />
              ) : (
                <VesselHeader
                  key={idx}
                  index={idx}
                  selectedShipper={selectedShipper}
                  showDateDescription={showDateDescription}
                  showErrors={showErrors}
                  vessel={vessel}
                  vesselCount={vessels.length}
                  {...rest}
                />
              ),
            ],
            previousStartDate: startDate,
          };
        },
        { components: [] },
      ).components
    ) : (
      <DataMessage
        data={vessels}
        emptyProps={{
          header: 'No Vessels Found',
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
);

export default Vessels;
