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

const InventoryListTotals = ({ items, loading }: Props) => (
  <l.Flex>
    <ty.CaptionText mr={th.spacing.lg}>
      Total Received:{' '}
      {loading ? '-' : reducePalletData(items, 'palletsReceived').total}
    </ty.CaptionText>
    <ty.CaptionText color={th.colors.brand.primaryAccent} mr={th.spacing.lg}>
      On Hand: {loading ? '-' : reducePalletData(items, 'palletsOnHand').total}
    </ty.CaptionText>
    <ty.CaptionText
      color={
        reducePalletData(items, 'palletsAvailable').total < 0
          ? th.colors.status.errorAlt
          : th.colors.status.successAlt
      }
    >
      Available:{' '}
      {loading ? '-' : reducePalletData(items, 'palletsAvailable').total}
    </ty.CaptionText>
  </l.Flex>
);

export default InventoryListTotals;
