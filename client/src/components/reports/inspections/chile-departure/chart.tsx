import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const COLORS: { [key: string]: string } = {
  Average: th.colors.status.warning,
  Fair: th.colors.status.warningSecondary,
  Good: th.colors.status.success,
  Poor: th.colors.status.error,
};

interface ChartProps {
  data: {
    label: string;
    value: number;
  }[];
  title: string;
}

const Chart = ({ data, title }: ChartProps) => (
  <l.Div width="60%">
    <ty.CaptionText secondary>{title}</ty.CaptionText>
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={70}
          outerRadius={100}
          fill={th.colors.brand.primary}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.label] || th.colors.brand.primary}
            />
          ))}
        </Pie>
        <Legend
          align="right"
          formatter={(value, { payload }) =>
            `${value} (${(payload as any).value}%)`
          }
          layout="vertical"
          verticalAlign="middle"
        />
      </PieChart>
    </ResponsiveContainer>
  </l.Div>
);

export default Chart;
