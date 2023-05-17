import React, { useEffect, useState } from 'react';
import { isEmpty } from 'ramda';
import { Redirect } from 'react-router-dom';
import { ScrollSync } from 'react-virtualized';

import api from 'api';
import ResetImg from 'assets/images/reset';
import { getSortedItems } from 'components/column-label';
import { ResetButton } from 'components/inventory/inventory/use-filters';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { useTabBar } from 'components/tab-bar';
import { useActiveUser } from 'components/user/context';
import { GridWrapper, VirtualizedGrid } from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import usePrevious from 'hooks/use-previous';
import {
  useSortQueryParams,
  useWireControlQueryParams,
} from 'hooks/use-query-params';
import useSearch from 'hooks/use-search';
import { VesselControl } from 'types';
import b from 'ui/button';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import {
  listLabels as getListLabels,
  VesselControlLabelInfo,
} from './data-utils';

const gridTemplateColumns = (wireControlView: string) =>
  `0.8fr 2fr 2fr 1fr 0.8fr 2fr 1fr 0.7fr ${
    wireControlView === 'ocean-freight'
      ? '80px 160px 70px 80px 120px 150px 100px 80px repeat(3, 80px)'
      : 'repeat(4, 80px)'
  }`;

const WIRE_CONTROL_LOG_WIDTH = (wireControlView: string) =>
  wireControlView === 'ocean-freight' ? 1930 : 1200;

const WireControlItem = ({
  item,
  handleUpdateData,
  listLabels,
}: {
  handleUpdateData: (updateKey: string, data: VesselControl) => void;
  item: VesselControl;
  listLabels: VesselControlLabelInfo[];
}) => {
  const [{ wireControlView }] = useWireControlQueryParams();
  const { data, loading } = api.useWireControl(item.id || 0);
  const prevLoading = usePrevious(loading);
  const wireControl = data || item;

  useEffect(() => {
    if (!loading && prevLoading && data) {
      handleUpdateData(`${data.vessel?.vesselCode}-${data.shipper?.id}`, data);
    }
  }, [data, handleUpdateData, loading, prevLoading]);

  return (
    <ListItem<VesselControl>
      data={wireControl}
      gridTemplateColumns={gridTemplateColumns(wireControlView)}
      hoverable
      listLabels={listLabels}
      isHalfHighlight={!!item.isLiquidated}
      highlightColor={th.colors.status.success}
    />
  );
};

const tabs = [
  {
    id: 'all',
    text: 'All',
  },
  {
    id: 'ocean-freight',
    text: 'Ocean Freight',
  },
  {
    id: 'shipper-advance',
    text: 'Shipper Advance',
  },
  {
    id: 'account-of-sale',
    text: 'Account Of Sale',
  },
  {
    id: 'misc',
    text: 'Misc',
  },
];

