import React from 'react';
import { format } from 'date-fns';
import { isEmpty, uniq } from 'ramda';
import { StringParam } from 'use-query-params';

import api from 'api';
import ResetImg from 'assets/images/reset';
import useItemSelector from 'components/item-selector';
import ListItem from 'components/list-item';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { ResetButton } from 'components/inventory/inventory/use-filters';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useQuerySet } from 'hooks/use-query-params';
import { InventoryItem, Shipper, Vessel } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import {
  SalesReportLineItem,
  buildSalesReportLineItem,
  groupInventoryItems,
  listLabels,
} from './data-utils';
import ColorPicker from 'components/color-picker';

const gridTemplateColumns =
  '1fr repeat(3, 60px) repeat(3, 65px) repeat(3, 80px) 60px';

const SalesReports = () => {
  const [{ vesselCode, shipperId }, setParams] = useQuerySet({
    vesselCode: StringParam,
    shipperId: StringParam,
  });
  const { data, loading, error } = api.useSalesReportItemsByVesselShipper(
    vesselCode || '',
    shipperId || '',
  );
  const items = (data ? data.nodes : []) as InventoryItem[];
  const groupedItems = groupInventoryItems(
    items.filter((i) => i.pallets.nodes.length > 0),
  );

  const showReport = !!vesselCode && !!shipperId;

  const columnLabels = useColumns<SalesReportLineItem>(
    'description',
    SORT_ORDER.ASC,
    listLabels(),
  );

  const {
    data: vesselsData,
    loading: vesselsLoading,
    error: vesselsError,
  } = api.useExpensesVessels();
  const vessels = (vesselsData ? vesselsData.nodes : []) as Vessel[];
  const vessel = vessels.find((v) => v.vesselCode === vesselCode);
  const vesselShipperIds = uniq(
    ((vessel?.inventoryItems?.nodes || []) as InventoryItem[]).map(
      (item) => item.shipper?.id,
    ) || [],
  ).filter((s) => !!s);

  const {
    data: shippersData,
    loading: shippersLoading,
    error: shippersError,
  } = api.useShippers('SHIPPER_NAME_ASC');
  const shippers = (shippersData ? shippersData.nodes : []) as Shipper[];
  const shipper = shippers.find((s) => s.id === shipperId);

  const vesselsAndShipperLoading = vesselsLoading || shippersLoading;

  const filteredShippers = vesselCode
    ? shippers.filter((s) => vesselShipperIds.includes(s.id))
    : shippers;

  const filteredVessels =
    vesselCode || !shipperId
      ? vessels
      : vessels.filter((v) =>
          (v.inventoryItems.nodes || []).some(
            (i) => i?.shipper?.id === shipperId,
          ),
        );

  const { ItemSelector: VesselItemSelector } = useItemSelector<Vessel>({
    allItems: (localValue) => {
      const lv = localValue.toLowerCase();
      return filteredVessels.filter(
        (v) =>
          v.vesselCode.toLowerCase().includes(lv) ||
          v.vesselName?.toLowerCase().includes(lv),
      );
    },
    selectItem: (v) => {
      setParams({ vesselCode: v.vesselCode });
    },
    getItemContent: (v) => (
      <ty.CaptionText bold={v.vesselCode === vesselCode} pl={th.spacing.sm}>
        {v.vesselCode} - {v.vesselName}
      </ty.CaptionText>
    ),
    closeOnSelect: true,
    disableSearchQuery: true,
    error: vesselsError,
    errorLabel: 'vessels',
    loading: vesselsLoading,
    nameKey: 'vesselCode',
    onClear: () => {
      setParams({ vesselCode: undefined });
    },
    placeholder: 'Select vessel',
    selectedItem: vesselCode,
    searchParamName: 'vesselSearch',
    searchWidth: 150,
    width: 280,
  });

  const { ItemSelector: ShipperItemSelector } = useItemSelector<Shipper>({
    selectItem: (s) => {
      setParams({ shipperId: s.id });
    },
    allItems: (localValue) => {
      const lv = localValue.toLowerCase();
      return filteredShippers.filter(
        (s) =>
          s.id.toLowerCase().includes(lv) ||
          s.shipperName.toLowerCase().includes(lv),
      );
    },
    closeOnSelect: true,
    disableSearchQuery: true,
    error: shippersError,
    errorLabel: 'shippers',
    getItemContent: (s) => (
      <ty.CaptionText bold={s.id === shipperId} pl={th.spacing.sm}>
        {s.id} - {s.shipperName}
      </ty.CaptionText>
    ),
    loading: shippersLoading,
    nameKey: 'shipperName',
    onClear: () => {
      setParams({ shipperId: undefined });
    },
    placeholder: 'Select shipper',
    selectedItem: shipperId,
    searchParamName: 'shipperSearch',
    searchWidth: 150,
    width: 280,
  });

  return (
    <Page
      extraPaddingTop={95}
      headerChildren={
        <>
          <l.Flex alignStart mb={th.spacing.lg}>
            <l.Div width="35%">
              <ty.SmallText mb={th.spacing.xs} secondary>
                Vessel
              </ty.SmallText>
              <l.Flex alignCenter flex={1} height={42}>
                {VesselItemSelector}
                {vesselsAndShipperLoading && vesselCode ? (
                  <ty.BodyText ml={th.spacing.md} secondary>
                    Loading...
                  </ty.BodyText>
                ) : (
                  <l.Div ml={th.spacing.md}>
                    {vessel ? (
                      <div>
                        <ty.LinkText
                          hover="false"
                          to={`/inventory/vessels/${vesselCode}?isPre=0`}
                        >
                          {vessel.vesselName}
                        </ty.LinkText>
                        <ty.BodyText>
                          Disch:{' '}
                          {format(
                            new Date(vessel.dischargeDate.replace(/-/g, '/')),
                            'M/dd',
                          )}
                        </ty.BodyText>
                      </div>
                    ) : (
                      <ty.BodyText secondary>-</ty.BodyText>
                    )}
                  </l.Div>
                )}
              </l.Flex>
            </l.Div>
            <l.Div ml={th.spacing.md} width="35%">
              <ty.SmallText mb={th.spacing.xs} secondary>
                Shipper
              </ty.SmallText>
              <l.Flex alignCenter flex={1} height={42}>
                {ShipperItemSelector}
                {vesselsAndShipperLoading && shipperId ? (
                  <ty.BodyText ml={th.spacing.md} secondary>
                    Loading...
                  </ty.BodyText>
                ) : (
                  <l.Div ml={th.spacing.md}>
                    {shipper ? (
                      <ty.LinkText
                        hover="false"
                        to={`/directory/shippers/${shipperId}`}
                      >
                        {shipper.shipperName}
                      </ty.LinkText>
                    ) : (
                      <ty.BodyText secondary>-</ty.BodyText>
                    )}
                  </l.Div>
                )}
              </l.Flex>
            </l.Div>
            <div>
              <l.Div height={28} />
              <ResetButton>
                <l.AreaLink
                  cursor="pointer"
                  height={th.sizes.icon}
                  width={th.sizes.icon}
                  to="/reports/sales"
                >
                  <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
                </l.AreaLink>
              </ResetButton>
            </div>
          </l.Flex>
          <l.Grid
            gridTemplateColumns={gridTemplateColumns}
            mb={th.spacing.sm}
            pl={th.spacing.sm}
            relative
          >
            {columnLabels}
          </l.Grid>
        </>
      }
      title="Sales Reports"
    >
      {showReport && !loading && !isEmpty(items) ? (
        Object.keys(groupedItems)
          .sort()
          .map((speciesKey) => {
            const speciesItems = Object.values(groupedItems[speciesKey])
              .map((varietyItems) =>
                Object.values(varietyItems)
                  .map((sizeItems) => Object.values(sizeItems))
                  .flat(),
              )
              .flat();
            const speciesLineItem = buildSalesReportLineItem(speciesItems);
            const species = speciesItems[0]?.product?.species;
            const speciesDescription = (
              <l.Flex alignCenter height={th.sizes.fill}>
                <ColorPicker
                  activeColor={species?.commonSpecies?.uiColor || ''}
                  color={species?.commonSpecies?.uiColor || ''}
                  onChange={() => ({})}
                  readOnly
                  height={12}
                  width={12}
                />
                <ty.BodyText bold ml={10}>
                  {species?.speciesDescription || 'UNK'}
                </ty.BodyText>
              </l.Flex>
            );
            return (
              <>
                <l.Div height={th.spacing.sm} />
                <ListItem<SalesReportLineItem>
                  key={speciesKey}
                  customStyles={{
                    noCellBackground: true,
                    cellWrapper: {
                      borderBottom: th.borders.secondary,
                    },
                  }}
                  data={speciesLineItem}
                  gridTemplateColumns={gridTemplateColumns}
                  hoverable
                  listLabels={listLabels(speciesDescription, true)}
                />
                {Object.keys(groupedItems[speciesKey])
                  .sort()
                  .map((varietyKey) => {
                    const varietyItems = Object.values(
                      groupedItems[speciesKey]?.[varietyKey],
                    )
                      .map((sizeItems) => Object.values(sizeItems))
                      .flat();
                    const varietyLineItem =
                      buildSalesReportLineItem(varietyItems);
                    const variety = varietyItems[0]?.product?.variety;
                    const varietyDescription = (
                      <l.Flex alignCenter height={th.sizes.fill}>
                        <ColorPicker
                          activeColor={variety?.commonVariety?.uiColor || ''}
                          color={variety?.commonVariety?.uiColor || ''}
                          onChange={() => ({})}
                          readOnly
                          height={12}
                          width={12}
                        />
                        <ty.BodyText bold ml={10}>
                          {variety?.varietyDescription || 'UNK'}
                        </ty.BodyText>
                      </l.Flex>
                    );
                    return (
                      <>
                        <ListItem<SalesReportLineItem>
                          key={varietyKey}
                          customStyles={{
                            noCellBackground: true,
                            cellWrapper: {
                              background: th.colors.brand.containerBackground,
                              borderBottom: th.borders.disabled,
                              paddingLeft: th.spacing.md,
                            },
                          }}
                          data={varietyLineItem}
                          gridTemplateColumns={gridTemplateColumns}
                          hoverable
                          listLabels={listLabels(varietyDescription, true)}
                        />
                        {Object.keys(groupedItems[speciesKey]?.[varietyKey])
                          .sort()
                          .map((sizeKey, sizeIndex) => {
                            const sizeItems = Object.values(
                              groupedItems[speciesKey]?.[varietyKey]?.[sizeKey],
                            ).flat();
                            const sizeLineItem =
                              buildSalesReportLineItem(sizeItems);
                            const size = sizeItems[0]?.sizes.nodes?.[0];
                            const packType = sizeItems[0]?.packType;
                            const sizeDescription = (
                              <l.Grid
                                alignCenter
                                gridTemplateColumns="repeat(4, 1fr)"
                                width="80%"
                              >
                                <ty.BodyText>
                                  {size?.combineDescription}
                                </ty.BodyText>
                                <ty.BodyText>
                                  {packType?.packDescription}
                                </ty.BodyText>
                                <ty.BodyText>
                                  {packType?.label?.labelName}
                                </ty.BodyText>
                                <ty.BodyText>
                                  {sizeItems[0]?.plu ? 'PLU' : ''}
                                </ty.BodyText>
                              </l.Grid>
                            );
                            return (
                              <>
                                <ListItem<SalesReportLineItem>
                                  key={sizeKey}
                                  customStyles={{
                                    noCellBackground: true,
                                    cellWrapper: {
                                      background:
                                        sizeIndex % 2 === 0
                                          ? undefined
                                          : th.colors.brand.containerBackground,
                                      paddingLeft: th.spacing.xl,
                                    },
                                  }}
                                  data={sizeLineItem}
                                  gridTemplateColumns={gridTemplateColumns}
                                  hoverable
                                  listLabels={listLabels(sizeDescription)}
                                />
                                {sizeIndex ===
                                  Object.keys(
                                    groupedItems[speciesKey]?.[varietyKey],
                                  ).length -
                                    1 && <l.Div height={th.spacing.md} />}
                              </>
                            );
                          })}
                      </>
                    );
                  })}
              </>
            );
          })
      ) : (
        <DataMessage
          data={showReport ? items : []}
          error={showReport && error}
          loading={showReport && loading}
          emptyProps={{
            header: showReport
              ? 'No inventory items found'
              : 'Select a vessel and shipper',
            text: showReport
              ? 'Modify search parameters to view more results.'
              : undefined,
          }}
        />
      )}
    </Page>
  );
};

export default SalesReports;
