import React from 'react';

import BaseData from 'components/base-data';
import { PalletSection as PalletSectionType } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { sectionLabels } from './data-utils';

interface Props {
  section: PalletSectionType;
}

const PalletSection = ({ section }: Props) => (
  <>
    <BaseData<PalletSectionType> data={section} labels={sectionLabels} />
    <l.Div height={th.spacing.md} />
  </>
);

export default PalletSection;
