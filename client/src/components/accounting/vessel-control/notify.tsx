import React, { useEffect, useState } from 'react';
import { endOfISOWeek, isBefore, startOfISOWeek } from 'date-fns';
import { sortBy } from 'ramda';

import api from 'api';
import { formatDate } from 'components/date-range-picker';
import { BasicModal } from 'components/modal';
import StatusIndicator from 'components/status-indicator';
import usePrevious from 'hooks/use-previous';
import { Unpaid } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import { TextArea } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import {
  isDateGreaterThanOrEqualTo,
  isDateLessThanOrEqualTo,
} from 'utils/date';

import { getUnpaidsInfo } from '../unpaids/data-utils';
import {
  getVesselControlDueDate,
  UnpaidItem,
  VesselControlItem,
} from './data-utils';
import { SALES_USER_CODES } from './unpaids';

export const gridTemplateColumns = `repeat(4, 1fr)`;

interface UnpaidVesselsInput {
  [key: string]: {
    dueDate: string;
    shipDate: string;
    vesselCode: string;
    vesselName: string;
    shippers: {
      [key: string]: {
        shipperId: string;
        shipperName: string;
        unpaids: {
          invoiceId: string;
          isUrgent: boolean;
          flag: string;
          customerName: string;
          shipDate: string;
        }[];
      };
    };
  };
}

