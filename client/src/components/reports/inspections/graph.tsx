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

interface GraphProps {
  data: any[];
  title: string;
}

const Graph = ({ data, title }: GraphProps) => (
  <l.Div width="50%">
    <l.Flex justifyCenter mb={th.spacing.lg}>
      <ty.LargeText secondary>{title}</ty.LargeText>
    </l.Flex>
    <ResponsiveContainer width="100%" height={450}>
      <BarChart barSize={24} data={data} margin={{ left: 32 }}>
        <CartesianGrid stroke={th.colors.brand.disabled} horizontal={false} />
        <XAxis
          angle={-60}
          dataKey="label"
          stroke={th.colors.brand.secondary}
          height={200}
          interval={0}
          textAnchor="end"
        />
        <YAxis stroke={th.colors.brand.secondary} unit="%" width={40} />
        <Bar dataKey="value" fill={th.colors.brand.primary} />
      </BarChart>
    </ResponsiveContainer>
  </l.Div>
);

export default Graph;
