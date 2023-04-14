import React, { useState } from 'react';
import { endOfISOWeek, isBefore, startOfISOWeek } from 'date-fns';
import { groupBy, mapObjIndexed, sortBy } from 'ramda';

import api from 'api';
import { formatDate } from 'components/date-range-picker';
import { BasicModal } from 'components/modal';
import { Unpaid, VesselControl } from 'types';
import { TextArea } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import {
  isDateGreaterThanOrEqualTo,
  isDateLessThanOrEqualTo,
} from 'utils/date';

import { getUnpaidsInfo } from '../unpaids/data-utils';
import { getVesselControlDueDate } from './data-utils';
import { SALES_USER_CODES, UnpaidsBySalesAssoc } from './unpaids';

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
        }[];
      };
    };
  };
}

const NotifyUnpaids = ({
  vesselControls,
}: {
  vesselControls: VesselControl[];
}) => {
  const [handleNotify, { loading }] = api.useSendUnpaidsNotification();

  const groupedUnpaids = vesselControls.reduce(
    (acc, vesselControl) => {
      const filteredUnpaids = (
        (vesselControl?.unpaids.nodes || []) as Unpaid[]
      ).filter(
        (up) =>
          !!up.invoice?.salesUser &&
          up.invoice?.paidCode !== 'P' &&
          !up.isApproved,
      );

      if (filteredUnpaids.length === 0) {
        return acc;
      }

      const groupedUnpaidsBySalesUser = groupBy(
        (up) =>
          `${vesselControl?.vessel?.vesselCode}-${vesselControl?.shipper?.id}-${up.invoice?.salesUserCode}`,
        filteredUnpaids,
      );

      return {
        ...acc,
        ...mapObjIndexed((unpaids) => {
          const { isAllApproved, isPartialApproved } = getUnpaidsInfo(unpaids);
          return {
            isAllApproved,
            isPartialApproved,
            isLiquidated: vesselControl.isLiquidated,
            unpaids,
          };
        }, groupedUnpaidsBySalesUser),
      };
    },
    {} as {
      [key: string]: {
        isAllApproved: boolean;
        isPartialApproved: boolean;
        isLiquidated: boolean;
        unpaids: Unpaid[];
      };
    },
  );

  const filteredVesselControls = sortBy(
    (vc) => `${vc.vessel?.vesselCode}-${vc.shipper?.id}`,
    vesselControls.filter((vc) =>
      Object.keys(groupedUnpaids).reduce(
        (acc, key) =>
          acc || key.includes(`${vc.vessel?.vesselCode}-${vc.shipper?.id}`),
        false,
      ),
    ),
  );

  const [message, setMessage] = useState('');

  const startOfWeek = startOfISOWeek(new Date());
  const endOfWeek = endOfISOWeek(new Date());

  const getUnpaidVesselInputList = (vesselsInput: UnpaidVesselsInput) =>
    sortBy(
      ({ dueDate }) =>
        dueDate ? new Date(dueDate.replace(/-/g, '/')).getTime() : 0,
      Object.values(vesselsInput).map(({ shippers, ...rest }) => ({
        ...rest,
        shippers: sortBy(
          ({ shipperName }) => shipperName,
          Object.values(shippers).map(({ unpaids, ...rest2 }) => ({
            ...rest2,
            unpaids: sortBy(
              ({ invoiceId }) => invoiceId,
              Object.values(unpaids),
            ),
          })),
        ),
      })),
    );

  const handleNotifyUnpaids = () => {
    const unpaidRemindersInfo = Object.keys(groupedUnpaids).reduce(
      (acc, itemKey) => {
        const [vesselCode, shipperId, salesUserCode] = itemKey.split('-');

        const { shipper, vessel } =
          vesselControls.find(
            (vc) =>
              vc.vessel?.vesselCode === vesselCode &&
              vc.shipper?.id === shipperId,
          ) || {};

        const unpaids = (groupedUnpaids[itemKey]?.unpaids || []) as Unpaid[];
        const { invoice } = unpaids[0] || {};

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
                      truckLoadId: unpaid?.invoice?.truckLoadId || '',
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

  return (
    <BasicModal
      title="Notify Unpaids"
      content={
        <>
          <ty.BodyText mb={th.spacing.lg}>
            Send unpaids reminders for {filteredVesselControls.length}{' '}
            boat-shippers. Add comments below, or leave blank.
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
            {filteredVesselControls.map((vesselControl, idx) => (
              <l.Div
                key={idx}
                borderBottom={th.borders.disabled}
                mb={th.spacing.md}
                pb={th.spacing.md}
              >
                <l.Flex alignCenter mb={12}>
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

                    return (
                      unpaidsInfo && (
                        <l.Flex key={itemKey} alignCenter>
                          <UnpaidsBySalesAssoc {...unpaidsInfo} />
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
      triggerText="Notify"
      triggerProps={{ status: th.colors.status.warning }}
    />
  );
};

export default NotifyUnpaids;
