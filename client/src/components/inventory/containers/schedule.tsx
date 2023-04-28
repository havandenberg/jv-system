import React, { useEffect, useState } from 'react';
import { groupBy, isEmpty, pluck, sortBy } from 'ramda';
import { ScrollSync } from 'react-virtualized';

import api from 'api';
import ListItem from 'components/list-item';
import { BasicModal } from 'components/modal';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import useCoastTabBar from 'components/tab-bar/coast-tab-bar';
import { useActiveUser } from 'components/user/context';
import { GridWrapper, VirtualizedGrid } from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import usePrevious from 'hooks/use-previous';
import { Container, Vessel } from 'types';
import b from 'ui/button';
import { TextArea } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { LineItemCheckbox } from 'ui/checkbox';
import { formatShortDate, isDateLessThanOrEqualTo } from 'utils/date';

import { getUpdatedSheetData, scheduleListLabels } from './data-utils';
import { useContainersSelectionContext } from './selection-context';

const gridTemplateColumns =
  '30px repeat(3, 1fr) 100px 1fr 100px 200px 100px 1fr 0.5fr repeat(3, 1.5fr) 30px';

const CONTAINER_SCHEDULE_WIDTH = 2278;

const breadcrumbs = [
  { text: 'Containers', to: '/inventory/containers' },
  { text: 'Schedule', to: '/inventory/containers/schedule' },
];

const ContainerScheduleItem = ({
  item,
  handleUpdateData,
  onSelectItem,
  selected,
}: {
  item: Container;
  handleUpdateData: (updateKey: string, containerData: Container) => void;
  onSelectItem: () => void;
  selected: boolean;
}) => {
  const { data, loading } = api.useContainer([item.containerId || '']);
  const prevLoading = usePrevious(loading);
  const containerData = data?.nodes?.[0] as Container;
  const container = containerData || item;

  useEffect(() => {
    if (!loading && prevLoading && containerData) {
      handleUpdateData(
        `${containerData.containerId}-${containerData.vessel?.vesselCode}`,
        containerData,
      );
    }
  }, [containerData, handleUpdateData, loading, prevLoading]);

  return (
    <ListItem<Container>
      data={container}
      gridTemplateColumns={gridTemplateColumns}
      key={item.containerId}
      listLabels={scheduleListLabels}
      highlightColor={th.colors.status.success}
      isHighlight={!!item.isNew}
      isHalfHighlight={!!item.isAvailable}
      onSelectItem={onSelectItem}
      selected={selected}
      to={`/inventory/containers/${item.containerId}`}
    />
  );
};

