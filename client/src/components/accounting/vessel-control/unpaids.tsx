import React, { useState } from 'react';
import { sortBy } from 'ramda';

import InfoPanel from 'components/info-panel';
import StatusIndicator from 'components/status-indicator';
import { Unpaid, VesselControl } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { hexColorWithTransparency } from 'ui/utils';

import { getUnpaidsInfo } from '../unpaids/data-utils';

export const SALES_USER_CODES = [
  'AK',
  'BS',
  'GV',
  'JS',
  'MF',
  'MS',
  'NP',
  'SS',
];

export const gridTemplateColumns = '80px repeat(8, 50px)';

export const UnpaidsBySalesAssoc = ({
  isAllApproved,
  isLiquidated,
  isPartialApproved,
  unpaids,
}: {
  isAllApproved?: boolean;
  isLiquidated?: boolean;
  isPartialApproved?: boolean;
  unpaids: Unpaid[];
}) => {
  const [show, setShow] = useState(false);

  return (
    <InfoPanel
      content={
        <>
          <ty.SmallText secondary>Invoices:</ty.SmallText>
          {unpaids.map((unpaid, idx) => {
            const isAlert = unpaid.invoice?.flag;
            return (
              <l.Flex alignCenter key={idx} mt={th.spacing.sm}>
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
                  to={`/accounting/invoices/${unpaid.invoice?.orderId}`}
                  textDecoration={
                    unpaid.invoice?.paidCode === 'P' ? 'line-through' : 'none'
                  }
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
  handleChange: (updatedItem: VesselControl) => void;
  vesselControl: VesselControl;
};

const UnpaidsManager = ({ handleChange, vesselControl }: Props) => {
  const { isLiquidated } = vesselControl;
  const unpaids = (vesselControl.unpaids.nodes || []) as Unpaid[];

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
      ...vesselControl,
      unpaids: { ...vesselControl.unpaids, nodes: updatedUnpaids },
    });
  };

  const handleToggleUrgent = (salesUserCode: string) => {
    const updatedUnpaids = unpaids.map((u) => {
      if (u.invoice?.salesUserCode === salesUserCode) {
        return { ...u, isUrgent: !u.isUrgent };
      }
      return u;
    });

    handleChange({
      ...vesselControl,
      unpaids: { ...vesselControl.unpaids, nodes: updatedUnpaids },
    });
  };

  return (
    <l.Grid alignCenter gridTemplateColumns={gridTemplateColumns}>
      <l.Flex alignCenter ml={th.spacing.sm}>
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
        const filteredUnpaids = sortBy(
          ({ invoiceId }) => invoiceId,
          unpaids.filter(
            ({ invoice }) => invoice?.salesUserCode === salesUserCode,
          ),
        );

        const {
          isAllUrgent: isAllUrgentBySalesAssoc,
          isAlert: isAlertBySalesAssoc,
          isAllApproved: isAllApprovedBySalesAssoc,
          isPartialApproved: isPartialApprovedBySalesAssoc,
        } = getUnpaidsInfo(filteredUnpaids);

        return filteredUnpaids.length > 0 ? (
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
