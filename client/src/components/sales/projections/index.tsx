import React, { useEffect } from 'react';
import { add, endOfISOWeek } from 'date-fns';
import { OnChangeProps } from 'react-date-range';

import api from 'api';
import ResetImg from 'assets/images/reset';
import useItemSelector from 'components/item-selector';
import { useTabBar } from 'components/tab-bar';
import useDateRange from 'hooks/use-date-range';
import { useQueryValue } from 'hooks/use-query-params';
import { Maybe, Shipper } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import {
  coastTabs,
  leftTabStyles,
  middleTabStyles,
  ResetButton,
  rightTabStyles,
} from '../inventory/use-filters';
import ShipperProjectionGraph from './graph';
import ShipperProjectionsGrid from './grid';
import ShipperProjectionsList from './list';

export const viewTabs = [
  {
    id: 'grid',
    customStyles: { ...leftTabStyles, width: th.spacing.lg },
    text: 'Grid',
  },
  {
    id: 'list',
    customStyles: { ...middleTabStyles, width: th.spacing.lg },
    text: 'List',
  },
  {
    id: 'graph',
    customStyles: { ...rightTabStyles, width: th.spacing.lg },
    text: 'Graph',
  },
];

export interface ShipperProjectionProps {
  coast: string;
  CoastTabBar: React.ReactNode;
  view: string;
  ViewTabBar: React.ReactNode;
  Reset: React.ReactNode;
  DateRangePicker: React.ReactNode;
  ForwardButton: React.ReactNode;
  BackwardButton: React.ReactNode;
  handleDateChange: (OnChange: OnChangeProps) => void;
  ShipperItemSelector: React.ReactNode;
  clearSearch: () => void;
  shipperDataLoading: boolean;
  selectedShipper?: Maybe<Shipper> | undefined;
  shipperId?: string;
}

const ShipperProjections = () => {
  const [shipperIdQuery, setShipperId] = useQueryValue('shipperId');
  const shipperId = shipperIdQuery || '';
  const parsedShipperId = shipperId
    ? shipperId.length === 5
      ? shipperId
      : shipperId.slice(-6, -1)
    : '';
  const { data: shipper } = api.useShipper(parsedShipperId, 'FIRST_NAME_ASC');

  const { TabBar: ViewTabBar, selectedTabId: view } = useTabBar(
    viewTabs,
    false,
    'list',
    'view',
    0,
  );
  const isGrid = view === 'grid';

  const { TabBar: CoastTabBar, selectedTabId: coast } = useTabBar(
    coastTabs,
    false,
    'EC',
    'coast',
    1,
  );

  const {
    DateRangePicker,
    ForwardButton,
    BackwardButton,
    handleClear,
    handleDateChange,
  } = useDateRange({
    hideDefinedRanges: isGrid,
    singleSelection: isGrid,
    maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
    offsetLeft: isGrid ? `-${th.spacing.md}` : -175,
  });

  const {
    data: shipperData,
    loading: shipperDataLoading,
    error: shipperDataError,
  } = api.useShippers('SHIPPER_NAME_ASC');
  const shippers = shipperData ? shipperData.nodes : [];
  const selectedShipper = shippers.find(
    (shipper) => shipper && shipper.id === parsedShipperId,
  );

  const { ItemSelector: ShipperItemSelector, clearSearch } =
    useItemSelector<Shipper>({
      selectItem: (shipper) => {
        setShipperId(shipper.id);
      },
      allItems: shippers as Shipper[],
      closeOnSelect: true,
      clearSearchOnBlur: true,
      excludedItems: [],
      error: shipperDataError,
      errorLabel: 'Shippers',
      loading: shipperDataLoading,
      nameKey: 'shipperName',
      onClear: () => setShipperId(undefined),
      onlyClearSearch: true,
      placeholder: 'Select shipper',
      selectedItem: selectedShipper
        ? `${selectedShipper.shipperName} (${selectedShipper.id})`
        : undefined,
      width: 300,
    });

  const props = {
    coast,
    CoastTabBar: <CoastTabBar />,
    view,
    ViewTabBar: <ViewTabBar />,
    Reset: (
      <ResetButton
        onClick={() => {
          handleClear();
        }}
      >
        <l.AreaLink
          cursor="pointer"
          height={th.sizes.icon}
          width={th.sizes.icon}
          to={`/sales/projections?view=${view}`}
        >
          <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
        </l.AreaLink>
      </ResetButton>
    ),
    DateRangePicker,
    ForwardButton,
    BackwardButton,
    handleDateChange,
    ShipperItemSelector,
    clearSearch,
    shipperDataLoading,
    selectedShipper,
    shipperId,
  };

  const getComponent = () => {
    switch (view) {
      case 'list':
        return <ShipperProjectionsList {...props} />;
      case 'graph':
        return <ShipperProjectionGraph {...props} />;
      default:
        return <ShipperProjectionsGrid {...props} />;
    }
  };

  useEffect(() => {
    if (shipperId && shipper) {
      if (shipperId.length > 5 && view === 'grid') {
        setShipperId(shipper.id);
      } else if (shipperId.length === 5 && view !== 'grid') {
        setShipperId(`${shipper.shipperName} (${shipper.id})`);
      }
    }
  }, [setShipperId, shipper, shipperId, view]);

  return getComponent();
};

export default ShipperProjections;
