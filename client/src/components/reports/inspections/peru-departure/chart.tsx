import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { PalletLabelInfo } from './data-utils';

interface ChartProps {
  data: PalletLabelInfo[];
  title: string;
}

const Chart = ({ data, title }: ChartProps) => (
  <l.Div width="50%">
    <ty.CaptionText mb={th.spacing.lg} secondary>
      {title}
    </ty.CaptionText>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart barSize={24} data={data} margin={{ left: 32 }}>
        <CartesianGrid stroke={th.colors.brand.containerBackgroundAccent} />
        <XAxis
          angle={-60}
          dataKey="label"
          height={200}
          interval={0}
          stroke={th.colors.brand.secondary}
          textAnchor="end"
          tick={{
            fontSize: th.fontSizes.caption,
          }}
        />
        <YAxis
          allowDecimals={false}
          stroke={th.colors.brand.secondary}
          tick={{
            fontSize: th.fontSizes.caption,
          }}
          unit="%"
          width={35}
        />
        <Bar dataKey="value" fill={th.colors.brand.primary} />
      </BarChart>
    </ResponsiveContainer>
  </l.Div>
);

export default Chart;
