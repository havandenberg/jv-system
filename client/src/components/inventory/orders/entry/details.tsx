import React, { Fragment } from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { CommonSpecies, OrderEntry, OrderEntryItem } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { gridTemplateColumns } from '.';
import { baseLabels, itemListLabels } from './data-utils';

export const breadcrumbs = (orderId: string, entryId: string) => [
  {
    text: 'Orders',
    to: `/inventory/orders`,
  },
  {
    text: 'Order',
    to: `/inventory/orders/${orderId}?orderView=orderEntries`,
  },
  {
    text: 'Entry',
    to: `/inventory/orders/${orderId}/entry/${entryId}`,
  },
];

const tabs: (itemCount: number) => Tab[] = (itemCount) => [
  {
    id: 'orderItems',
    text: `Items${itemCount ? ' (' + itemCount + ')' : ''}`,
  },
];

const Details = () => {
  const { orderId, entryId } = useParams<{
    entryId: string;
    orderId: string;
  }>();

  const { data: productsData } = api.useCommonSpecieses();
  const commonSpecieses = (productsData?.nodes || []) as CommonSpecies[];

  const { data, loading, error } = api.useOrderEntry(orderId);
  const orderEntries = (data ? data.nodes : []) as OrderEntry[];
  const latestOrderEntry = orderEntries[orderEntries.length - 1];
  const orderEntry = entryId
    ? orderEntries.find((entry) => entry && entry.id === entryId)
    : latestOrderEntry;
  const isLatestEntry = latestOrderEntry?.id === orderEntry?.id;

  const allItems = (orderEntry?.orderEntryItems?.nodes ||
    []) as OrderEntryItem[];

  const { TabBar } = useTabBar(tabs(allItems.length));

  const columnLabels = useColumns<OrderEntryItem>(
    'species',
    SORT_ORDER.ASC,
    itemListLabels(false),
    'operations',
    'order_entry_item',
  );

  return (
    <Page
      actions={[
        !isLatestEntry && (
          <l.AreaLink
            key={0}
            to={`/inventory/orders/${orderId}/entry/${latestOrderEntry.id}`}
          >
            <b.Primary>Show Latest</b.Primary>
          </l.AreaLink>
        ),
      ]}
      breadcrumbs={breadcrumbs(orderId, entryId)}
      title={orderEntries.length > 0 ? 'Order Entry' : 'Loading...'}
    >
      {orderEntries.length > 0 ? (
        <l.Div pb={th.spacing.xl}>
          {orderEntry && (
            <>
              <ty.CaptionText
                color={isLatestEntry ? undefined : th.colors.status.error}
                italic
                mb={th.spacing.md}
                secondary={isLatestEntry}
              >
                Viewing {isLatestEntry ? 'latest' : 'previous'} entry:
              </ty.CaptionText>
              <BaseData<OrderEntry> data={orderEntry} labels={baseLabels} />
            </>
          )}
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
          </l.Flex>
          <l.Grid
            gridTemplateColumns={gridTemplateColumns(false)}
            gridColumnGap={th.spacing.xs}
            mb={th.spacing.sm}
            mt={th.spacing.lg}
            // pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
          >
            {columnLabels}
          </l.Grid>
          {allItems.map((item, idx) => {
            const commonSpecies = commonSpecieses.find(
              (s) => s.productSpeciesId === item.species,
            );
            const commonVariety =
              commonSpecies &&
              (commonSpecies.commonVarieties.nodes || []).find(
                (v) => v && v.productVarietyId === item.variety,
              );
            const commonSize =
              commonSpecies &&
              (commonSpecies.commonSizes.nodes || []).find(
                (s) => s && s.productSizeId === item.size,
              );
            const commonPackType =
              commonSpecies &&
              (commonSpecies.commonPackTypes.nodes || []).find(
                (p) => p && [p.id, p.packMasterId].includes(item.packType),
              );
            const reviewCommonSpecies = commonSpecieses.find(
              (s) => s.productSpeciesId === item.reviewSpecies,
            );
            const reviewCommonVariety =
              commonSpecies &&
              (commonSpecies.commonVarieties.nodes || []).find(
                (v) => v && v.productVarietyId === item.reviewVariety,
              );
            const reviewCommonSize =
              commonSpecies &&
              (commonSpecies.commonSizes.nodes || []).find(
                (s) => s && s.productSizeId === item.reviewSize,
              );
            const reviewCommonPackType =
              commonSpecies &&
              (commonSpecies.commonPackTypes.nodes || []).find(
                (p) => p && p.packMasterId === item.reviewPackType,
              );

            const isReviewSpeciesDirty = item.reviewSpecies !== item.species;
            const isReviewVarietyDirty = item.reviewVariety !== item.variety;
            const isReviewSizeDirty = item.reviewSize !== item.size;
            const isReviewPackTypeDirty = item.reviewPackType !== item.packType;
            const isReviewShipperDirty =
              item.reviewShipperId !== item.shipperId;
            const isReviewLocationDirty =
              item.reviewLocationId !== item.locationId;
            const isReviewVesselDirty =
              item.reviewVesselCode !== item.vesselCode;
            const isReviewPluDirty = item.reviewPlu !== item.plu;
            const isReviewLabelDirty = item.reviewLabel !== item.label;
            const isReviewCountryDirty =
              item.reviewCountryOfOrigin !== item.countryOfOrigin;

            const isReviewDirty =
              isReviewSpeciesDirty ||
              isReviewVarietyDirty ||
              isReviewSizeDirty ||
              isReviewPackTypeDirty ||
              isReviewShipperDirty ||
              isReviewLocationDirty ||
              isReviewVesselDirty ||
              isReviewPluDirty ||
              isReviewLabelDirty ||
              isReviewCountryDirty;

            return (
              <Fragment key={item.id}>
                <l.Grid
                  alignCenter
                  background={
                    idx % 2 === 0
                      ? th.colors.brand.containerBackground
                      : undefined
                  }
                  borderLeft={th.borders.disabled}
                  borderRight={th.borders.disabled}
                  borderTop={idx === 0 ? th.borders.disabled : 0}
                  borderBottom={isReviewDirty ? 0 : th.borders.disabled}
                  gridColumnGap={th.spacing.xs}
                  gridTemplateColumns={gridTemplateColumns(false)}
                  py={th.spacing.xs}
                  relative
                >
                  <ty.CaptionText ellipsis pl={th.spacing.sm}>
                    {item.lineId}
                  </ty.CaptionText>
                  <ty.CaptionText ellipsis pl={th.spacing.sm}>
                    {commonSpecies ? commonSpecies.speciesName : item.species}
                  </ty.CaptionText>
                  <ty.CaptionText
                    ellipsis
                    pl={th.spacing.sm}
                    secondary={item.variety === 'Any'}
                  >
                    {commonVariety ? commonVariety.varietyName : item.variety}
                  </ty.CaptionText>
                  <ty.CaptionText
                    ellipsis
                    pl={th.spacing.sm}
                    secondary={item.size === 'Any'}
                  >
                    {commonSize ? commonSize.sizeName : item.size}
                  </ty.CaptionText>
                  <ty.CaptionText
                    ellipsis
                    pl={th.spacing.sm}
                    secondary={item.packType === 'Any'}
                  >
                    {commonPackType
                      ? commonPackType.packTypeName
                      : item.packType}
                  </ty.CaptionText>
                  <ty.CaptionText
                    ellipsis
                    pl={th.spacing.sm}
                    secondary={item.plu === 'Any'}
                  >
                    {item.plu}
                  </ty.CaptionText>
                  <ty.CaptionText
                    ellipsis
                    pl={th.spacing.sm}
                    secondary={item.countryOfOrigin === 'Any'}
                  >
                    {item.countryOfOrigin}
                  </ty.CaptionText>
                  <ty.CaptionText
                    ellipsis
                    pl={th.spacing.sm}
                    secondary={item.label === 'Any'}
                  >
                    {item.label}
                  </ty.CaptionText>
                  {item.warehouse ? (
                    <ty.LinkText
                      ellipsis
                      hover="false"
                      pl={th.spacing.sm}
                      to={`/directory/warehouses/${item.locationId}`}
                    >
                      {item.warehouse.warehouseName}
                    </ty.LinkText>
                  ) : (
                    <ty.CaptionText
                      ellipsis
                      pl={th.spacing.sm}
                      secondary={item.locationId === 'Any'}
                    >
                      {item.locationId}
                    </ty.CaptionText>
                  )}
                  {item.shipper ? (
                    <ty.LinkText
                      ellipsis
                      hover="false"
                      pl={th.spacing.sm}
                      to={`/directory/shippers/${item.shipperId}`}
                    >
                      {item.shipper.shipperName}
                    </ty.LinkText>
                  ) : (
                    <ty.CaptionText
                      ellipsis
                      pl={th.spacing.sm}
                      secondary={item.shipperId === 'Any'}
                    >
                      {item.shipperId}
                    </ty.CaptionText>
                  )}
                  {item.vessel ? (
                    <ty.LinkText
                      ellipsis
                      hover="false"
                      pl={th.spacing.sm}
                      to={`/inventory/vessels/${item.vessel.vesselCode}`}
                    >
                      {item.vessel.vesselCode}
                    </ty.LinkText>
                  ) : (
                    <ty.CaptionText
                      ellipsis
                      hover="false"
                      pl={th.spacing.sm}
                      secondary={item.vesselCode === 'Any'}
                    >
                      {item.vesselCode}
                    </ty.CaptionText>
                  )}
                  <ty.CaptionText ellipsis pl={th.spacing.sm}>
                    {item.palletCount}
                  </ty.CaptionText>
                  <l.Flex alignCenter>
                    <ty.CaptionText mr={th.spacing.xs} pl={th.spacing.sm}>
                      $
                    </ty.CaptionText>
                    <ty.CaptionText>{item.unitSellPrice}</ty.CaptionText>
                  </l.Flex>
                  <l.Flex alignCenter>
                    <ty.CaptionText mr={th.spacing.xs}>$</ty.CaptionText>
                    <ty.CaptionText>{item.deliveryCharge}</ty.CaptionText>
                  </l.Flex>
                </l.Grid>
                {orderEntry?.reviewUserCode && isReviewDirty && (
                  <l.Grid
                    alignCenter
                    background={
                      idx % 2 === 0
                        ? th.colors.brand.containerBackground
                        : undefined
                    }
                    borderLeft={th.borders.disabled}
                    borderRight={th.borders.disabled}
                    borderBottom={th.borders.disabled}
                    gridColumnGap={th.spacing.xs}
                    gridTemplateColumns={gridTemplateColumns(false)}
                    py={th.spacing.xs}
                    relative
                  >
                    <div />
                    <ty.CaptionText ellipsis pl={th.spacing.sm}>
                      {isReviewSpeciesDirty
                        ? reviewCommonSpecies
                          ? reviewCommonSpecies.speciesName
                          : item.reviewSpecies
                        : '-'}
                    </ty.CaptionText>
                    <ty.CaptionText
                      ellipsis
                      pl={th.spacing.sm}
                      secondary={item.reviewVariety === 'Any'}
                    >
                      {isReviewVarietyDirty
                        ? reviewCommonVariety
                          ? reviewCommonVariety.varietyName
                          : item.reviewVariety
                        : '-'}
                    </ty.CaptionText>
                    <ty.CaptionText
                      ellipsis
                      pl={th.spacing.sm}
                      secondary={item.reviewSize === 'Any'}
                    >
                      {isReviewSizeDirty
                        ? reviewCommonSize
                          ? reviewCommonSize.sizeName
                          : item.reviewSize
                        : '-'}
                    </ty.CaptionText>
                    <ty.CaptionText
                      ellipsis
                      pl={th.spacing.sm}
                      secondary={item.reviewPackType === 'Any'}
                    >
                      {isReviewPackTypeDirty
                        ? reviewCommonPackType
                          ? reviewCommonPackType.packTypeName
                          : item.reviewPackType
                        : '-'}
                    </ty.CaptionText>
                    <ty.CaptionText
                      ellipsis
                      pl={th.spacing.sm}
                      secondary={item.reviewPlu === 'Any'}
                    >
                      {isReviewPluDirty ? item.reviewPlu : '-'}
                    </ty.CaptionText>
                    <ty.CaptionText
                      ellipsis
                      pl={th.spacing.sm}
                      secondary={item.reviewCountryOfOrigin === 'Any'}
                    >
                      {isReviewCountryDirty ? item.reviewCountryOfOrigin : '-'}
                    </ty.CaptionText>
                    <ty.CaptionText
                      ellipsis
                      pl={th.spacing.sm}
                      secondary={item.reviewLabel === 'Any'}
                    >
                      {isReviewLabelDirty ? item.reviewLabel : '-'}
                    </ty.CaptionText>
                    {item.reviewWarehouse && isReviewLocationDirty ? (
                      <ty.LinkText
                        ellipsis
                        hover="false"
                        pl={th.spacing.sm}
                        to={`/directory/warehouses/${item.reviewLocationId}`}
                      >
                        {item.reviewWarehouse.warehouseName}
                      </ty.LinkText>
                    ) : (
                      <ty.CaptionText
                        ellipsis
                        pl={th.spacing.sm}
                        secondary={item.reviewLocationId === 'Any'}
                      >
                        {isReviewLocationDirty ? item.reviewLocationId : '-'}
                      </ty.CaptionText>
                    )}
                    {item.reviewShipper && isReviewShipperDirty ? (
                      <ty.LinkText
                        ellipsis
                        hover="false"
                        pl={th.spacing.sm}
                        to={`/directory/shippers/${item.reviewShipperId}`}
                      >
                        {item.reviewShipper.shipperName}
                      </ty.LinkText>
                    ) : (
                      <ty.CaptionText
                        ellipsis
                        pl={th.spacing.sm}
                        secondary={item.reviewShipperId === 'Any'}
                      >
                        {isReviewShipperDirty ? item.reviewShipperId : '-'}
                      </ty.CaptionText>
                    )}
                    {item.reviewVessel && isReviewVesselDirty ? (
                      <ty.LinkText
                        ellipsis
                        hover="false"
                        pl={th.spacing.sm}
                        to={`/inventory/vessels/${item.reviewVessel.vesselCode}`}
                      >
                        {item.reviewVessel.vesselCode}
                      </ty.LinkText>
                    ) : (
                      <ty.CaptionText
                        ellipsis
                        pl={th.spacing.sm}
                        secondary={item.reviewVesselCode === 'Any'}
                      >
                        {isReviewVesselDirty ? item.reviewVesselCode : '-'}
                      </ty.CaptionText>
                    )}
                  </l.Grid>
                )}
              </Fragment>
            );
          })}
        </l.Div>
      ) : (
        <DataMessage data={orderEntries} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
