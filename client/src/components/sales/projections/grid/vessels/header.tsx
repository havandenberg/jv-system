import React from 'react';
import styled from '@emotion/styled';
import { add, endOfISOWeek, format, isAfter, startOfISOWeek } from 'date-fns';
import { pluck, sortBy, uniq } from 'ramda';
import DatePicker from 'react-date-picker';
import { useLocation } from 'react-router-dom';

import api from 'api';
import MinusInCircle from 'assets/images/minus-in-circle';
import PlusInCircle from 'assets/images/plus-in-circle';
import { formatDate } from 'components/date-range-picker';
import EditableCell from 'components/editable-cell';
import useItemSelector from 'components/item-selector';
import StatusIndicator from 'components/status-indicator';
import { useQueryValue } from 'hooks/use-query-params';
import { ShipperProjectionVesselInfo, Vessel } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import { SmallSelect } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getWeekNumber, isCurrentWeek } from 'utils/date';

import { Cell } from '../products/row';
import { ShipperProjectionGridProps } from '../types';
import { VesselWrapper } from '.';

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

const LastWeekMarker = styled(l.Div)({
  background: th.colors.brand.primary,
  height: 198,
  left: -10,
  opacity: th.opacities.disabled,
  position: 'absolute',
  top: -32,
  width: 1,
});