const NotifyUnpaids = ({
  vesselControls,
}: {
  vesselControls: VesselControlItem[];
}) => {
  const previousVesselControls = usePrevious(vesselControls);

  const [handleNotify, { loading }] = api.useSendUnpaidsNotification();

  const sortedVesselControls = sortBy(
    (vc) => `${vc.vessel?.vesselCode}-${vc.shipper?.shipperName}`,
    vesselControls,
  );

  const groupedUnpaids = vesselControls.reduce(
    (acc, vesselControl) => ({
      ...acc,
      ...Object.keys(vesselControl?.groupedPallets || {}).reduce(
        (acc2, salesUserCode) => {
          const groupedPalletsBySalesUser =
            vesselControl?.groupedPallets?.[salesUserCode] || {};

          const itemKey = `${vesselControl?.vessel?.vesselCode}-${vesselControl?.shipper?.id}-${salesUserCode}`;

          const ups = Object.values(groupedPalletsBySalesUser)
            .map(({ unpaid }) => unpaid)
            .filter((up) => !up.isApproved) as UnpaidItem[];
          const up = ups[0];

          const { isAllApproved, isPartialApproved } = getUnpaidsInfo(ups);

          return up
            ? {
                ...acc2,
                [itemKey]: {
                  isAllApproved,
                  isPartialApproved,
                  isLiquidated: up.vesselControl?.isLiquidated,
                  unpaids: ups,
                },
              }
            : acc2;
        },
        {},
      ),
    }),
    {} as {
      [key: string]: {
        isAllApproved: boolean;
        isPartialApproved: boolean;
        isLiquidated: boolean;
        unpaids: Unpaid[];
      };
    },
  );

  const [message, setMessage] = useState('');

  const [selectedItems, setSelectedItems] = useState<string[]>(
    Object.keys(groupedUnpaids).filter(
      (itemKey) => !groupedUnpaids[itemKey]?.isAllApproved,
    ),
  );

  const startOfWeek = startOfISOWeek(new Date());
  const endOfWeek = endOfISOWeek(new Date());

  const getUnpaidVesselInputList = (vesselsInput: UnpaidVesselsInput) =>
    sortBy(
      ({ dueDate }) =>
        dueDate ? new Date(dueDate.replace(/-/g, '/')).getTime() : 0,
      Object.values(vesselsInput).map(({ shippers, ...rest }) => ({
        ...rest,
        shippers: Object.values(shippers),
      })),
    );

  const handleNotifyUnpaids = () => {
    const unpaidRemindersInfo = Object.keys(groupedUnpaids).reduce(
      (acc, itemKey) => {
        const [vesselCode, shipperId, salesUserCode] = itemKey.split('-');
        if (
          !salesUserCode ||
          salesUserCode === 'UNK' ||
          !selectedItems.includes(`${vesselCode}-${shipperId}-${salesUserCode}`)
        ) {
          return acc;
        }
        const unpaids = groupedUnpaids[itemKey]?.unpaids;

        const { vessel, shipper, invoice } = unpaids[0] || {};
        const dueDate =
          vessel && shipper && getVesselControlDueDate(vessel, shipper);
        const isPast = dueDate && isBefore(dueDate, startOfWeek);
        const isCurrent =
          dueDate &&
          isDateGreaterThanOrEqualTo(dueDate, startOfWeek) &&
          isDateLessThanOrEqualTo(dueDate, endOfWeek);

        const vesselKey = isPast
          ? 'pastUnpaids'
          : isCurrent
          ? 'currentUnpaids'
          : 'futureUnpaids';

        return {
          ...acc,
          [salesUserCode]: {
            ...acc[salesUserCode],
            userCode: invoice?.salesUser?.userCode || '',
            firstName: invoice?.salesUser?.personContact?.firstName || '',
            email: invoice?.salesUser?.personContact?.email || '',
            [vesselKey]: {
              ...acc[salesUserCode]?.[vesselKey],
              [vesselCode]: {
                vesselCode: unpaids[0]?.vesselCode || '',
                vesselName: vessel?.vesselName || '',
                dueDate: dueDate ? formatDate(dueDate) : '',
                shipDate: unpaids[0]?.invoice?.actualShipDate
                  ? formatDate(
                      new Date(
                        unpaids[0]?.invoice?.actualShipDate.replace(/-/g, '/'),
                      ),
                    )
                  : '',
                shippers: {
                  ...acc[salesUserCode]?.[vesselKey]?.[vesselCode]?.shippers,
                  [shipperId]: {
                    shipperId: shipper?.id || '',
                    shipperName: shipper?.shipperName || '',
                    unpaids: unpaids.map((unpaid) => ({
                      isUrgent: !!unpaid?.isUrgent,
                      invoiceId: unpaid?.invoice?.invoiceId || '',
                      flag: unpaid?.invoice?.flag || '',
                      customerName:
                        unpaid?.invoice?.billingCustomer?.customerName || '',
                    })),
                  },
                },
              },
            },
          },
        };
      },
      {} as {
        [key: string]: {
          userCode: string;
          firstName: string;
          email: string;
          pastUnpaids?: UnpaidVesselsInput;
          currentUnpaids?: UnpaidVesselsInput;
          futureUnpaids?: UnpaidVesselsInput;
        };
      },
    );

    const unpaidReminders = Object.keys(unpaidRemindersInfo).map(
      (salesUserCode) => {
        const unpaidsBySalesUser = unpaidRemindersInfo[salesUserCode];
        return {
          ...unpaidRemindersInfo[salesUserCode],
          pastUnpaids: unpaidsBySalesUser?.pastUnpaids
            ? getUnpaidVesselInputList(unpaidsBySalesUser.pastUnpaids)
            : [],
          currentUnpaids: unpaidsBySalesUser?.currentUnpaids
            ? getUnpaidVesselInputList(unpaidsBySalesUser.currentUnpaids)
            : [],
          futureUnpaids: unpaidsBySalesUser?.futureUnpaids
            ? getUnpaidVesselInputList(unpaidsBySalesUser.futureUnpaids)
            : [],
        };
      },
    );

    handleNotify({
      variables: {
        message,
        startOfWeek: formatDate(startOfWeek),
        endOfWeek: formatDate(endOfWeek),
        unpaidReminders,
      },
    });
  };

  const toggleSelectItem = (key: string) => {
    if (selectedItems.includes(key)) {
      setSelectedItems(selectedItems.filter((k) => k !== key));
    } else {
      setSelectedItems([...selectedItems, key]);
    }
  };

  useEffect(() => {
    if (previousVesselControls !== vesselControls) {
      setSelectedItems(
        Object.keys(groupedUnpaids).filter(
          (itemKey) => !groupedUnpaids[itemKey]?.isAllApproved,
        ),
      );
    }
  }, [vesselControls, previousVesselControls, groupedUnpaids]);

  return (
    <BasicModal
      title="Notify Unpaids"
      content={
        <>
          <ty.BodyText mb={th.spacing.lg}>
            Send unpaids reminders for {vesselControls.length} boat-shippers.
            Add comments below, or leave blank.
          </ty.BodyText>
          <l.Flex justifyCenter mb={th.spacing.lg}>
            <TextArea
              autoFocus
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              cols={100}
              rows={5}
              value={message}
            />
          </l.Flex>
          <l.Div
            borderTop={th.borders.disabled}
            pt={th.spacing.md}
            height={400}
            overflowY="auto"
          >
            {sortedVesselControls.map((vesselControl, idx) => (
              <l.Div
                key={idx}
                borderBottom={th.borders.disabled}
                mb={th.spacing.md}
                pb={th.spacing.md}
                mr={th.spacing.md}
              >
                <l.Flex alignCenter mb={12}>
                  {!!vesselControl?.isLiquidated && (
                    <l.Div mr={th.spacing.md}>
                      <LineItemCheckbox
                        checked
                        disabled
                        onChange={() => {}}
                        status="success"
                      />
                    </l.Div>
                  )}
                  <ty.BodyText>
                    <ty.Span bold>{vesselControl?.vessel?.vesselCode}</ty.Span>{' '}
                    - {vesselControl?.vessel?.vesselName}
                  </ty.BodyText>
                  <ty.BodyText mx={th.spacing.sm}>/</ty.BodyText>
                  <ty.BodyText>
                    <ty.Span bold>{vesselControl?.shipper?.id}</ty.Span> -{' '}
                    {vesselControl?.shipper?.shipperName}
                  </ty.BodyText>
                </l.Flex>
                <l.Grid
                  gridTemplateColumns={gridTemplateColumns}
                  gridGap={th.spacing.sm}
                  mx={th.spacing.lg}
                >
                  {SALES_USER_CODES.map((salesUserCode) => {
                    const itemKey = `${vesselControl?.vessel?.vesselCode}-${vesselControl?.shipper?.id}-${salesUserCode}`;

                    const unpaidsInfo = groupedUnpaids[itemKey];
                    const { isAllApproved, isPartialApproved } =
                      unpaidsInfo || {};

                    return (
                      unpaidsInfo && (
                        <l.Flex key={itemKey} alignCenter>
                          <StatusIndicator
                            color={
                              !isPartialApproved ? 'transparent' : undefined
                            }
                            halfSelected={isAllApproved}
                            selected={isAllApproved}
                            status={!isPartialApproved ? undefined : 'success'}
                          />
                          <l.Div width={th.spacing.sm} />
                          <LineItemCheckbox
                            checked={selectedItems.includes(itemKey)}
                            onChange={() => {
                              toggleSelectItem(itemKey);
                            }}
                            status="warning"
                          />
                          <ty.BodyText ml={th.spacing.sm}>
                            {salesUserCode}
                          </ty.BodyText>
                        </l.Flex>
                      )
                    );
                  })}
                </l.Grid>
              </l.Div>
            ))}
          </l.Div>
        </>
      }
      cancelText="Cancel"
      cancelProps={{ status: th.colors.status.error }}
      confirmText="Send"
      confirmProps={{ status: th.colors.status.success }}
      confirmLoading={loading}
      handleConfirm={handleNotifyUnpaids}
      triggerDisabled={selectedItems.length === 0}
      triggerText="Notify"
      triggerProps={{ status: th.colors.status.warning }}
    />
  );
};

export default NotifyUnpaids;
