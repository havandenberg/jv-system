import React from 'react';

import { InventoryItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { reducePalletData } from '../utils';

interface Props {
  items: InventoryItem[];
  loading: boolean;
}

const InventoryListTotals = ({ items, loading }: Props) => {
  const palletData = reducePalletData(items);
  const { palletsAvailable, palletsOnHand, palletsReceived } = palletData;
  return (
    <l.Flex>
      <ty.CaptionText mr={th.spacing.lg}>
        Total Received:{' '}
        <ty.Span bold ml={th.spacing.xs}>
          {loading ? '-' : palletsReceived.total}
        </ty.Span>
      </ty.CaptionText>
      <ty.CaptionText color={th.colors.brand.primaryAccent} mr={th.spacing.lg}>
        On Hand:{' '}
        <ty.Span bold ml={th.spacing.xs}>
          {loading ? '-' : palletsOnHand.total}
        </ty.Span>
      </ty.CaptionText>
      <ty.CaptionText
        color={
          palletsAvailable.total < 0
            ? th.colors.status.errorAlt
            : th.colors.status.successAlt
        }
      >
        Available:{' '}
        <ty.Span bold ml={th.spacing.xs}>
          {loading ? '-' : palletsAvailable.total}
        </ty.Span>
      </ty.CaptionText>
    </l.Flex>
  );
};

export default InventoryListTotals;
