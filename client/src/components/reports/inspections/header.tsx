import React from 'react';

import ResetImg from 'assets/images/reset';
import { ResetButton } from 'components/inventory/inventory/use-filters';
import { useTabBar } from 'components/tab-bar';
import useCoastTabBar from 'components/tab-bar/coast-tab-bar';
import useDateRange from 'hooks/use-date-range';
import useSearch from 'hooks/use-search';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const tabs = [
  {
    id: 'arrival',
    text: 'PSA',
    to: `/reports/inspections/arrival`,
  },
  {
    id: 'd-chile',
    text: 'QIMA',
    to: `/reports/inspections/d-chile`,
  },
  // {
  //   id: 'd-peru',
  //   text: 'Peru',
  //   to: `/reports/inspections/d-peru`,
  // },
];

interface Props {
  loading: boolean;
  dataCount: number;
}

const Header = ({ dataCount, loading }: Props) => {
  const { Search } = useSearch();
  const { TabBar, selectedTabId } = useTabBar({
    tabs,
    isRoute: true,
  });
  const { DateRangePicker } = useDateRange();
  const { TabBar: CoastFilter } = useCoastTabBar();

  return (
    <l.Flex alignCenter mb={th.spacing.lg} justifyBetween>
      <l.Flex alignCenter>
        <l.Div mr={th.spacing.lg}>
          <ty.SmallText mb={th.spacing.sm} secondary>
            Coast
          </ty.SmallText>
          <CoastFilter />
        </l.Div>
        <l.Div mr={th.spacing.lg}>
          <l.Flex alignCenter justifyBetween mb={th.spacing.sm}>
            <ty.SmallText secondary>Search</ty.SmallText>
            {!loading && (
              <ty.SmallText secondary>
                Results: {!loading ? dataCount : '-'}
              </ty.SmallText>
            )}
          </l.Flex>
          {Search}
        </l.Div>
        <l.Div mr={th.spacing.lg}>
          <ty.SmallText mb={th.spacing.sm} secondary>
            Date
          </ty.SmallText>
          {DateRangePicker}
        </l.Div>
        <l.Div>
          <l.Div height={24} />
          <ResetButton>
            <l.AreaLink
              cursor="pointer"
              height={th.sizes.icon}
              width={th.sizes.icon}
              to={`/reports/inspections/${selectedTabId}`}
            >
              <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
            </l.AreaLink>
          </ResetButton>
        </l.Div>
      </l.Flex>
      <l.Div>
        <ty.SmallText mb={th.spacing.sm} secondary>
          Type
        </ty.SmallText>
        <TabBar />
      </l.Div>
    </l.Flex>
  );
};

export default Header;
