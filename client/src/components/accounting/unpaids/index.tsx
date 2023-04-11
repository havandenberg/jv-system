import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { isEmpty, pick } from 'ramda';
import { ClipLoader } from 'react-spinners';
import { ScrollSync } from 'react-virtualized';

import api from 'api';
import ResetImg from 'assets/images/reset';
import { getSortedItems } from 'components/column-label';
import { ResetButton } from 'components/inventory/inventory/use-filters';
import ListItem from 'components/list-item';
import { BasicModal } from 'components/modal';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import StatusIndicator from 'components/status-indicator';
import { useActiveUser } from 'components/user/context';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import usePrevious from 'hooks/use-previous';
import {
  useSortQueryParams,
  useUnpaidsQueryParams,
} from 'hooks/use-query-params';
import useSearch from 'hooks/use-search';
import { Unpaid } from 'types';
import b from 'ui/button';
import { LineItemCheckbox } from 'ui/checkbox';
import { Select } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { SALES_USER_CODES } from '../vessel-control/unpaids';
import { listLabels as getListLabels, UnpaidLabelInfo } from './data-utils';

const gridTemplateColumns =
  '50px 1fr 40px 65px 80px 70px 48px 1fr 80px 65px 65px 90px 1fr';

const UnpaidItem = ({
  index,
  item,
  listLabels,
  scrollTop,
}: {
  index: number;
  item: Unpaid;
  listLabels: UnpaidLabelInfo[];
  scrollTop: number;
}) => {
  const { data, loading, error } = api.useUnpaidInvoiceDetails(
    item.invoice?.id || 0,
  );

  const itemWithDetails = {
    ...item,
    invoice: {
      ...item.invoice,
      ...(!loading && !error && !!data ? data : {}),
    },
  } as Unpaid;

  return (
    <ListItem<Unpaid>
      data={itemWithDetails}
      gridTemplateColumns={gridTemplateColumns}
      hoverable
      listLabels={listLabels}
      isHalfHighlight={!!item.vesselControl?.isLiquidated}
      isHighlight={item.invoice?.paidCode === 'P'}
      highlightColor={th.colors.status.success}
      index={index}
      offsetTop={scrollTop}
    />
  );
};

