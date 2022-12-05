import React, { useState } from 'react';
import { sortBy } from 'ramda';

import StatusIndicator from 'components/status-indicator';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { UnpaidItem, VesselControlItem } from './data-utils';
import { hexColorWithTransparency } from 'ui/utils';

import { getUnpaidsInfo } from '../unpaids/data-utils';
import InfoPanel from 'components/info-panel';

export const SALES_USER_CODES = ['AK', 'BS', 'CP', 'GV', 'MF', 'NP', 'SS'];

export const gridTemplateColumns = '60px repeat(7, 50px)';

const UnpaidsBySalesAssoc = ({
  isAllApproved,
  isLiquidated,
  isPartialApproved,
  unpaids,
}: {
  isAllApproved?: boolean;
  isLiquidated?: boolean;
  isPartialApproved?: boolean;
  unpaids: UnpaidItem[];
}) => {
  const [show, setShow] = useState(false);

  return (
    <InfoPanel
      content={
        <>
          <ty.SmallText secondary>Invoices:</ty.SmallText>
          {unpaids.map((unpaid) => {
            const isAlert = unpaid.invoice?.flag;
            return (
              <l.Flex
                alignCenter
                key={unpaid.orderId || unpaid.invoice?.orderId}
                mt={th.spacing.sm}
              >
                <l.Div pr={th.spacing.xs}>
                  <LineItemCheckbox
                    checked={!!unpaid.isApproved}
                    disabled
                    onChange={() => {}}
                  />
                </l.Div>
                {isAlert ? (
                  <l.Div px={th.spacing.xs}>
                    <StatusIndicator
                      diameter={th.spacing.sm}
                      selected={true}
                      status="error"
                    />
                  </l.Div>
                ) : (
                  <l.Div width={th.spacing.sm} />
                )}
                <ty.LinkText
                  hover="false"
                  ml={th.spacing.xs}
                  target="_blank"
                  to={`/accounting/invoices/${
                    unpaid.orderId || unpaid.invoice?.orderId
                  }`}
                >
                  {unpaid.invoiceId}
                </ty.LinkText>
                <ty.BodyText ml={th.spacing.md}>
                  {unpaid.notes || '-'}
                </ty.BodyText>
              </l.Flex>
            );
          })}
        </>
      }
      customStyles={{
        padding: th.spacing.md,
        top: 18,
        height: 'auto',
        maxHeight: 'none',
        width: 'auto',
      }}
      hover
      setShow={setShow}
      triggerIcon={
        <StatusIndicator
          color={
            !isPartialApproved
              ? 'transparent'
              : show && !(!isLiquidated && isAllApproved)
              ? hexColorWithTransparency(th.colors.status.success, 0.3)
              : undefined
          }
          halfSelected={isAllApproved}
          selected={show || (!isLiquidated && isAllApproved)}
          status={!isPartialApproved ? undefined : 'success'}
          onClick={() => {}}
        />
      }
      show={show}
      visible
    />
  );
};

type Props = {
  handleChange: (updatedItem: VesselControlItem) => void;
  vesselControlItem: VesselControlItem;
};

