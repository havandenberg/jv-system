import React, { Fragment, useState } from 'react';
import { add, endOfISOWeek } from 'date-fns';
import { isEmpty, pick } from 'ramda';
import { ClipLoader } from 'react-spinners';
import { ScrollSync } from 'react-virtualized';

import api from 'api';
import ResetImg from 'assets/images/reset';
import { ResetButton } from 'components/inventory/inventory/use-filters';
import ListItem from 'components/list-item';
import { BasicModal } from 'components/modal';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { useTabBar } from 'components/tab-bar';
import { GridWrapper, VirtualizedGrid } from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useDateRange from 'hooks/use-date-range';
import useSearch from 'hooks/use-search';
import { useQueryValue } from 'hooks/use-query-params';
import { VesselControl } from 'types';
import b from 'ui/button';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { listLabels } from './data-utils';
import NotifyUnpaids from './notify';
import {
  gridTemplateColumns as unpaidsGridTemplateColumns,
  SALES_USER_CODES,
} from './unpaids';

const gridTemplateColumns =
  '30px 1fr 0.5fr 0.5fr 1fr 0.5fr 0.7fr 2fr 2fr 1fr 2fr 1fr 0.7fr 0.7fr 0.7fr 430px 3fr 3fr';

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

const VesselControlLog = () => {
  const { Search } = useSearch({ paramName: 'vesselControlSearch' });
  const [liquidatedStatus, setLiquidatedStatus] =
    useQueryValue('liquidatedStatus');
  const isLiquidated = liquidatedStatus === 'liquidated';
  const isNotLiquidated = liquidatedStatus === 'unliquidated';
  const [vesselControlView] = useQueryValue('vesselControlView');
  const isDue = vesselControlView === 'due';

  const { data: vesselControls, loading, error } = api.useVesselControls();

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
    api.useUpsertUnpaids('ID_ASC');

  const upsertLoading = upsertVesselControlsLoading || upsertUnpaidsLoading;

  const handleCancel = () => {
    setChanges([]);
  };

  const handleUpdate = () => {
    upsertVesselControls({
      variables: {
        vesselControls: changes.map((vesselControlItem) => ({
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
          dateSent: vesselControlItem.dateSent || null,
          id: vesselControlItem.id || null,
          shipperId: vesselControlItem.shipper?.id,
          vesselCode: vesselControlItem.vessel?.vesselCode,
        })),
      },
    })
      .then(() => {
        upsertUnpaids({
          variables: {
            unpaids: changes
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
          setChanges([]);
        });
      })
      .then(handleCancel);
  };

  const { TabBar } = useTabBar({
    tabs: dateRangeTabs,
    isRoute: false,
    defaultTabId: 'due',
    paramName: 'vesselControlView',
  });

  const { DateRangePicker, BackwardButton, ForwardButton } = useDateRange({
    maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
  });

  const columnLabels = useColumns<VesselControl>(
    'dueDate',
    SORT_ORDER.ASC,
    listLabels(handleChange),
    'accounting',
    'vessel_control',
  );

  const isDirty = !isEmpty(changes);

  const updatedVesselControls = [
    ...vesselControls.map((vesselControl) => {
      const updatedVesselControl = changes.find(
        (change) =>
          change.vessel?.vesselCode === vesselControl.vessel?.vesselCode &&
          change.shipper?.id === vesselControl.shipper?.id,
      );
      return updatedVesselControl || vesselControl;
    }),
    ...changes.filter((change) => !change.id),
  ].filter((vc) => {
    if (isLiquidated) {
      return vc.isLiquidated && (isDue || !!vc.id);
    }
    if (isNotLiquidated) {
      return !vc.isLiquidated && (isDue || !!vc.id);
    }
    return isDue || !!vc.id;
  });

  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const isAllSelected = selectedItems.length === updatedVesselControls.length;

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
      case undefined:
        setLiquidatedStatus('unliquidated');
        break;
      case 'unliquidated':
        setLiquidatedStatus('liquidated');
        break;
      default:
        setLiquidatedStatus(undefined);
    }
  };

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
      title="Vessel Control Log"
    >
      {!loading ? (
        <ScrollSync>
          {({ onScroll, scrollLeft, scrollTop }) => (
            <GridWrapper>
              <l.Div overflowX="hidden" width={1008}>
                <l.Grid
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
                    idx === 4 ? (
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
                    ) : idx === 14 ? (
                      <l.Grid
                        alignCenter
                        gridTemplateColumns={unpaidsGridTemplateColumns}
                        key={label.key}
                        ml={th.spacing.sm}
                      >
                        <l.Div transform={`translateX(-${th.spacing.sm})`}>
                          {label}
                        </l.Div>
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
              {!isEmpty(vesselControls) ? (
                <VirtualizedGrid
                  columnCount={1}
                  columnWidth={VESSEL_CONTROL_LOG_WIDTH}
                  height={700}
                  onScroll={onScroll}
                  rowCount={updatedVesselControls.length + 1}
                  rowHeight={46}
                  width={1024}
                  cellRenderer={({ rowIndex, style }) => {
                    const vesselControl = updatedVesselControls[rowIndex];
                    const vesselControlId = `${vesselControl?.vessel?.vesselCode}-${vesselControl?.shipper?.id}`;
                    return (
                      vesselControl && (
                        <div
                          key={vesselControlId}
                          style={{ ...style, background: th.colors.background }}
                        >
                          <ListItem<VesselControl>
                            data={vesselControl}
                            gridTemplateColumns={gridTemplateColumns}
                            hoverable
                            listLabels={listLabels(handleChange)}
                            isHalfHighlight={!!vesselControl.isLiquidated}
                            highlightColor={th.colors.status.success}
                            offsetTop={scrollTop}
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
                <DataMessage
                  data={vesselControls}
                  error={error}
                  loading={loading}
                  emptyProps={{
                    header: 'No vessel controls found',
                  }}
                />
              )}
            </GridWrapper>
          )}
        </ScrollSync>
      ) : (
        <DataMessage
          data={vesselControls}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No vessel controls found',
          }}
        />
      )}
    </Page>
  );
};

export default VesselControlLog;