const Unpaids = () => {
  const {
    apiData,
    roles: { isSalesAssoc },
  } = useActiveUser();
  const activeUserCode = apiData?.data?.userCode;

  const { Search } = useSearch({ paramName: 'unpaidSearch' });
  const [{ sortBy, sortOrder }] = useSortQueryParams();

  const [{ salesUserCode, showLiq, status }, setParams] =
    useUnpaidsQueryParams();

  const {
    data: unpaids,
    vesselCodeOptions,
    loadIdOptions,
    invoiceIdOptions,
    customerOptions,
    shipperOptions,
    loading,
    error,
  } = api.useUnpaids();

  const [changes, setChanges] = useState<Unpaid[]>([]);

  const handleChange = (updatedItem: Unpaid) => {
    setChanges((prevChanges) => {
      const existingChange = prevChanges.find(
        (change) =>
          change.vessel?.vesselCode === updatedItem.vessel?.vesselCode &&
          change.shipper?.id === updatedItem.shipper?.id &&
          change.invoice?.invoiceId === updatedItem.invoice?.invoiceId,
      );
      if (existingChange) {
        return prevChanges.map((change) =>
          change.vessel?.vesselCode === updatedItem.vessel?.vesselCode &&
          change.shipper?.id === updatedItem.shipper?.id &&
          change.invoice?.invoiceId === updatedItem.invoice?.invoiceId
            ? updatedItem
            : change,
        );
      }
      return [...prevChanges, updatedItem];
    });
  };

  const [upsertUnpaids, { loading: upsertLoading }] = api.useUpsertUnpaids();

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
      upsertUnpaids({
        variables: {
          unpaids: changesSlice.map((unpaid) => ({
            ...pick(['isUrgent', 'isApproved', 'notes'], unpaid),
            vesselCode: unpaid.vessel?.vesselCode,
            shipperId: unpaid.shipper?.id,
            invoiceId: unpaid.invoice?.invoiceId,
            id: unpaid?.id || null,
          })),
        },
      }).then(() => {
        upsertLoadingSlices.splice(
          upsertLoadingSlices.indexOf(`${i}-loading`),
          1,
        );
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

  const listLabels = getListLabels(
    handleChange,
    vesselCodeOptions,
    loadIdOptions,
    invoiceIdOptions,
    customerOptions,
    shipperOptions,
  );

  const columnLabels = useColumns<Unpaid>(
    'vesselCode',
    SORT_ORDER.ASC,
    listLabels,
    'accounting',
    'unpaid',
  );

  const isDirty = !isEmpty(changes);

  const updatedUnpaids = getSortedItems(
    listLabels,
    [
      ...unpaids.map((unpaid) => {
        const updatedUnpaidItem = changes.find(
          (change) =>
            change.vessel?.vesselCode === unpaid.vessel?.vesselCode &&
            change.shipper?.id === unpaid.shipper?.id &&
            change.invoice?.invoiceId === unpaid.invoice?.invoiceId,
        );
        return updatedUnpaidItem || unpaid;
      }),
    ],
    sortBy,
    sortOrder,
  );

  const isAllApproved = updatedUnpaids?.every((unpaid) => unpaid.isApproved);
  const handleToggleApproveAll = () => {
    setChanges((prevChanges) => {
      const existingChanges = prevChanges.filter(
        (change) =>
          !unpaids.find(
            (unpaid) =>
              unpaid.vessel?.vesselCode === change.vessel?.vesselCode &&
              unpaid.shipper?.id === change.shipper?.id &&
              unpaid.invoice?.invoiceId === change.invoice?.invoiceId,
          ),
      );
      return [
        ...existingChanges,
        ...unpaids.map((unpaid) => ({
          ...unpaid,
          isApproved: !isAllApproved,
        })),
      ];
    });
  };

  useEffect(() => {
    if (!salesUserCode && isSalesAssoc) {
      setParams({ salesUserCode: activeUserCode || undefined }, 'replaceIn');
    }
  }, [salesUserCode, isSalesAssoc, setParams, activeUserCode]);

  useEffect(() => {
    if (showLiq === undefined) {
      setParams({ showLiq: 0 }, 'replaceIn');
    }
  }, [showLiq, setParams]);

  useEffect(() => {
    if (status === undefined) {
      setParams({ status: 'all' }, 'replaceIn');
    }
  }, [status, setParams]);

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
        </Fragment>
      }
      extraPaddingTop={94}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.lg}>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.xs} secondary>
                Sales Assoc.
              </ty.SmallText>
              <Select
                onChange={(e) => {
                  setParams({ salesUserCode: e.target.value || undefined });
                }}
                value={salesUserCode || 'all'}
                width={72}
              >
                <option key="all" value="all">
                  All
                </option>
                {SALES_USER_CODES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </Select>
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <l.Flex alignCenter justifyBetween mb={th.spacing.sm}>
                <ty.SmallText secondary>Search</ty.SmallText>
                {!loading && (
                  <ty.SmallText secondary>
                    Results: {updatedUnpaids ? updatedUnpaids.length : '-'}
                  </ty.SmallText>
                )}
              </l.Flex>
              {Search}
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Liq?
              </ty.SmallText>
              <LineItemCheckbox
                checked={showLiq}
                onChange={() => {
                  setParams({ showLiq: !showLiq });
                }}
                status="success"
              />
            </l.Div>
            <l.Div mr={th.spacing.md}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Urg
              </ty.SmallText>
              <StatusIndicator
                onClick={() => {
                  setParams(
                    { status: status === 'urgent' ? 'all' : 'urgent' },
                    'replaceIn',
                  );
                }}
                title="Show only urgent unpaids"
                selected={status === 'urgent'}
                status="warning"
              />
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Alert
              </ty.SmallText>
              <StatusIndicator
                onClick={() => {
                  setParams(
                    { status: status === 'alert' ? 'all' : 'alert' },
                    'replaceIn',
                  );
                }}
                title="Show only alerted unpaids"
                selected={status === 'alert'}
                status="error"
              />
            </l.Div>
            <div>
              <l.Div height={24} />
              <ResetButton>
                <l.AreaLink
                  cursor="pointer"
                  height={th.sizes.icon}
                  width={th.sizes.icon}
                  to={`/accounting/unpaids`}
                >
                  <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
                </l.AreaLink>
              </ResetButton>
            </div>
          </l.Flex>
          <l.Grid
            alignCenter
            bg={th.colors.background}
            gridTemplateColumns={gridTemplateColumns}
            pb={th.spacing.sm}
            pl={th.spacing.sm}
            pr={
              updatedUnpaids
                ? updatedUnpaids.length > 12
                  ? th.spacing.md
                  : 0
                : 0
            }
          >
            {columnLabels.map((label, index) =>
              index === 11 ? (
                <l.Flex alignCenter>
                  {label}
                  <l.Div
                    ml={13}
                    title="Click to approve/unapprove all visible unpaids"
                  >
                    <LineItemCheckbox
                      checked={!loading && !!isAllApproved}
                      onChange={handleToggleApproveAll}
                    />
                  </l.Div>
                </l.Flex>
              ) : (
                label
              ),
            )}
          </l.Grid>
        </>
      }
      title="Unpaids"
    >
      {!loading && !isEmpty(updatedUnpaids) ? (
        <ScrollSync>
          {({ onScroll, scrollTop }) => (
            <VirtualizedList
              disableScrollTop
              height={700}
              onScroll={onScroll}
              rowCount={updatedUnpaids ? updatedUnpaids.length : 0}
              rowHeight={46}
              rowRenderer={({ key, index, style }) => {
                const item = updatedUnpaids[index];
                return (
                  item && (
                    <div key={key} style={style}>
                      <UnpaidItem
                        listLabels={listLabels}
                        index={index}
                        item={item}
                        scrollTop={scrollTop}
                      />
                    </div>
                  )
                );
              }}
            />
          )}
        </ScrollSync>
      ) : (
        <DataMessage
          data={updatedUnpaids}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No unpaids found',
          }}
        />
      )}
    </Page>
  );
};

export default Unpaids;
