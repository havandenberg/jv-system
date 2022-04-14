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
      {loading ? '-' : reducePalletData(items, 'palletsReceived').real}
    </ty.CaptionText>
    <ty.CaptionText color={th.colors.brand.primaryAccent} mr={th.spacing.lg}>
      On Hand: {loading ? '-' : reducePalletData(items, 'palletsOnHand').real}
    </ty.CaptionText>
    <ty.CaptionText color={th.colors.status.successAlt}>
      Available:{' '}
      {loading ? '-' : reducePalletData(items, 'palletsAvailable').real}
    </ty.CaptionText>
  </l.Flex>
);

export default InventoryListTotals;