const ContainerSchedule = () => {
  const maxWidth = window.innerWidth - 64;
  const { TabBar: CoastFilter, selectedTabId: coast } = useCoastTabBar();
  const {
    roles: { isEditSchedule },
  } = useActiveUser();

  const [
    { selectedContainerIds },
    {
      selectContainer,
      isAllVesselContainersSelected,
      toggleAllVesselContainers,
    },
  ] = useContainersSelectionContext();

  const { data, loading, error } = api.useContainers(true);
  const containers = ((data?.nodes || []) as Container[]).filter(
    ({ isNew, vessel }) =>
      vessel?.coast === coast && (isEditSchedule || !isNew),
  );
  const newContainersCount = containers.filter((c) => c.isNew).length;

  const initialState = {
    clearCompletedVessels: false,
    sendNotification: false,
    message:
      'Please find attached the latest Container Schedule for Jac Vandenberg Inc.',
    updateLoading: false,
    containerData: {} as { [key: string]: Container },
  };

  const [state, setState] = useState(initialState);
  const {
    clearCompletedVessels,
    containerData,
    sendNotification,
    message,
    updateLoading,
  } = state;

  const handleUpdateData = (updateKey: string, containerData: Container) => {
    setState((s) => ({
      ...s,
      containerData: {
        ...s.containerData,
        [updateKey]: containerData,
      },
    }));
  };

  const updatedContainers = containers.map(
    (c) => containerData[`${c.containerId}-${c.vessel?.vesselCode}`] || c,
  );

  console.log(containerData, updatedContainers);

  const groupedContainers = groupBy(
    ({ vessel }) => vessel?.vesselCode || 'UNK',
    updatedContainers,
  );

  const vessels = Object.keys(groupedContainers).map(
    (key) => groupedContainers[key]?.[0]?.vessel,
  ) as Vessel[];

  const availableVessels = vessels.filter(
    (v) =>
      v.dischargeDate &&
      isDateLessThanOrEqualTo(
        new Date(v.dischargeDate.replace(/-/g, '/')),
        new Date(),
      ) &&
      groupedContainers[v.vesselCode || 'UNK']?.every(
        (c) =>
          c.dischargeDate &&
          isDateLessThanOrEqualTo(
            new Date(c.dischargeDate.replace(/-/g, '/')),
            new Date(),
          ),
      ),
  );

  const vesselsWithAvailableContainers = vessels.filter((v) =>
    groupedContainers[v.vesselCode || 'UNK']?.some(
      (c) =>
        c.dischargeDate &&
        isDateLessThanOrEqualTo(
          new Date(c.dischargeDate.replace(/-/g, '/')),
          new Date(),
        ),
    ),
  );

  const availableContainers = containers.filter(
    (c) =>
      c.dischargeDate &&
      isDateLessThanOrEqualTo(
        new Date(c.dischargeDate.replace(/-/g, '/')),
        new Date(),
      ),
  );

  const components = sortBy((key) => {
    const vessel = groupedContainers[key]?.[0]?.vessel;
    return vessel && vessel.arrivalDate
      ? new Date(vessel.arrivalDate.replace(/-/g, '/'))
      : '';
  }, Object.keys(groupedContainers))
    .map((key, idx) => {
      const items = sortBy(
        (c) => c.containerId || 'zzzz',
        groupedContainers[key],
      );
      const vesselContainerIds = pluck('containerId', items || []);
      const vessel = items?.[0]?.vessel;
      return vessel
        ? [
            ...(idx > 0 ? [<div />] : []),
            <l.Flex alignCenter height={th.sizes.fill} ml="9px">
              <l.Flex justifyStart centered height={th.sizes.fill}>
                <LineItemCheckbox
                  checked={isAllVesselContainersSelected(vesselContainerIds)}
                  onChange={() => toggleAllVesselContainers(vesselContainerIds)}
                  status="warning"
                />
              </l.Flex>
              <ty.BodyText bold ml={th.spacing.md}>
                {vessel.arrivalDate
                  ? formatShortDate(
                      new Date(vessel.arrivalDate.replace(/-/g, '/')),
                    )
                  : ''}
              </ty.BodyText>
              <ty.BodyText mx={th.spacing.sm}>|</ty.BodyText>
              <ty.LinkText
                hover={false}
                to={`/inventory/vessels/${vessel?.vesselCode}`}
              >
                {vessel?.vesselCode}
              </ty.LinkText>
              <ty.BodyText mx={th.spacing.sm}>|</ty.BodyText>
              <ty.BodyText>{vessel.vesselName || ''}</ty.BodyText>
              <ty.BodyText mx={th.spacing.sm}>|</ty.BodyText>
              <ty.BodyText>{vessel.warehouse?.warehouseName || ''}</ty.BodyText>
            </l.Flex>,
            ...items.map((item) => (
              <ContainerScheduleItem
                key={item.containerId}
                item={
                  containerData[
                    `${item.containerId}-${item.vessel?.vesselCode}`
                  ] || item
                }
                handleUpdateData={handleUpdateData}
                onSelectItem={() => {
                  selectContainer(item.containerId);
                }}
                selected={selectedContainerIds.includes(
                  item.containerId || 'UNK',
                )}
              />
            )),
          ]
        : [];
    })
    .flat();

  const columnLabels = useColumns<Container>(
    'dischargeDate',
    SORT_ORDER.DESC,
    scheduleListLabels,
    'product',
    'container',
  );

  const hasSelectedContainers = !isEmpty(selectedContainerIds);

  const [handleNotify] = api.useContainerScheduleUpdateNotify();
  const [handleVesselUpdate] = api.useContainerScheduleUpdateVessel();
  const [handleContainerUpdate] = api.useUpdateContainer([], true);

  const handleUpdateConfirm = () => {
    setState({ ...state, updateLoading: true });
    const promises = [] as Promise<any>[];
    if (clearCompletedVessels) {
      promises
        .concat(
          availableVessels.map(
            (v) =>
              new Promise((res, rej) => {
                handleVesselUpdate({
                  variables: {
                    id: v.id,
                    updates: { isAvailable: true, isSchedule: false },
                  },
                })
                  .then(res)
                  .catch(rej);
              }),
          ),
        )
        .concat(
          availableContainers.map(
            (c) =>
              new Promise((res, rej) => {
                handleContainerUpdate({
                  variables: {
                    id: c.id,
                    updates: { isAvailable: true, isSchedule: false },
                  },
                })
                  .then(res)
                  .catch(rej);
              }),
          ),
        );
    }
    if (sendNotification) {
      const filteredVessels = clearCompletedVessels
        ? vessels.filter(
            (v) =>
              !pluck('vesselCode', availableVessels).includes(v.vesselCode),
          )
        : vessels;
      const filteredContainers = clearCompletedVessels
        ? updatedContainers.filter(
            (c) =>
              !pluck('containerId', availableContainers).includes(
                c.containerId,
              ),
          )
        : updatedContainers;
      promises.push(
        new Promise((res, rej) => {
          handleNotify({
            variables: {
              data: getUpdatedSheetData(filteredVessels, filteredContainers),
              message: `<br/><br/><pre>${message}</pre>`,
            },
          })
            .then(res)
            .catch(rej);
        }),
      );
    }
    Promise.all(promises).then(() => {
      setState(initialState);
    });
  };

  return (
    <Page
      actions={[
        <l.Flex alignCenter key="actions">
          <CoastFilter />
          {isEditSchedule && (
            <>
              {' '}
              <ty.BodyText
                disabled={!newContainersCount}
                pl={th.spacing.sm}
                mx={th.spacing.lg}
                width={80}
              >
                <ty.Span mr={th.spacing.sm} secondary={newContainersCount}>
                  New:
                </ty.Span>
                <ty.Span
                  bold={newContainersCount > 0}
                  color={
                    newContainersCount > 0
                      ? th.colors.status.success
                      : undefined
                  }
                >
                  {loading ? '-' : newContainersCount}
                </ty.Span>
              </ty.BodyText>
              {hasSelectedContainers ? (
                <l.AreaLink to="/inventory/containers/bulk-edit">
                  <b.Warning>Bulk Edit</b.Warning>
                </l.AreaLink>
              ) : (
                <b.Warning disabled>Bulk Edit</b.Warning>
              )}
              <BasicModal
                title="Update Container Schedule"
                content={
                  <l.Div minHeight={350}>
                    <l.Flex
                      alignCenter
                      cursor="pointer"
                      mt={th.spacing.lg}
                      onClick={() => {
                        setState({
                          ...state,
                          clearCompletedVessels: !clearCompletedVessels,
                        });
                      }}
                    >
                      <LineItemCheckbox
                        checked={clearCompletedVessels}
                        onChange={() => ({})}
                      />
                      <ty.BodyText ml={th.spacing.sm}>
                        {clearCompletedVessels
                          ? 'Mark the following completed vessels with all containers as "Available".'
                          : 'Do not mark vessels as available.'}
                      </ty.BodyText>
                    </l.Flex>
                    {clearCompletedVessels && (
                      <l.Flex flexWrap="wrap">
                        {vesselsWithAvailableContainers.length > 0 ? (
                          vesselsWithAvailableContainers.map((v) => (
                            <l.Div
                              key={v.vesselCode}
                              mr={th.spacing.lg}
                              mt={th.spacing.md}
                            >
                              <ty.CaptionText bold mb={th.spacing.sm}>
                                {v.vesselCode} - {v.vesselName} (
                                {formatShortDate(
                                  new Date(v.dischargeDate.replace(/-/g, '/')),
                                )}
                                )
                              </ty.CaptionText>
                              {availableContainers
                                .filter(
                                  (c) => c.vessel?.vesselCode === v.vesselCode,
                                )
                                .map((c) => (
                                  <ty.CaptionText
                                    key={c.containerId}
                                    mb={th.spacing.sm}
                                  >
                                    {c.containerId}{' '}
                                    <ty.Span
                                      color={
                                        c.dischargeConfirmed
                                          ? undefined
                                          : th.colors.status.errorAlt
                                      }
                                    >
                                      (
                                      {formatShortDate(
                                        new Date(
                                          c.dischargeDate.replace(/-/g, '/'),
                                        ),
                                      )}
                                      )
                                    </ty.Span>
                                  </ty.CaptionText>
                                ))}
                            </l.Div>
                          ))
                        ) : (
                          <ty.CaptionText
                            key="no-new-vessels"
                            ml={th.spacing.lg}
                            mt={th.spacing.md}
                            secondary
                          >
                            No new available vessels or containers.
                          </ty.CaptionText>
                        )}
                      </l.Flex>
                    )}
                    <l.Flex
                      alignCenter
                      cursor="pointer"
                      mt={th.spacing.lg}
                      onClick={() => {
                        setState({
                          ...state,
                          sendNotification: !sendNotification,
                        });
                      }}
                    >
                      <LineItemCheckbox
                        checked={sendNotification}
                        onChange={() => ({})}
                      />
                      <ty.BodyText ml={th.spacing.sm}>
                        {sendNotification
                          ? 'Send a copy to PSA by email with the following message:'
                          : 'Do not send PSA a copy.'}
                      </ty.BodyText>
                    </l.Flex>
                    {sendNotification && (
                      <l.Flex justifyCenter mt={th.spacing.md}>
                        <TextArea
                          autoFocus
                          onChange={(e) => {
                            setState({
                              ...state,
                              message: e.target.value,
                            });
                          }}
                          cols={100}
                          rows={10}
                          value={message}
                        />
                      </l.Flex>
                    )}
                  </l.Div>
                }
                confirmLoading={updateLoading}
                confirmProps={{
                  status: th.colors.status.success,
                }}
                cancelProps={{
                  status: th.colors.status.error,
                }}
                confirmDisabled={!sendNotification && !clearCompletedVessels}
                confirmText="Confirm"
                handleConfirm={handleUpdateConfirm}
                triggerDisabled={loading}
                triggerProps={{
                  ml: th.spacing.lg,
                }}
                triggerText="Update & Notify"
              />
            </>
          )}
        </l.Flex>,
      ]}
      breadcrumbs={breadcrumbs}
      extraPaddingTop={16}
      noMaxWidth
      title="Container Schedule"
    >
      {!loading ? (
        <ScrollSync>
          {({ onScroll, scrollLeft }) => (
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
                  width={CONTAINER_SCHEDULE_WIDTH - 8}
                  zIndex={5}
                >
                  <div />
                  {columnLabels}
                </l.Grid>
              </l.Div>
              {!isEmpty(components) ? (
                <VirtualizedGrid
                  columnCount={1}
                  columnWidth={CONTAINER_SCHEDULE_WIDTH}
                  disableScrollTop
                  onScroll={onScroll}
                  rowCount={data ? components.length : 0}
                  width={maxWidth}
                  cellRenderer={({ key, rowIndex, style }) => {
                    const item = components[rowIndex];
                    return (
                      item && (
                        <div key={key} style={style}>
                          {item}
                        </div>
                      )
                    );
                  }}
                />
              ) : (
                <l.Div width={maxWidth}>
                  <DataMessage
                    data={containers}
                    error={error}
                    loading={loading}
                    emptyProps={{
                      header: 'No containers found',
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
            data={containers}
            error={error}
            loading={loading}
            emptyProps={{
              header: 'No containers found',
            }}
          />
        </l.Div>
      )}
    </Page>
  );
};

export default ContainerSchedule;