const UnpaidsManager = ({ handleChange, vesselControlItem }: Props) => {
  const { groupedPallets, isLiquidated } = vesselControlItem;
  const unpaids = Object.values(groupedPallets)
    .reduce(
      (acc, palletsByShipper) =>
        [
          ...acc,
          ...Object.values(palletsByShipper).map(({ unpaid }) => unpaid),
        ] as UnpaidItem[],
      [] as UnpaidItem[],
    )
    .map(
      (unpaid) =>
        (vesselControlItem.unpaids.nodes || []).find(
          (u) =>
            u &&
            u.vesselCode === unpaid.vesselCode &&
            u.shipperId === unpaid.shipperId &&
            u.invoiceId === unpaid.invoiceId,
        ) || unpaid,
    ) as UnpaidItem[];

  const { isAllUrgent, isAllApproved, isPartialApproved } =
    unpaids.length > 0
      ? getUnpaidsInfo(unpaids)
      : {
          isAllUrgent: false,
          isAllApproved: false,
          isPartialApproved: false,
        };

  const handleToggleAllUrgent = () => {
    const updatedUnpaids = unpaids.map((unpaid) => ({
      ...unpaid,
      isUrgent: !isAllUrgent,
    }));
    handleChange({
      ...vesselControlItem,
      unpaids: { ...vesselControlItem.unpaids, nodes: updatedUnpaids },
    });
  };

  const handleToggleUrgent = (salesUserCode: string) => {
    const invoiceIds = Object.values(groupedPallets[salesUserCode])
      .flat()
      .map(({ pallets }) => pallets[0]?.invoiceHeader?.invoiceId);

    const updatedUnpaids = unpaids.map((u) => {
      if (invoiceIds.includes(u.invoiceId)) {
        return { ...u, isUrgent: !u.isUrgent };
      }
      return u;
    });

    handleChange({
      ...vesselControlItem,
      unpaids: { ...vesselControlItem.unpaids, nodes: updatedUnpaids },
    });
  };

  return (
    <l.Grid alignCenter gridTemplateColumns={gridTemplateColumns}>
      <l.Flex alignCenter>
        <StatusIndicator
          color={!isPartialApproved ? 'transparent' : undefined}
          halfSelected={isAllApproved}
          selected={!isLiquidated && isAllApproved}
          status={!isPartialApproved ? undefined : 'success'}
        />
        <l.Div width={th.spacing.sm} />
        <StatusIndicator
          halfSelected={isAllUrgent}
          selected={!isLiquidated && isAllUrgent}
          status="warning"
          onClick={isLiquidated ? undefined : handleToggleAllUrgent}
        />
      </l.Flex>
      {SALES_USER_CODES.map((salesUserCode) => {
        const invoiceIds = Object.values(groupedPallets[salesUserCode] || {})
          .flat()
          .map(({ pallets }) => pallets[0]?.invoiceHeader?.invoiceId);

        const filteredUnpaids = sortBy(
          ({ invoiceId }) => invoiceId,
          unpaids.filter((unpaid) => invoiceIds.includes(unpaid.invoiceId)),
        );

        const {
          isAllUrgent: isAllUrgentBySalesAssoc,
          isAlert: isAlertBySalesAssoc,
          isAllApproved: isAllApprovedBySalesAssoc,
          isPartialApproved: isPartialApprovedBySalesAssoc,
        } = getUnpaidsInfo(filteredUnpaids);

        return groupedPallets[salesUserCode] ? (
          <l.Flex alignCenter key={salesUserCode} justifyCenter>
            <UnpaidsBySalesAssoc
              isAllApproved={isAllApprovedBySalesAssoc}
              isLiquidated={!!isLiquidated}
              isPartialApproved={isPartialApprovedBySalesAssoc}
              unpaids={filteredUnpaids}
            />
            <l.Div ml={th.spacing.xs}>
              <StatusIndicator
                color={!isAllUrgentBySalesAssoc ? 'transparent' : undefined}
                diameter={th.spacing.sm}
                halfSelected={isAllUrgentBySalesAssoc}
                selected={!isLiquidated && isAllUrgentBySalesAssoc}
                status="warning"
                onClick={
                  isLiquidated
                    ? undefined
                    : () => {
                        handleToggleUrgent(salesUserCode);
                      }
                }
              />
              <l.Div height={th.spacing.tn} />
              <StatusIndicator
                color={!isAlertBySalesAssoc ? 'transparent' : undefined}
                diameter={th.spacing.sm}
                halfSelected={!!isLiquidated && isAlertBySalesAssoc}
                selected={!isLiquidated && isAlertBySalesAssoc}
                status="error"
              />
            </l.Div>
          </l.Flex>
        ) : (
          <ty.BodyText center key={salesUserCode}>
            -
          </ty.BodyText>
        );
      })}
    </l.Grid>
  );
};

export default UnpaidsManager;
