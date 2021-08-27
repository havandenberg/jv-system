import React from 'react';
import styled from '@emotion/styled';
import { add, isAfter, startOfISOWeek } from 'date-fns';
import { isEmpty } from 'ramda';
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

const datePickerProps = {
  calendarIcon: null,
  clearIcon: null,
  disableClock: true,
  locale: 'en-US',
  required: true,
};

const vesselStatusOptions = [
  { value: '-', text: '-' },
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

const NewVesselRow = ({
  newItemHandlers: { handleNewVessel },
}: ShipperProjectionProps) => {
  const [startDateQuery] = useQueryValue('startDate');
  const startDate = startOfISOWeek(
    startDateQuery ? new Date(startDateQuery.replace(/-/g, '/')) : new Date(),
  );
  const [coast = 'EC'] = useQueryValue('coast');
  const newVessel = {
    id: -1,
    vesselName: 'New Vessel',
    departureDate: formatDate(startDate),
    arrivalDate: formatDate(add(startDate, { weeks: 1 })),
    arrivalPort: coast,
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
  return (
    <l.Div height={`calc(${th.sizes.fill} - ${th.spacing.md})`} relative>
      <l.HoverButton
        onClick={() => {
          handleNewVessel(newVessel);
        }}
        position="absolute"
        top={`-${th.sizes.icon}`}
        left={0}
      >
        <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
      </l.HoverButton>
    </l.Div>
  );
};

const VesselWrapper = styled(l.Grid)(
  ({ status }: { status?: keyof typeof th.colors.status }) => ({
    alignItems: 'center',
    background: status
      ? hexColorWithTransparency(th.colors.status[status], 0.2)
      : undefined,
    border: th.borders.secondary,
    gridTemplateRows: 'repeat(4, 1fr)',
    justifyContent: 'flex-end',
    padding: th.spacing.sm,
    position: 'relative',
    height: `calc(${th.sizes.fill} - ${th.spacing.md} - 2px)`,
  }),
  divPropsSet,
);

const VesselHeader = (
  props: {
    isFirst: boolean;
    showErrors: boolean;
    vessel: ShipperProjectionVessel;
    vesselCount: number;
  } & ShipperProjectionProps,
) => {
  const {
    changeHandlers: { handleVesselChange },
    newItemHandlers: { handleNewVessel },
    removeItemHandlers: { handleRemoveNewVessel },
    isFirst,
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
    <VesselWrapper status={getVesselStatus(updatedVessel.vesselStatus)}>
      <ty.CaptionText bold position="absolute" top={`-${th.sizes.icon}`}>
        {isFirst ? 'Week ' : ''}
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
      <DatePicker
        onChange={(date: Date) =>
          handleVesselChange({
            ...updatedVessel,
            departureDate: formatDate(date),
          })
        }
        value={new Date(updatedVessel.departureDate.replace(/-/g, '/'))}
        {...datePickerProps}
      />
      <l.Div
        border={
          showErrors &&
          !isAfter(
            new Date(updatedVessel.arrivalDate),
            new Date(updatedVessel.departureDate),
          )
            ? th.borders.error
            : th.borders.transparent
        }
      >
        <DatePicker
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
  gridTemplateColumns: string;
  showErrors: boolean;
  vessels: ShipperProjectionVessel[];
}

const Vessels = ({
  gridTemplateColumns,
  showErrors,
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
    <VesselWrapper border={0} mr={th.spacing.sm}>
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
    {!isEmpty(vessels) ? (
      vessels.map((vessel, idx) => (
        <VesselHeader
          key={idx}
          isFirst={idx === 0}
          showErrors={showErrors}
          vessel={vessel}
          vesselCount={vessels.length}
          {...rest}
        />
      ))
    ) : (
      <NewVesselRow {...rest} />
    )}
  </l.Grid>
);

export default Vessels;