const WireControlLog = () => {
  const {
    roles: { isAccounting },
  } = useActiveUser();
  const { Search } = useSearch({ paramName: 'wireControlSearch' });
  const [{ sortBy = 'vesselCode', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const [
    { liquidatedStatus, scrollToShipper, scrollToVessel, wireControlView },
    setQueryParams,
  ] = useWireControlQueryParams();
  const maxWidth = window.innerWidth - 64;

  const {
    data,
    vesselOptions,
    shipperOptions,
    arrivalOptions,
    countryOptions,
    loading,
    error,
  } = api.useWireControls();

  const [wireControlData, setState] = useState<{
    [key: string]: VesselControl;
  }>({});

  const handleUpdateData = (
    updateKey: string,
    vesselControlData: VesselControl,
  ) => {
    setState((s) => ({
      ...s,
      [updateKey]: vesselControlData,
    }));
  };

  const updatedData = data.map(
    (vc) => wireControlData[`${vc.vessel?.vesselCode}-${vc.shipper?.id}`] || vc,
  );

  const listLabels = getListLabels(
    vesselOptions,
    shipperOptions,
    arrivalOptions,
    countryOptions,
    wireControlView,
    setQueryParams,
  );

  const wireControls = getSortedItems(
    listLabels(),
    updatedData,
    sortBy,
    sortOrder,
  );

  const components = wireControls
    .map((vc) => {
      const wires =
        vc.wires?.nodes.filter((w) => w?.wireType === wireControlView) || [];
      if (wires.length > 0) {
        return wires.map((w) => ({
          vesselControl: vc,
          wire: w,
        }));
      }
      return [
        {
          vesselControl: vc,
          wire: null,
        },
      ];
    })
    .flat();

  const scrollToRow = components.findIndex(
    (c) =>
      c.vesselControl.vessel?.vesselCode === scrollToVessel &&
      c.vesselControl.shipper?.id === scrollToShipper,
  );

  const { TabBar } = useTabBar({
    tabs: tabs,
    isRoute: false,
    paramName: 'wireControlView',
  });

  const columnLabels = useColumns<VesselControl>(
    'vesselCode',
    SORT_ORDER.ASC,
    listLabels(),
    'accounting',
    'vessel_control',
  );

  const toggleLiquidatedStatus = () => {
    switch (liquidatedStatus) {
      case 'unliquidated':
        setQueryParams({ liquidatedStatus: 'all' });
        break;
      case 'all':
        setQueryParams({ liquidatedStatus: 'liquidated' });
        break;
      default:
        setQueryParams({ liquidatedStatus: 'unliquidated' });
    }
  };

  useEffect(() => {
    if (liquidatedStatus === undefined) {
      setQueryParams({ liquidatedStatus: 'unliquidated' }, 'replaceIn');
    }
  }, [liquidatedStatus, setQueryParams]);

  if (!isAccounting) {
    return <Redirect to="/accounting" />;
  }

  return (
    <Page
      actions={
        <l.AreaLink
          key="vessel-control"
          ml={th.spacing.lg}
          to="/accounting/vessel-control"
        >
          <b.Primary>Vessel Log</b.Primary>
        </l.AreaLink>
      }
      extraPaddingTop={72}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.lg}>
            <l.Div mr={th.spacing.lg}>
              <l.Flex alignCenter justifyBetween mb={th.spacing.sm}>
                <ty.SmallText secondary>Search</ty.SmallText>
                {!loading && (
                  <ty.SmallText secondary>
                    Results: {components ? components.length : '-'}
                  </ty.SmallText>
                )}
              </l.Flex>
              {Search}
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Wire Type:
              </ty.SmallText>
              <TabBar />
            </l.Div>
            <div>
              <l.Div height={24} />
              <ResetButton>
                <l.AreaLink
                  cursor="pointer"
                  height={th.sizes.icon}
                  width={th.sizes.icon}
                  to={`/accounting/wire-control`}
                >
                  <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
                </l.AreaLink>
              </ResetButton>
            </div>
          </l.Flex>
        </>
      }
      noMaxWidth
      title="Wire Control Log"
    >
      {!loading ? (
        <ScrollSync>
          {({ onScroll, scrollLeft }) => (
            <GridWrapper>
              <l.Div overflowX="hidden" width={maxWidth - 16}>
                <l.Grid
                  alignCenter
                  bg={th.colors.background}
                  gridTemplateColumns={gridTemplateColumns(wireControlView)}
                  pb={th.spacing.sm}
                  pl={th.spacing.sm}
                  pt={th.spacing.tn}
                  transform={`translateX(-${scrollLeft || 0}px)`}
                  width={WIRE_CONTROL_LOG_WIDTH(wireControlView) - 8}
                  zIndex={5}
                >
                  {columnLabels.map((label, idx) =>
                    idx === 7 ? (
                      <l.Flex alignCenter key="liq" relative>
                        <l.Div position="absolute" left={`-${th.spacing.md}`}>
                          <LineItemCheckbox
                            checked={liquidatedStatus === 'liquidated'}
                            crossed={liquidatedStatus === 'unliquidated'}
                            onChange={toggleLiquidatedStatus}
                            status="success"
                          />
                        </l.Div>
                        {label}
                      </l.Flex>
                    ) : (
                      label
                    ),
                  )}
                </l.Grid>
              </l.Div>
              <l.Div
                transform={`translateX(-${scrollLeft}px)`}
                zIndex={2}
                relative
                id="vessel-control-portal"
              />
              {!isEmpty(wireControls) ? (
                <VirtualizedGrid
                  columnCount={1}
                  columnWidth={WIRE_CONTROL_LOG_WIDTH(wireControlView)}
                  disableScrollTop
                  height={700}
                  onScroll={onScroll}
                  rowCount={components.length}
                  width={maxWidth}
                  scrollToRow={scrollToRow}
                  recomputeGridSizeOnChange={WIRE_CONTROL_LOG_WIDTH(
                    wireControlView,
                  )}
                  cellRenderer={({ rowIndex, style }) => {
                    const wireControl = components[rowIndex];
                    return (
                      wireControl && (
                        <div
                          key={rowIndex}
                          style={{ ...style, background: th.colors.background }}
                        >
                          <WireControlItem
                            item={wireControl.vesselControl}
                            handleUpdateData={handleUpdateData}
                            listLabels={listLabels(wireControl.wire?.id)}
                          />
                        </div>
                      )
                    );
                  }}
                />
              ) : (
                <l.Div width={maxWidth}>
                  <DataMessage
                    data={wireControls}
                    error={error}
                    loading={loading}
                    emptyProps={{
                      header: 'No wire controls found',
                    }}
                  />
                </l.Div>
              )}
            </GridWrapper>
          )}
        </ScrollSync>
      ) : (
        <l.Div width={maxWidth}>
          <DataMessage
            data={wireControls}
            error={error}
            loading={loading}
            emptyProps={{
              header: 'No vessel controls found',
            }}
          />
        </l.Div>
      )}
    </Page>
  );
};

export default WireControlLog;
