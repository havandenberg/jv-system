import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { isEmpty, pick } from 'ramda';
import { ClipLoader } from 'react-spinners';
import { ScrollSync } from 'react-virtualized';

import api from 'api';
import ResetImg from 'assets/images/reset';
import { getSortedItems } from 'components/column-label';
import { formatDate } from 'components/date-range-picker';
import { ResetButton } from 'components/inventory/inventory/use-filters';
import ListItem from 'components/list-item';
import { BasicModal } from 'components/modal';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import StatusIndicator from 'components/status-indicator';
import { useTabBar } from 'components/tab-bar';
import { GridWrapper, VirtualizedGrid } from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useDateRange from 'hooks/use-date-range';
import usePrevious from 'hooks/use-previous';
import {
  useSortQueryParams,
  useVesselControlQueryParams,
} from 'hooks/use-query-params';
import useSearch from 'hooks/use-search';
import { Unpaid, VesselControl } from 'types';
import b from 'ui/button';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import {
  listLabels as getListLabels,
  VesselControlLabelInfo,
} from './data-utils';
import NotifyUnpaids from './notify';
import {
  gridTemplateColumns as unpaidsGridTemplateColumns,
  SALES_USER_CODES,
} from './unpaids';

const gridTemplateColumns =
  '30px 1fr 0.5fr 0.5fr 1fr 0.5fr 0.8fr 2fr 2fr 1fr 0.8fr 2fr 1fr 0.7fr 0.7fr 0.7fr 430px 3fr 3fr';

const VESSEL_CONTROL_LOG_WIDTH = 2078;

export const dateRangeTabs = [
  {
    id: 'due',
    text: 'Due',
  },
  {
    id: 'sent',
    text: 'Sent',
  },
];

const VesselControlItem = ({
  item,
  listLabels,
  onSelectItem,
  scrollTop,
  selected,
}: {
  index: number;
  item: VesselControl;
  listLabels: VesselControlLabelInfo[];
  onSelectItem: () => void;
  scrollTop: number;
  selected: boolean;
}) => {
  const { data, loading, error } = api.useVesselControlDetails(item.id || 0);

  const itemWithDetails = {
    ...item,
    ...(!loading && !error && !!data ? data : {}),
  };

  return (
    <ListItem<VesselControl>
      data={itemWithDetails}
      gridTemplateColumns={gridTemplateColumns}
      hoverable
      listLabels={listLabels}
      isHalfHighlight={!!item.isLiquidated}
      highlightColor={th.colors.status.success}
      offsetTop={scrollTop}
      onSelectItem={onSelectItem}
      selected={selected}
    />
  );
};

