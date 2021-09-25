import React from 'react';
import styled from '@emotion/styled';
import { add, endOfISOWeek, isAfter, startOfISOWeek } from 'date-fns';
import DatePicker from 'react-date-picker';

import MinusInCircle from 'assets/images/minus-in-circle';
import PlusInCircle from 'assets/images/plus-in-circle';
import { formatDate } from 'components/date-range-picker';
import EditableCell from 'components/editable-cell';
import { useQueryValue } from 'hooks/use-query-params';
import { ShipperProjectionVessel } from 'types';
import l, { divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { hexColorWithTransparency } from 'ui/utils';
import { getWeekNumber } from 'utils/date';

import { ShipperProjectionProps } from './types';
import { LineItemCheckbox } from 'ui/checkbox';

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
  showErrors,
  showWeekText,
  startDate,
  toggleSkippedWeeks,
  newItemHandlers: { handleNewVessel },
}: ShipperProjectionProps & {
  isSkipped: boolean;
  showErrors: boolean;
  showWeekText?: boolean;
  startDate: Date;
  toggleSkippedWeeks: () => void;
}) => {
  const [coast = 'EC'] = useQueryValue('coast');

  const newVessel = {
    id: -1,
    vesselName: 'New Vessel',
    departureDate: formatDate(startDate),
    arrivalDate: formatDate(add(startDate, { weeks: 1 })),
    arrivalPort: coast,
    vesselStatus: 'projected',
    shipperProjectionEntriesByVesselId: {
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
        {showWeekText ? 'Week ' : ''}
        {getWeekNumber(startDate)}
      </ty.CaptionText>
      {!isSkipped && (
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
      <l.Div opacity={isSkipped ? 1 : th.opacities.secondary}>
        <LineItemCheckbox
          checked={isSkipped}
          onChange={toggleSkippedWeeks}
          label={<ty.CaptionText ml={th.spacing.sm}>No Vessels</ty.CaptionText>}
        />
      </l.Div>
    </l.Flex>
  );
};

const VesselWrapper = styled(l.Grid)(
  ({
    index,
    status,
  }: {
    index?: number;
    status?: keyof typeof th.colors.status;
  }) => ({
    alignItems: 'center',
    background: status
      ? hexColorWithTransparency(th.colors.status[status], 0.2)
      : index !== undefined && index % 2 === 0
      ? th.colors.brand.containerBackground
      : undefined,
    border: th.borders.secondary,
    gridTemplateRows: 'repeat(4, 1fr)',
    justifyContent: 'flex-end',
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
    },
  }),
  divPropsSet,
);

const VesselHeader = (
  props: {
    index: number;
    showErrors: boolean;
    vessel: ShipperProjectionVessel;
    vesselCount: number;
  } & ShipperProjectionProps,
) => {
  const [startDateQuery] = useQueryValue('startDate');
  const startDate = startDateQuery
    ? new Date(startDateQuery.replace(/-/g, '/'))
    : new Date();

  const {
    changeHandlers: { handleVesselChange },
    newItemHandlers: { handleNewVessel },
    removeItemHandlers: { handleRemoveNewVessel },
    index,
    showErrors,
    valueGetters: { getVesselValue },
    vessel,
    vesselCount,
  } = props;

  const isNew = vessel.id < 0;

  const newVessel = {
    id: -1,
    vesselName: 'New Vessel',
    departureDate: getVesselValue(vessel, 'departureDate').value,
    arrivalDate: getVesselValue(vessel, 'arrivalDate').value,
    arrivalPort: vessel.arrivalPort,
    vesselStatus: '-',
    shipperProjectionEntriesByVesselId: {
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

  return (
    <VesselWrapper
      index={index}
      status={getVesselStatus(updatedVessel.vesselStatus)}
    >
      <ty.CaptionText bold position="absolute" top={`-${th.sizes.icon}`}>
        {index === 0 ? 'Week ' : ''}
        {getWeekNumber(
          new Date(updatedVessel.departureDate.replace(/-/g, '/')),
        )}
      </ty.CaptionText>
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
      <EditableCell
        content={{ dirty: false, value: updatedVessel.vesselName || '' }}
        defaultChildren={null}
        editing={true}
        error={
          showErrors && ['', 'New Vessel'].includes(updatedVessel.vesselName)
        }
        inputProps={{
          width: 116,
        }}
        onChange={(e) => {
          handleVesselChange({ ...updatedVessel, vesselName: e.target.value });
        }}
      />
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
    </VesselWrapper>
  );
};

interface Props extends ShipperProjectionProps {
  ghostVesselDates: string[];
  gridTemplateColumns: string;
  showErrors: boolean;
  skippedWeeks: string[];
  toggleSkippedWeeks: (weekToSkip: string) => void;
  vessels: ShipperProjectionVessel[];
}

const Vessels = ({
  gridTemplateColumns,
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
    <VesselWrapper border={0}>
      <ty.CaptionText textAlign="right" secondary>
        Vessel Name
      </ty.CaptionText>
      <ty.CaptionText textAlign="right" secondary>
        Est. Departure Date
      </ty.CaptionText>
      <ty.CaptionText textAlign="right" secondary>
        Est. Arrival Date
      </ty.CaptionText>
      <ty.CaptionText textAlign="right" secondary>
        Vessel Status
      </ty.CaptionText>
    </VesselWrapper>
    {vessels.map((vessel, idx) => {
      const startDate = new Date(vessel.departureDate.replace(/-/g, '/'));
      return vessel.id === 0 ? (
        <GhostVesselColumn
          isSkipped={skippedWeeks.includes(formatDate(startDate))}
          showErrors={showErrors}
          showWeekText={idx === 0}
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
          showErrors={showErrors}
          vessel={vessel}
          vesselCount={vessels.length}
          {...rest}
        />
      );
    })}
  </l.Grid>
);

export default Vessels;
