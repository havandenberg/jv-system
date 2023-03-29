import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { add, endOfISOWeek } from 'date-fns';
import { groupBy, isEmpty, pick, pluck, sortBy } from 'ramda';
import { ClipLoader } from 'react-spinners';
import { ScrollSync } from 'react-virtualized';

import api from 'api';
import ResetImg from 'assets/images/reset';
import { getSortedItems, validateItem } from 'components/column-label';
import { ResetButton } from 'components/inventory/inventory/use-filters';
import { BasicModal } from 'components/modal';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { GridWrapper, VirtualizedGrid } from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useDateRange from 'hooks/use-date-range';
import usePrevious from 'hooks/use-previous';
import {
  useRepackQueueQueryParams,
  useSortQueryParams,
} from 'hooks/use-query-params';
import useSearch from 'hooks/use-search';
import { CommonPackType, RepackQueue } from 'types';
import b from 'ui/button';
import { LineItemCheckbox } from 'ui/checkbox';
import { SmallSelect } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { contrastColor, hexColorWithTransparency } from 'ui/utils';

import {
  getNewRepackQueues,
  indexListLabels as listLabels,
} from './data-utils';
import RepackQueueItem from './item';

export const gridTemplateColumns =
  '100px 100px 1fr 80px 100px 70px 100px 100px 100px 100px 100px 100px 1fr 1fr 30px';

const REPACK_QUEUE_WIDTH = 1700;

export const breadcrumbs = [
  { text: 'Repacks', to: `/inventory/repacks` },
  { text: 'Queue', to: `/inventory/repacks/queue` },
];

export const warehouseOptions = [
  { id: '39', warehouseName: 'Pro-Pack', color: '#00FFFF' },
  { id: '25', warehouseName: 'Holt', color: '#FFFF00' },
];

export interface UpdatedQueueItem {
  orderId: number;
  repackStyleId: string;
  palletCount: number;
  warehouseId: string;
  shipDate: Date;
  delDate: Date;
}

interface RepackQueueState {
  changes: RepackQueue[];
  loadingNewItems: boolean;
  newItemNextId: number;
  saveAttempt: boolean;
  selectedItems: {
    [key: string]: number[];
  };
  updatedItems: UpdatedQueueItem[];
}

const initialState: RepackQueueState = {
  changes: [],
  loadingNewItems: true,
  newItemNextId: -1,
  saveAttempt: false,
  selectedItems: {},
  updatedItems: [],
};