const VesselControlLog = () => {
  const { Search } = useSearch({ paramName: 'vesselControlSearch' });
  const [{ sortBy, sortOrder }] = useSortQueryParams();
  const [{ liquidatedStatus, inStatus, outStatus }, setQueryParams] =
    useVesselControlQueryParams();
  const maxWidth = window.innerWidth - 64;

  const {
    data: vesselControls,
    vesselOptions,
    shipperOptions,
    arrivalOptions,
    loading,
    error,
  } = api.useVesselControls();

  const [changes, setChanges] = useState<VesselControl[]>([]);

  const handleChange = (updatedItem: VesselControl) => {
    setChanges((prevChanges) => {
      const existingChange = prevChanges.find(
        (change) =>
          change.vessel?.vesselCode === updatedItem.vessel?.vesselCode &&
          change.shipper?.id === updatedItem.shipper?.id,
      );
      if (existingChange) {
        return prevChanges.map((change) =>
          change.vessel?.vesselCode === updatedItem.vessel?.vesselCode &&
          change.shipper?.id === updatedItem.shipper?.id
            ? updatedItem
            : change,
        );
      }
      return [...prevChanges, updatedItem];
    });
  };

  const [upsertVesselControls, { loading: upsertVesselControlsLoading }] =
    api.useUpsertVesselControls();
  const [upsertUnpaids, { loading: upsertUnpaidsLoading }] =
    api.useUpsertUnpaids();

  const upsertLoading = upsertVesselControlsLoading || upsertUnpaidsLoading;

  const handleCancel = () => {
    setChanges([]);
  };

  const upsertLoadingSlices: string[] = useMemo(() => [], []);
  const previousUpsertLoadingSlices = usePrevious(upsertLoadingSlices);

  const handleUpdate = () => {
    const iterations = Math.ceil(changes.length / 50);
    for (let i = 0; i < iterations; i++) {
      const changesSlice = changes.slice(i * 50, (i + 1) * 50);
      upsertLoadingSlices.push(`${i}-loading`);
      upsertVesselControls({
        variables: {
          vesselControls: changesSlice.map((vesselControlItem) => ({
            ...pick(
              [
                'approval1',
                'approval2',
                'id',
                'isLiquidated',
                'notes1',
                'notes2',
              ],
              vesselControlItem,
            ),
            dateSent: vesselControlItem.dateSent
              ? formatDate(
                  new Date(vesselControlItem.dateSent.replace(/-/g, '/')),
                )
              : null,
            id: vesselControlItem.id || null,
            shipperId: vesselControlItem.shipper?.id,
            vesselCode: vesselControlItem.vessel?.vesselCode,
          })),
        },
      }).then(() => {
        upsertUnpaids({
          variables: {
            unpaids: changesSlice
              .map((vesselControlItem) =>
                vesselControlItem.unpaids.nodes.map((unpaid) => ({
                  ...pick(['isUrgent', 'isApproved', 'notes'], unpaid),
                  id: unpaid?.id || null,
                  shipperId: unpaid?.shipperId || unpaid?.shipper?.id,
                  vesselCode: unpaid?.vesselCode || unpaid?.vessel?.vesselCode,
                  invoiceId: unpaid?.invoiceId || unpaid?.invoice?.invoiceId,
                })),
              )
              .flat(),
          },
        }).then(() => {
          upsertLoadingSlices.splice(
            upsertLoadingSlices.indexOf(`${i}-loading`),
            1,
          );
        });
      });
    }
  };

  useEffect(() => {
    if (
      previousUpsertLoadingSlices &&
      previousUpsertLoadingSlices.length > 0 &&
      upsertLoadingSlices.length === 0
    ) {
      handleCancel();
    }
  }, [previousUpsertLoadingSlices, upsertLoadingSlices]);

  const { TabBar } = useTabBar({
    tabs: dateRangeTabs,
    isRoute: false,
    defaultTabId: 'due',
    paramName: 'vesselControlView',
  });

  const { DateRangePicker, BackwardButton, ForwardButton } = useDateRange();

  const listLabels = getListLabels(
    handleChange,
    vesselOptions,
    shipperOptions,
    arrivalOptions,
  );

  const columnLabels = useColumns<VesselControl>(
    'vesselCode',
    SORT_ORDER.ASC,
    listLabels,
    'accounting',
    'vessel_control',
  );

  const isDirty = !isEmpty(changes);

  const updatedVesselControls = getSortedItems(
    listLabels,
    [
      ...vesselControls.map((vesselControl) => {
        const updatedVesselControl = changes.find(
          (change) =>
            change.vessel?.vesselCode === vesselControl.vessel?.vesselCode &&
            change.shipper?.id === vesselControl.shipper?.id,
        );
        return updatedVesselControl || vesselControl;
      }),
      ...changes.filter((change) => !change.id),
    ],
    sortBy,
    sortOrder,
  );

  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const isAllSelected = selectedItems.length === updatedVesselControls.length;

  const isAllUrgent = updatedVesselControls.every(
    (vesselControl) =>
      vesselControl.unpaids.nodes.every((unpaid) => unpaid?.isUrgent) ||
      vesselControl.unpaids.nodes.length === 0,
  );
  const isSomeUrgent = updatedVesselControls.some(
    (vesselControl) =>
      vesselControl.unpaids.nodes.some((unpaid) => unpaid?.isUrgent) &&
      vesselControl.unpaids.nodes.length > 0,
  );
  const handleToggleAllUrgent = () => {
    setChanges(
      updatedVesselControls.map((vesselControl) => ({
        ...vesselControl,
        unpaids: {
          ...vesselControl.unpaids,
          nodes: vesselControl.unpaids.nodes.map(
            (unpaid) =>
              ({
                ...unpaid,
                isUrgent: !isAllUrgent,
              } as Unpaid),
          ),
        },
      })),
    );
  };

  const toggleSelectItem = (key: string) => {
    if (selectedItems.includes(key)) {
      if (isAllSelected) {
        setSelectedItems([key]);
      } else {
        setSelectedItems(selectedItems.filter((k) => k !== key));
      }
    } else {
      setSelectedItems([...selectedItems, key]);
    }
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        updatedVesselControls.map(
          (item) => `${item.vessel?.vesselCode}-${item.shipper?.id}`,
        ),
      );
    }
  };

  const toggleLiquidatedStatus = () => {
    switch (liquidatedStatus) {
      case 'unliquidated':
        setQueryParams({ liquidatedStatus: 'all' });
        break;
      case 'all':
        setQueryParams({ liquidatedStatus: 'liquidated' });
        break;
      default:
        setQueryParams({ liquidatedStatus: 'unliquidated' });
    }
  };

  const toggleInStatus = () => {
    switch (inStatus) {
      case 'unchecked':
        setQueryParams({ inStatus: 'all' });
        break;
      case 'all':
        setQueryParams({ inStatus: 'checked' });
        break;
      default:
        setQueryParams({ inStatus: 'unchecked' });
    }
  };

  const toggleOutStatus = () => {
    switch (outStatus) {
      case 'unchecked':
        setQueryParams({ outStatus: 'all' });
        break;
      case 'all':
        setQueryParams({ outStatus: 'checked' });
        break;
      default:
        setQueryParams({ outStatus: 'unchecked' });
    }
  };

  useEffect(() => {
    if (liquidatedStatus === undefined) {
      setQueryParams({ liquidatedStatus: 'unliquidated' }, 'replaceIn');
    }
  }, [liquidatedStatus, setQueryParams]);

  useEffect(() => {
    if (inStatus === undefined) {
      setQueryParams({ inStatus: 'all' }, 'replaceIn');
    }
  }, [inStatus, setQueryParams]);

  useEffect(() => {
    if (outStatus === undefined) {
      setQueryParams({ outStatus: 'all' }, 'replaceIn');
    }
  }, [outStatus, setQueryParams]);

  return (
    <Page
      actions={
        <Fragment key={0}>
          {isDirty && (
            <BasicModal
              title="Confirm Discard Changes"
              content={
                <ty.BodyText>You will lose all unsaved changes.</ty.BodyText>
              }
              confirmText="Discard"
              handleConfirm={handleCancel}
              triggerProps={{
                mr: th.spacing.md,
                status: th.colors.status.error,
              }}
              triggerText="Cancel"
            />
          )}
          <b.Success
            disabled={!isDirty || upsertLoading}
            onClick={handleUpdate}
          >
            {upsertLoading ? (
              <l.Flex alignCenter justifyCenter>
                <ClipLoader
                  color={th.colors.brand.secondary}
                  size={th.sizes.xs}
                />
              </l.Flex>
            ) : (
              'Save'
            )}
          </b.Success>
          <l.Div key="notify" ml={th.spacing.lg}>
            <NotifyUnpaids
              vesselControls={
                selectedItems
                  .map((it) => {
                    const info = `${it}`.split('-');
                    return vesselControls.find(
                      (vc) =>
                        vc.vessel?.vesselCode === info[0] &&
                        vc.shipper?.id === info[1],
                    );
                  })
                  .filter(Boolean) as VesselControl[]
              }
            />
          </l.Div>
        </Fragment>
      }
      extraPaddingTop={72}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.lg}>
            <l.Div mr={th.spacing.lg}>
              <l.Flex alignCenter justifyBetween mb={th.spacing.sm}>
                <ty.SmallText secondary>Search</ty.SmallText>
                {!loading && (
                  <ty.SmallText secondary>
                    Results:{' '}
                    {updatedVesselControls ? updatedVesselControls.length : '-'}
                    {selectedItems.length > 0
                      ? `, Selected: ${selectedItems.length}`
                      : ''}
                  </ty.SmallText>
                )}
              </l.Flex>
              {Search}
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Filter By Date
              </ty.SmallText>
              <TabBar />
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Range
              </ty.SmallText>
              <l.Flex alignCenter>
                {DateRangePicker}
                {BackwardButton}
                {ForwardButton}
              </l.Flex>
            </l.Div>
            <div>
              <l.Div height={24} />
              <ResetButton>
                <l.AreaLink
                  cursor="pointer"
                  height={th.sizes.icon}
                  width={th.sizes.icon}
                  to={`/accounting/vessel-control`}
                >
                  <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
                </l.AreaLink>
              </ResetButton>
            </div>
          </l.Flex>
        </>
      }
      noMaxWidth
      title="Vessel Control Log"
    >
      {!loading ? (
        <ScrollSync>
          {({ onScroll, scrollLeft, scrollTop }) => (
            <GridWrapper>
              <l.Div overflowX="hidden" width={maxWidth - 16}>
                <l.Grid
                  alignCenter
                  bg={th.colors.background}
                  gridTemplateColumns={gridTemplateColumns}
                  pb={th.spacing.sm}
                  pl={th.spacing.sm}
                  pt={th.spacing.tn}
                  transform={`translateX(-${scrollLeft || 0}px)`}
                  width={VESSEL_CONTROL_LOG_WIDTH - 8}
                  zIndex={5}
                >
                  <LineItemCheckbox
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    status="warning"
                  />
                  {columnLabels.map((label, idx) =>
                    idx === 1 ? (
                      <l.Flex alignCenter key="in" relative>
                        <l.Div position="absolute" left={`-${th.spacing.md}`}>
                          <LineItemCheckbox
                            checked={inStatus === 'checked'}
                            crossed={inStatus === 'unchecked'}
                            onChange={toggleInStatus}
                            status="success"
                          />
                        </l.Div>
                        {label}
                      </l.Flex>
                    ) : idx === 2 ? (
                      <l.Flex alignCenter key="out" relative>
                        <l.Div position="absolute" left={`-${th.spacing.md}`}>
                          <LineItemCheckbox
                            checked={outStatus === 'checked'}
                            crossed={outStatus === 'unchecked'}
                            onChange={toggleOutStatus}
                            status="success"
                          />
                        </l.Div>
                        {label}
                      </l.Flex>
                    ) : idx === 4 ? (
                      <l.Flex alignCenter key="liq" relative>
                        <l.Div position="absolute" left={`-${th.spacing.md}`}>
                          <LineItemCheckbox
                            checked={liquidatedStatus === 'liquidated'}
                            crossed={liquidatedStatus === 'unliquidated'}
                            onChange={toggleLiquidatedStatus}
                            status="success"
                          />
                        </l.Div>
                        {label}
                      </l.Flex>
                    ) : idx === 15 ? (
                      <l.Grid
                        alignCenter
                        gridTemplateColumns={unpaidsGridTemplateColumns}
                        key={label.key}
                        ml={th.spacing.sm}
                      >
                        <l.Flex
                          alignCenter
                          transform={`translateX(-${th.spacing.sm})`}
                        >
                          {label}
                          <StatusIndicator
                            halfSelected={isSomeUrgent}
                            selected={isAllUrgent}
                            status="warning"
                            onClick={handleToggleAllUrgent}
                          />
                        </l.Flex>
                        {SALES_USER_CODES.map((userCode) => (
                          <ty.SmallText
                            key={userCode}
                            center
                            secondary
                            textAlign="center"
                          >
                            {userCode}
                          </ty.SmallText>
                        ))}
                      </l.Grid>
                    ) : (
                      label
                    ),
                  )}
                </l.Grid>
              </l.Div>
              <l.Div
                transform={`translateX(-${scrollLeft}px)`}
                zIndex={2}
                relative
                id="vessel-control-portal"
              />
              {!isEmpty(vesselControls) ? (
                <VirtualizedGrid
                  columnCount={1}
                  columnWidth={VESSEL_CONTROL_LOG_WIDTH}
                  disableScrollTop
                  height={700}
                  onScroll={onScroll}
                  rowCount={updatedVesselControls.length}
                  rowHeight={46}
                  width={maxWidth}
                  cellRenderer={({ rowIndex, style }) => {
                    const vesselControl = updatedVesselControls[rowIndex];
                    const vesselControlId = `${vesselControl?.vessel?.vesselCode}-${vesselControl?.shipper?.id}`;
                    return (
                      vesselControl && (
                        <div
                          key={vesselControlId}
                          style={{ ...style, background: th.colors.background }}
                        >
                          <VesselControlItem
                            index={rowIndex}
                            item={vesselControl}
                            listLabels={listLabels}
                            scrollTop={scrollTop}
                            onSelectItem={() => {
                              toggleSelectItem(vesselControlId);
                            }}
                            selected={selectedItems.includes(vesselControlId)}
                          />
                        </div>
                      )
                    );
                  }}
                />
              ) : (
                <l.Div width={maxWidth}>
                  <DataMessage
                    data={vesselControls}
                    error={error}
                    loading={loading}
                    emptyProps={{
                      header: 'No vessel controls found',
                    }}
                  />
                </l.Div>
              )}
            </GridWrapper>
          )}
        </ScrollSync>
      ) : (
        <l.Div width={maxWidth}>
          <DataMessage
            data={vesselControls}
            error={error}
            loading={loading}
            emptyProps={{
              header: 'No vessel controls found',
            }}
          />
        </l.Div>
      )}
    </Page>
  );
};

export default VesselControlLog;
