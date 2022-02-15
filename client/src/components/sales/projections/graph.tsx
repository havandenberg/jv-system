import React from 'react';
import { isEmpty, sortBy } from 'ramda';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from 'recharts';

import api from 'api';
import { DataMessage } from 'components/page/message';
import useSearch from 'hooks/use-search';
import { ShipperProjectionVessel } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { ShipperProjectionProps } from '.';
import Page from 'components/page';

const ShipperProjectionGraph = ({
  CoastTabBar,
  DateRangePicker,
  Reset,
  ViewTabBar,
}: ShipperProjectionProps) => {
  const { Search, clearSearch } = useSearch();

  const { data, loading, error } = api.useShipperProjectionVessels();
  const vessels = sortBy(
    (vessel) => vessel?.shipper?.shipperName || 'Unknown shipper',
    (data ? data.nodes : []) as ShipperProjectionVessel[],
  );

  return (
    <Page
      extraPaddingTop={105}
      headerChildren={
        <l.Flex>
          <l.Div mr={th.spacing.lg}>
            <ty.CaptionText mb={th.spacing.sm} secondary>
              View
            </ty.CaptionText>
            {ViewTabBar}
          </l.Div>
          <l.Div mr={th.spacing.lg}>
            <ty.CaptionText mb={th.spacing.sm} secondary>
              Search products
            </ty.CaptionText>
            <l.Flex alignCenter mb={th.spacing.sm} justifyBetween>
              {Search}
            </l.Flex>
          </l.Div>
          <l.Div mr={th.spacing.lg}>
            <ty.CaptionText mb={th.spacing.sm} secondary>
              Coast
            </ty.CaptionText>
            {CoastTabBar}
          </l.Div>
          <l.Div mr={th.spacing.lg}>
            <ty.CaptionText mb={th.spacing.sm} secondary>
              Date Range
            </ty.CaptionText>
            {DateRangePicker}
          </l.Div>
          <div>
            <l.Div height={32} />
            <l.Div onClick={clearSearch}>{Reset}</l.Div>
          </div>
        </l.Flex>
      }
      title="Shipper Projections"
    >
      {!isEmpty(vessels) ? (
        <l.Div relative>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart barSize={24} data={[]} margin={{ left: 32 }}>
              <CartesianGrid
                stroke={th.colors.brand.containerBackgroundAccent}
              />
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
      ) : (
        <DataMessage
          data={vessels}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No Projections Found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default ShipperProjectionGraph;