const RepackQueueList = () => {
  const { Search } = useSearch({ paramName: 'repackQueueSearch' });
  const [{ sortBy: sortByQuery, sortOrder }] = useSortQueryParams();
  const [{ showShipped, showNew, warehouse }, setRepackQueueParams] =
    useRepackQueueQueryParams();
  const warehouseId = warehouseOptions.find(
    (opt) => opt.warehouseName === warehouse,
  )?.id;
  const maxWidth = window.innerWidth - 64;

  const {
    data: repackQueueNullRepackDateData,
    loading: repackQueueNullRepackDateLoading,
    error: repackQueueNullRepackDateError,
  } = api.useRepackQueues(true, 'REPACK_DATE_DESC');
  const {
    data: repackQueueWithRepackDateData,
    loading: repackQueueWithRepackDateLoading,
    error: repackQueueWithRepackDateError,
  } = api.useRepackQueues(false, 'REPACK_DATE_DESC');
  const repackQueueLoading =
    repackQueueNullRepackDateLoading || repackQueueWithRepackDateLoading;
  const repackQueueError =
    repackQueueNullRepackDateError || repackQueueWithRepackDateError;
  const repackQueues = [
    ...(repackQueueNullRepackDateData?.nodes || []),
    ...(repackQueueWithRepackDateData?.nodes || []),
  ] as RepackQueue[];

  const {
    data: newRepackQueueData,
    loading: newRepackQueueLoading,
    error: newRepackQueueError,
  } = api.useNewRepackQueues();
  const prevNewRepackQueueLoading = usePrevious(newRepackQueueLoading);
  const newRepackQueues = useMemo(
    () => (newRepackQueueData?.nodes || []) as string[],
    [newRepackQueueData?.nodes],
  );

  const {
    data: repackPackTypeData,
    loading: repackPackTypeLoading,
    error: repackPackTypeError,
  } = api.useRepackCommonPackTypes();
  const repackPackTypes = (repackPackTypeData?.nodes || []) as CommonPackType[];

  const [
    { changes, loadingNewItems, saveAttempt, selectedItems, updatedItems },
    setState,
  ] = useState<RepackQueueState>(initialState);

  const loading =
    newRepackQueueLoading ||
    repackQueueLoading ||
    repackPackTypeLoading ||
    loadingNewItems;
  const error = newRepackQueueError || repackQueueError || repackPackTypeError;

  useEffect(() => {
    if (prevNewRepackQueueLoading && !newRepackQueueLoading) {
      setState((state) => ({
        ...state,
        changes: [
          ...state.changes,
          ...getNewRepackQueues(newRepackQueues, state.newItemNextId),
        ],
        newItemNextId: state.newItemNextId - newRepackQueues.length,
        loadingNewItems: false,
      }));
    }
  }, [prevNewRepackQueueLoading, newRepackQueueLoading, newRepackQueues]);

  const isDirty = !isEmpty(changes);

  const updatedRepackQueues = [
    ...repackQueues.map((repackQueue) => {
      const updatedRepackQueue = changes.find(
        (change) => change.id === repackQueue.id,
      );
      return updatedRepackQueue || repackQueue;
    }),
    ...changes.filter((change) => !change.id || change.id < 0),
  ].filter(
    (rq) =>
      rq &&
      (showNew || rq.id > 0) &&
      (showShipped || rq.invoices.totalCount === 0) &&
      (!warehouseId || warehouseId === rq.warehouseId),
  );

  const handleChange = (updatedItem: RepackQueue) => {
    setState(({ changes: prevChanges, ...rest }) => {
      const existingChange = prevChanges.find(
        (change) => change.id === updatedItem.id,
      );
      if (existingChange) {
        return {
          ...rest,
          changes: prevChanges.map((change) =>
            change.id === updatedItem.id ? updatedItem : change,
          ),
        };
      }
      return { ...rest, changes: [...prevChanges, updatedItem] };
    });
  };

  const handleSetUpdatedItem = (updatedQueueItem: UpdatedQueueItem) => {
    setState((prev) => {
      const currentUpdate = prev.updatedItems.find(
        (update) =>
          update.orderId === updatedQueueItem.orderId &&
          update.repackStyleId === updatedQueueItem.repackStyleId,
      );
      const updatedUpdatedQueueItems = currentUpdate
        ? prev.updatedItems.map((update) =>
            update.orderId === updatedQueueItem.orderId &&
            update.repackStyleId === updatedQueueItem.repackStyleId
              ? updatedQueueItem
              : update,
          )
        : [...prev.updatedItems, updatedQueueItem];
      return {
        ...prev,
        updatedItems: updatedUpdatedQueueItems,
      };
    });
  };

  const handleSelectItem = (repackStyleKey: string, orderId: number) => {
    const selectedRepackStyleItems = selectedItems[repackStyleKey] || [];
    const isSelected = selectedRepackStyleItems.includes(orderId);
    const updatedRepackStyleItems = isSelected
      ? selectedRepackStyleItems.filter((id) => id !== orderId)
      : [...selectedRepackStyleItems, orderId];

    const change = changes.find(
      (rq) => rq.orderId === orderId && rq.repackStyleId === repackStyleKey,
    );

    setState((prev) => ({
      ...prev,
      changes: changes.map((rq) => {
        if (isSelected && rq.id === change?.id) {
          return {
            ...rq,
            repackStyleId:
              (rq as RepackQueue & { repackStyleKey?: string })
                .repackStyleKey || rq.repackStyleId,
          };
        }
        return rq;
      }),
      selectedItems: {
        ...prev.selectedItems,
        [repackStyleKey]: updatedRepackStyleItems,
      },
    }));
  };

  const handleAssignRepackCode = (
    repackStyleKey: string,
    repackStyleId: string,
  ) => {
    setState((prev) => ({
      ...prev,
      changes: changes.map((rq) => {
        if (
          !!prev.selectedItems[repackStyleKey]?.includes(rq.orderId) &&
          repackStyleKey === rq.repackStyleId
        ) {
          return {
            ...rq,
            repackStyleId,
            repackStyleKey,
          };
        }
        return rq;
      }),
      selectedItems: {
        ...prev.selectedItems,
        [repackStyleKey]: [],
        [repackStyleId]: [
          ...(prev.selectedItems[repackStyleId] || []),
          ...(prev.selectedItems[repackStyleKey] || []),
        ],
      },
    }));
  };

  const [upsertRepackQueues, { loading: updateLoading }] =
    api.useUpsertRepackQueues('REPACK_DATE_DESC');

  const handleCancel = () => {
    setState(initialState);
  };

  const allChanges = [
    ...changes,
    ...updatedItems
      .filter(
        ({ orderId, repackStyleId }) =>
          selectedItems[repackStyleId]?.includes(orderId) &&
          !changes.find(
            (c) => c.orderId === orderId && c.repackStyleId === repackStyleId,
          ),
      )
      .map(({ orderId, repackStyleId }) =>
        repackQueues.find(
          (rq) => rq.orderId === orderId && rq.repackStyleId === repackStyleId,
        ),
      )
      .filter((rq) => !!rq),
  ] as RepackQueue[];

  const validChanges = allChanges.filter((change) => {
    const updatedQueueItem = updatedItems.find(
      (update) =>
        update.orderId === change.orderId &&
        update.repackStyleId === change.repackStyleId,
    );

    const changesAccepted =
      !updatedQueueItem ||
      selectedItems[updatedQueueItem.repackStyleId]?.includes(
        updatedQueueItem.orderId,
      ) ||
      (updatedQueueItem.palletCount === change.palletCount &&
        updatedQueueItem.shipDate === change.shipDate);

    const hasValidPackType = !!repackPackTypes.find(
      (rpt) => rpt.repackStyle?.id === change.repackStyleId,
    );

    return (
      validateItem(change, listLabels(handleChange, saveAttempt)) &&
      changesAccepted &&
      hasValidPackType
    );
  });

  const isValid = validChanges.length > 0;

  const handleUpdate = () => {
    setState((prev) => ({ ...prev, saveAttempt: true }));
    if (isValid) {
      upsertRepackQueues({
        variables: {
          repackQueues: validChanges.map((repackQueue) => {
            const updatedQueueItem = updatedItems.find(
              (update) =>
                update.orderId === repackQueue.orderId &&
                update.repackStyleId === repackQueue.repackStyleId,
            );
            return {
              ...pick(
                [
                  'repackCode',
                  'repackStyleId',
                  'orderId',
                  'warehouseId',
                  'orderNotes',
                  'notes',
                ],
                repackQueue,
              ),
              id: repackQueue.id < 0 ? null : repackQueue.id,
              palletCount:
                updatedQueueItem?.palletCount || repackQueue.palletCount,
              shipDate:
                updatedQueueItem?.shipDate || repackQueue.shipDate || null,
              delDate: updatedQueueItem?.delDate || repackQueue.delDate || null,
              warehouseId:
                updatedQueueItem?.warehouseId ||
                repackQueue.warehouseId ||
                null,
              repackDate: repackQueue.repackDate || null,
            };
          }),
        },
      }).then(() => {
        setState((prev) => ({
          ...initialState,
          loadingNewItems: false,
          newItemNextId: prev.newItemNextId,
          changes: changes.filter(
            (change) => !pluck('id', validChanges).includes(change.id),
          ),
          updatedItems: updatedItems.filter(
            (update) =>
              !pluck('orderId', validChanges).includes(update.orderId) ||
              !pluck('repackStyleId', validChanges).includes(
                update.repackStyleId,
              ),
          ),
        }));
      });
    }
  };

  const { DateRangePicker, BackwardButton, ForwardButton } = useDateRange({
    maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
  });

  const columnLabels = useColumns<RepackQueue>(
    'repackDate',
    SORT_ORDER.ASC,
    listLabels(handleChange, saveAttempt),
    'operations',
    'repack_queue',
  );

  useEffect(() => {
    if (showNew === undefined) {
      setRepackQueueParams({ showNew: '1' }, 'replaceIn');
    }
  }, [showNew, setRepackQueueParams]);

  const groupedRepackQueues = groupBy(
    (repackQueue) => repackQueue?.repackStyleId || 'UNK',
    updatedRepackQueues,
  );

  const components = sortBy((key) => {
    const packType = repackPackTypes.find((pt) => pt.repackStyle?.id === key);
    const commonSpeciesName = packType?.commonSpecies?.speciesName || '';
    return packType
      ? `${commonSpeciesName}${packType?.repackStyle?.styleDescription}` ||
          'zzzz'
      : `000${key}`;
  }, Object.keys(groupedRepackQueues))
    .map((key) => {
      const repackQueuesByGroup = getSortedItems(
        listLabels(handleChange, saveAttempt),
        groupedRepackQueues[key],
        sortByQuery,
        sortOrder,
      );
      const packType = repackPackTypes.find((pt) => pt.repackStyle?.id === key);
      return [
        ({ scrollLeft }: { scrollLeft: number }) => (
          <l.Cell
            bg={
              packType?.commonSpecies?.uiColor
                ? hexColorWithTransparency(
                    packType?.commonSpecies?.uiColor,
                    th.opacities.secondary,
                  )
                : th.colors.brand.containerBackgroundAccent
            }
            clickable={false}
            height={36}
          >
            <l.Flex alignCenter height={th.sizes.fill} ml={th.spacing.sm}>
              {packType ? (
                <ty.LinkText
                  bold
                  color={contrastColor(
                    packType?.commonSpecies?.uiColor || undefined,
                  )}
                  to={`/inventory/products/${packType?.commonSpecies?.id}/pack-types/${packType?.id}`}
                  transform={`translateX(${scrollLeft}px)`}
                >{`${packType?.commonSpecies?.speciesName} - ${packType?.repackStyle?.styleDescription} - ${packType?.packTypeDescription}`}</ty.LinkText>
              ) : (
                <l.Flex alignCenter>
                  <ty.BodyText bold transform={`translateX(${scrollLeft}px)`}>
                    {key}
                  </ty.BodyText>
                  <ty.Span ml={th.spacing.sm} />-
                  <SmallSelect
                    bg={th.colors.brand.containerBackground}
                    height={26}
                    ml={th.spacing.sm}
                    pl={th.spacing.sm}
                    onChange={(e) =>
                      handleAssignRepackCode(key, e.target.value)
                    }
                    value=""
                    width={300}
                  >
                    <option key="-" value="">
                      Assign Style
                    </option>
                    {repackPackTypes
                      .filter(
                        (packType) => key === packType.packTypeDescription,
                      )
                      .map((packType) => (
                        <option
                          key={packType.id}
                          value={packType.repackStyle?.id}
                        >
                          {packType.commonSpecies?.speciesName} -{' '}
                          {packType.repackStyle?.styleDescription} (
                          {packType.repackStyle?.id})
                        </option>
                      ))}
                  </SmallSelect>
                </l.Flex>
              )}
            </l.Flex>
          </l.Cell>
        ),
        ...repackQueuesByGroup.map(
          (rq) =>
            ({ scrollTop }: { scrollTop: number }) => {
              const selected = !!selectedItems[key]?.includes(rq.orderId);
              const showCheckbox =
                rq.id < 0 ||
                !!updatedItems.find(
                  ({ orderId, repackStyleId }) =>
                    orderId === rq.orderId &&
                    repackStyleId === rq.repackStyleId,
                );
              return (
                <l.Flex>
                  <l.Flex alignCenter height={36} width={th.spacing.lg}>
                    {showCheckbox && (
                      <LineItemCheckbox
                        onChange={() => {
                          handleSelectItem(key, rq.orderId);
                        }}
                        checked={selected}
                      />
                    )}
                  </l.Flex>
                  <RepackQueueItem
                    currentQueueItem={repackQueues.find(
                      (crq) => crq.id === rq?.id,
                    )}
                    item={rq}
                    repackStyleKey={packType?.packTypeDescription || undefined}
                    handleChange={handleChange}
                    handleSetUpdatedItem={handleSetUpdatedItem}
                    hasValidPackType={!!packType}
                    saveAttempt={saveAttempt}
                    scrollTop={scrollTop}
                    selected={selected}
                  />
                </l.Flex>
              );
            },
        ),
      ];
    })
    .flat();

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
            disabled={(saveAttempt && !isValid) || !isDirty || updateLoading}
            onClick={handleUpdate}
          >
            {updateLoading ? (
              <l.Flex alignCenter justifyCenter>
                <ClipLoader
                  color={th.colors.brand.secondary}
                  size={th.sizes.xs}
                />
              </l.Flex>
            ) : (
              `Save${
                validChanges.length > 0 ? ' (' + validChanges.length + ')' : ''
              }`
            )}
          </b.Success>
        </Fragment>
      }
      breadcrumbs={breadcrumbs}
      extraPaddingTop={80}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.md}>
            <l.Div mr={th.spacing.lg}>
              <l.Flex alignCenter justifyBetween mb={th.spacing.sm}>
                <ty.SmallText secondary>Search</ty.SmallText>
                {!loading && (
                  <ty.SmallText secondary>
                    Results:{' '}
                    {updatedRepackQueues ? updatedRepackQueues.length : '-'}
                  </ty.SmallText>
                )}
              </l.Flex>
              {Search}
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Date Range
              </ty.SmallText>
              <l.Flex alignCenter>
                {DateRangePicker}
                {BackwardButton}
                {ForwardButton}
              </l.Flex>
            </l.Div>
            <l.Div mr={th.spacing.md}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                New?
              </ty.SmallText>
              <l.Flex alignCenter>
                <LineItemCheckbox
                  checked={showNew}
                  onChange={() => {
                    setRepackQueueParams({ showNew: !showNew });
                  }}
                  status="success"
                />
                <ty.BodyText
                  bold
                  color={
                    newRepackQueues.length ? th.colors.status.error : undefined
                  }
                  ml={th.spacing.sm}
                >
                  {!loading ? newRepackQueues.length || '-' : '-'}
                </ty.BodyText>
              </l.Flex>
            </l.Div>
            <l.Div mr={th.spacing.md}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Changes?
              </ty.SmallText>
              <l.Flex alignCenter>
                <ty.BodyText
                  bold
                  color={
                    updatedItems.length ? th.colors.status.error : undefined
                  }
                  ml={th.spacing.xs}
                >
                  {!loading ? updatedItems.length || '-' : '-'}
                </ty.BodyText>
              </l.Flex>
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Shipped?
              </ty.SmallText>
              <LineItemCheckbox
                checked={showShipped}
                onChange={() => {
                  setRepackQueueParams({ showShipped: !showShipped });
                }}
                status="success"
              />
            </l.Div>
            <div>
              <l.Div height={24} />
              <ResetButton>
                <l.AreaLink
                  cursor="pointer"
                  height={th.sizes.icon}
                  width={th.sizes.icon}
                  to={`/inventory/repacks/queue`}
                >
                  <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
                </l.AreaLink>
              </ResetButton>
            </div>
          </l.Flex>
        </>
      }
      noMaxWidth
      title="Repack Queue"
    >
      <>
        {!loading ? (
          <ScrollSync>
            {({ onScroll, scrollLeft, scrollTop }) => (
              <GridWrapper>
                <l.Div overflowX="hidden" width={maxWidth - 16}>
                  <l.Grid
                    bg={th.colors.background}
                    gridTemplateColumns={gridTemplateColumns}
                    ml={32}
                    pb={th.spacing.sm}
                    pl={th.spacing.sm}
                    pt={th.spacing.tn}
                    transform={`translateX(-${scrollLeft || 0}px)`}
                    width={REPACK_QUEUE_WIDTH - 40}
                    zIndex={5}
                  >
                    {columnLabels}
                  </l.Grid>
                </l.Div>
                <l.Div
                  transform={`translateX(${970 - scrollLeft}px)`}
                  relative
                  id="repack-queue-portal"
                  zIndex={5}
                />
                {!isEmpty(allChanges) ? (
                  <VirtualizedGrid
                    disableScrollTop
                    columnCount={1}
                    columnWidth={REPACK_QUEUE_WIDTH}
                    height={650}
                    onScroll={onScroll}
                    rowCount={components.length}
                    rowHeight={46}
                    width={maxWidth}
                    cellRenderer={({ rowIndex, style }) => {
                      const component = components[rowIndex];
                      return (
                        component && (
                          <div key={rowIndex} style={style}>
                            {component({ scrollLeft, scrollTop })}
                          </div>
                        )
                      );
                    }}
                  />
                ) : (
                  <l.Div width={maxWidth}>
                    <DataMessage
                      data={allChanges}
                      error={error}
                      loading={loading}
                      emptyProps={{
                        header: 'No repacks found',
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
              data={updatedRepackQueues}
              error={error}
              loading={loading}
              emptyProps={{
                header: 'No repacks found',
              }}
            />
          </l.Div>
        )}
      </>
    </Page>
  );
};

export default RepackQueueList;