export const GhostVesselHeader = ({
  editable,
  isPortal,
  isSkipped,
  selectedShipper,
  showDateDescription,
  showErrors,
  showLastWeekMarker,
  startDate,
  toggleSkippedWeeks,
  newItemHandlers: { handleNewVessel },
}: ShipperProjectionGridProps & {
  editable: boolean;
  isPortal: boolean;
  isSkipped: boolean;
  showDateDescription: boolean;
  showLastWeekMarker: boolean;
  showErrors: boolean;
  startDate: Date;
  toggleSkippedWeeks: () => void;
}) => {
  const [coast = 'EC'] = useQueryValue('coast');
  const [vesselId] = useQueryValue('vesselId');

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
      {!isSkipped && selectedShipper && editable && (
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
      {selectedShipper && editable ? (
        <l.Div opacity={isSkipped ? 1 : th.opacities.secondary}>
          <LineItemCheckbox
            checked={isSkipped}
            onChange={toggleSkippedWeeks}
            label={
              <ty.CaptionText ml={th.spacing.sm}>
                No {isPortal || !vesselId ? 'Vessels' : 'Loadings'}
              </ty.CaptionText>
            }
          />
        </l.Div>
      ) : (
        <ty.BodyText disabled>
          No {isPortal || !vesselId ? 'vessels' : 'loadings'}
        </ty.BodyText>
      )}
      {showLastWeekMarker && <LastWeekMarker />}
    </l.Flex>
  );
};

export const ParentVesselHeader = (
  props: {
    index: number;
    showDateDescription: boolean;
    showLastWeekMarker: boolean;
    vessel: Vessel;
  } & ShipperProjectionGridProps,
) => {
  const { pathname } = useLocation();
  const [startDateQuery] = useQueryValue('startDate');
  const [endDateQuery] = useQueryValue('endDate');
  const [coast] = useQueryValue('coast');

  const {
    index,
    selectedShipper,
    showDateDescription,
    showLastWeekMarker,
    vessel,
  } = props;

  const departureDate = new Date(vessel.departureDate.replace(/-/g, '/'));

  return (
    <VesselWrapper index={index} selectedShipper={selectedShipper}>
      <ty.CaptionText
        bold={isCurrentWeek(getWeekNumber(departureDate))}
        position="absolute"
        top={`-${th.sizes.icon}`}
      >
        {getWeekNumber(departureDate)}
        {showDateDescription &&
          ` (${format(startOfISOWeek(departureDate), 'MMM dd')})`}
      </ty.CaptionText>
      <ty.LinkText
        bold
        fontSize={th.fontSizes.caption}
        hover
        nowrap
        to={`${pathname}?coast=${coast}&startDate=${startDateQuery}&endDate=${endDateQuery}&vesselId=${
          vessel.id
        }${
          selectedShipper ? '&shipperId=' + selectedShipper.id : ''
        }&projectionsView=grid`}
        overflow="hidden"
        textDecoration="underline"
        textOverflow="ellipsis"
      >
        {vessel.vesselCode}
      </ty.LinkText>
      <ty.CaptionText bold ellipsis title={vessel.vesselName}>
        {vessel.vesselName}
      </ty.CaptionText>
      <ty.CaptionText nowrap overflow="hidden" textOverflow="ellipsis">
        {format(
          new Date(vessel.departureDate.replace(/-/g, '/')),
          'EEE, MMM dd',
        )}
      </ty.CaptionText>
      <ty.CaptionText nowrap overflow="hidden" textOverflow="ellipsis">
        {format(new Date(vessel.arrivalDate.replace(/-/g, '/')), 'EEE, MMM dd')}
      </ty.CaptionText>
      <div />
      {showLastWeekMarker && <LastWeekMarker />}
    </VesselWrapper>
  );
};

const VesselHeader = (
  props: {
    editable: boolean;
    index: number;
    isAllProjections: boolean;
    showDateDescription: boolean;
    showErrors: boolean;
    showLastWeekMarker: boolean;
    vessel: ShipperProjectionVesselInfo;
    vesselCount: number;
  } & ShipperProjectionGridProps,
) => {
  const { pathname } = useLocation();
  const [startDateQuery] = useQueryValue('startDate');
  const [endDateQuery] = useQueryValue('endDate');
  const [coast] = useQueryValue('coast');
  const [vesselId, setVesselId] = useQueryValue('vesselId');
  const [vesselSearch, setVesselSearchQuery] = useQueryValue('vesselSearch');
  const startDate = startDateQuery
    ? new Date(startDateQuery.replace(/-/g, '/'))
    : new Date();

  const { data: vesselsData, loading: vesselsLoading } = api.useVessels({
    isInventory: true,
    orderByOverride: 'DISCHARGE_DATE_DESC',
  });
  const vessels = (vesselsData?.nodes || []) as Vessel[];

  const {
    changeHandlers: { handleParentVesselChange, handleVesselChange },
    newItemHandlers: { handleNewVessel },
    removeItemHandlers: { handleRemoveNewVessel },
    editable,
    index,
    isAllProjections,
    isPortal,
    selectedShipper,
    showDateDescription,
    showErrors,
    showLastWeekMarker,
    valueGetters: { getParentVesselValue, getVesselValue },
    vessel,
    vesselCount,
  } = props;

  const parentVessel = vessels.find(
    (v) => v.id === getParentVesselValue(vessel.vessel, 'vesselId').value,
  );

  const allItems = sortBy(
    (v) => -parseInt(v.vesselCode || '', 10),
    sortBy(
      (v) => v.vesselName || '',
      vessels.filter((v) => (v.searchText || '').includes(vesselSearch || '')),
    ),
  );

  const { ItemSelector: VesselSelector } = useItemSelector({
    allItems,
    closeOnSelect: true,
    disabled: isAllProjections || isPortal,
    editableCellProps: {
      bypassLocalValue: true,
      content: {
        dirty: getParentVesselValue(vessel.vessel, 'vesselId').dirty,
        value:
          parentVessel?.vesselCode ||
          getParentVesselValue(vessel.vessel, 'vesselId').value ||
          '',
      },
      defaultChildren: (
        <Cell
          active={!!vesselId && vesselId !== 'all'}
          error={!parentVessel}
          height={18}
          onClick={
            parentVessel
              ? () => {
                  setVesselId(parentVessel.id);
                }
              : undefined
          }
          width={30}
          warning={false}
        >
          <ty.CaptionText
            ellipsis
            textAlign="right"
            title={parentVessel?.vesselCode || ''}
            width={th.sizes.fill}
          >
            {parentVessel?.vesselCode || ''}
          </ty.CaptionText>
        </Cell>
      ),
      editing: !isAllProjections && !isPortal,
      error: !parentVessel,
      inputProps: {
        height: 18,
        textAlign: 'right',
        width: 44,
      },
      onChange: (e) => {
        handleParentVesselChange({
          id: vessel.vessel?.id || '',
          shipperId: selectedShipper?.id || '',
          vesselId: e.target.value,
        });
        setVesselSearchQuery(e.target.value);
      },
    },
    errorLabel: 'vessels',
    getItemContent: (v) => (
      <ty.CaptionText bold={v.id === parentVessel?.id} pl={th.spacing.sm}>
        {v.vesselCode} - {v.vesselName}
      </ty.CaptionText>
    ),
    loading: vesselsLoading,
    nameKey: 'id',
    panelGap: 0,
    selectItem: (item: Vessel) => {
      handleParentVesselChange({
        id: vessel.vessel?.id || '',
        shipperId: selectedShipper?.id || '',
        vesselId: item.id,
      });
    },
    width: 220,
  });

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
    vesselId: vessel.vesselId,
  };

  const updatedDepartureDate = new Date(
    updatedVessel.departureDate.replace(/-/g, '/'),
  );

  const previousVesselNames = uniq(
    pluck(
      'vesselName',
      (vessel.vessel?.shipperProjectionVesselInfosByVesselId.nodes
        .slice(1, -1)
        .reverse() || []) as ShipperProjectionVesselInfo[],
    ),
  );
  const allVesselNamesString = `${vessel.vesselName}${
    previousVesselNames.length > 0
      ? ' (' + previousVesselNames.join(', ') + ')'
      : ''
  }`;

  return (
    <VesselWrapper
      index={index}
      selectedShipper={selectedShipper}
      status={getVesselStatus(updatedVessel.vesselStatus)}
      vesselId={vesselId}
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
        <l.Div
          position="absolute"
          right={
            selectedShipper
              ? 0
              : isCurrentWeek(getWeekNumber(updatedDepartureDate))
              ? 41
              : 42
          }
          top={-19}
        >
          <StatusIndicator
            diameter={10}
            status={
              vessel.projection?.reviewStatus === 2
                ? 'success'
                : vessel.projection?.reviewStatus === 0
                ? 'error'
                : 'warning'
            }
          />
        </l.Div>
      )}
      {!editable && !isPortal && (
        <l.Div position="absolute" top={-29} right={-1}>
          {VesselSelector}
        </l.Div>
      )}
      {selectedShipper && editable && (
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
          to={`${pathname}?coast=${coast}&startDate=${startDateQuery}&endDate=${endDateQuery}&vesselId=${vesselId}&shipperId=${vessel.vessel?.shipper?.id}&projectionsView=grid`}
          ellipsis
        >
          {vessel.vessel?.shipper?.shipperName}
        </ty.LinkText>
      )}
      {selectedShipper && editable ? (
        <EditableCell
          content={{ dirty: false, value: updatedVessel.vesselName || '' }}
          defaultChildren={null}
          editing={true}
          error={
            showErrors && ['', 'Unknown'].includes(updatedVessel.vesselName)
          }
          inputProps={{
            title: allVesselNamesString,
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
        <ty.CaptionText bold ellipsis title={allVesselNamesString}>
          {allVesselNamesString}
        </ty.CaptionText>
      )}
      {selectedShipper && editable ? (
        <l.Div border={th.borders.secondary}>
          <DatePicker
            maxDate={endOfISOWeek(add(startDate, { weeks: 5 }))}
            minDate={startOfISOWeek(add(startDate, { weeks: -1 }))}
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
      {selectedShipper && editable ? (
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
      {selectedShipper && editable ? (
        <SmallSelect
          borderRadius={0}
          error={
            showErrors &&
            getWeekNumber(new Date(updatedDepartureDate)) <
              getWeekNumber(startDate) &&
            !['executed', 'cancelled'].includes(
              getVesselValue(
                vessel as ShipperProjectionVesselInfo,
                'vesselStatus',
              ).value,
            )
          }
          fontSize={th.fontSizes.caption}
          height={22}
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
        </SmallSelect>
      ) : (
        <ty.CaptionText nowrap overflow="hidden" textOverflow="ellipsis">
          {
            vesselStatusOptions.find(
              (status) => status.value === vessel.vesselStatus,
            )?.text
          }
        </ty.CaptionText>
      )}
      {showLastWeekMarker && <LastWeekMarker />}
    </VesselWrapper>
  );
};

export default VesselHeader;
