import React, { useEffect, useState } from 'react';
import { pluck, times } from 'ramda';
import { Document, Page as PdfPage } from 'react-pdf/dist/esm/entry.webpack';
import { useLocation, useParams } from 'react-router-dom';
import { StringParam } from 'use-query-params';

import api from 'api';
import BaseData from 'components/base-data';
import FeaturedValues, {
  placeholderFeaturedValues,
} from 'components/featured-values';
import ImageList from 'components/reports/inspections/psa-arrival/image-list';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import usePrevious from 'hooks/use-previous';
import { useDateRangeQueryParams, useQuerySet } from 'hooks/use-query-params';
import {
  PsaApplePallet,
  PsaArrivalReport,
  PsaCherryPallet,
  PsaCitrusPallet,
  PsaGrapePallet,
  PsaLemonPallet,
  PsaPearPallet,
  PsaPersimmonPallet,
  PsaPomegranatePallet,
  PsaStoneFruitPallet,
} from 'types';
import { Select } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { InspectionTypes } from '..';
import {
  baseLabels,
  getCommonFeaturedValues,
  getGrapeFeaturedValues,
  getCitrusFeaturedValues,
  getStoneFruitFeaturedValues,
  getPomegranateFeaturedValues,
  getPersimmonFeaturedValues,
  getPearFeaturedValues,
  getLemonFeaturedValues,
  getCherryFeaturedValues,
  getAppleFeaturedValues,
  filterPallets,
  getPallets,
} from './data-utils';
import PsaArrivalPallets from './pallets';

const breadcrumbs = (
  id: string,
  currentPath: string,
  search: string,
  dateParams: string,
) => [
  {
    text: 'All Inspections',
    to: `/reports/inspections/${InspectionTypes.ARRIVAL}${dateParams}`,
  },
  { text: id, to: `${currentPath}${search}` },
];

const tabs: (
  id: string,
  palletCount: string | undefined,
  search: string,
) => Tab[] = (id, palletCount, search) => [
  {
    id: 'report',
    text: 'Report',
  },
  {
    id: 'pallets',
    text: `Pallets${palletCount ? ' (' + palletCount + ')' : ''}`,
  },
];

const Details = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const { pathname, search } = useLocation();
  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const dateParams =
    startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';

  const {
    data: comVarData,
    loading: comVarLoading,
    error: comVarError,
  } = api.usePsaArrivalInspectionComVar(id);
  const previousComVarData = usePrevious(comVarData);

  const {
    data,
    loading: detailsLoading,
    error: detailsError,
  } = api.usePsaArrivalInspection(id);

  const loading = comVarLoading || detailsLoading;
  const error = comVarError || detailsError;

  const [
    {
      commodity,
      variety,
      size,
      growerCode,
      labelCode,
      overallQuality,
      overallCondition,
    },
    setComVarQuery,
  ] = useQuerySet({
    commodity: StringParam,
    variety: StringParam,
    size: StringParam,
    growerCode: StringParam,
    labelCode: StringParam,
    overallQuality: StringParam,
    overallCondition: StringParam,
  });

  const palletFilters = {
    size,
    growerCode,
    labelCode,
    overallQuality,
    overallCondition,
  };

  const pallets = comVarData
    ? filterPallets(getPallets(comVarData), palletFilters)
    : [];

  const palletCount = loading
    ? '-'
    : pathname.includes('pallets')
    ? `${comVarData && variety ? pallets.length : 0}`
    : data
    ? data.palletCount
    : 0;

  const { TabBar, selectedTabId } = useTabBar({
    tabs: tabs(id, palletCount, search),
    isRoute: false,
    defaultTabId: 'report',
    paramName: 'inspectionView',
  });
  const isReport = selectedTabId === 'report';

  const palletIds = comVarData
    ? pluck(
        'palletId',
        filterPallets(
          comVarData.grapePallets.nodes,
          palletFilters,
        ) as PsaGrapePallet[],
      )
        .concat(
          pluck(
            'palletId',
            filterPallets(
              comVarData.citrusPallets.nodes,
              palletFilters,
            ) as PsaCitrusPallet[],
          ),
        )
        .concat(
          pluck(
            'palletId',
            filterPallets(
              comVarData.stoneFruitPallets.nodes,
              palletFilters,
            ) as PsaStoneFruitPallet[],
          ),
        )
        .concat(
          pluck(
            'palletId',
            filterPallets(
              comVarData.pomegranatePallets.nodes,
              palletFilters,
            ) as PsaPomegranatePallet[],
          ),
        )
        .concat(
          pluck(
            'palletId',
            filterPallets(
              comVarData.persimmonPallets.nodes,
              palletFilters,
            ) as PsaPersimmonPallet[],
          ),
        )
        .concat(
          pluck(
            'palletId',
            filterPallets(
              comVarData.pearPallets.nodes,
              palletFilters,
            ) as PsaPearPallet[],
          ),
        )
        .concat(
          pluck(
            'palletId',
            filterPallets(
              comVarData.lemonPallets.nodes,
              palletFilters,
            ) as PsaLemonPallet[],
          ),
        )
        .concat(
          pluck(
            'palletId',
            filterPallets(
              comVarData.cherryPallets.nodes,
              palletFilters,
            ) as PsaCherryPallet[],
          ),
        )
        .concat(
          pluck(
            'palletId',
            filterPallets(
              comVarData.applePallets.nodes,
              palletFilters,
            ) as PsaApplePallet[],
          ),
        )
    : [];

  const { data: picturesData } = api.usePsaArrivalInspectionPictures(
    palletIds as string[],
  );

  const [numPages, setNumPages] = useState(0);

  const getFeaturedValues = () => {
    if (data && comVarData && variety) {
      if (comVarData.grapePallets.totalCount > 0) {
        return getGrapeFeaturedValues(pallets);
      }
      if (comVarData.citrusPallets.totalCount > 0) {
        return getCitrusFeaturedValues(pallets);
      }
      if (comVarData.stoneFruitPallets.totalCount > 0) {
        return getStoneFruitFeaturedValues(pallets);
      }
      if (comVarData.pomegranatePallets.totalCount > 0) {
        return getPomegranateFeaturedValues(pallets);
      }
      if (comVarData.persimmonPallets.totalCount > 0) {
        return getPersimmonFeaturedValues(pallets);
      }
      if (comVarData.pearPallets.totalCount > 0) {
        return getPearFeaturedValues(pallets);
      }
      if (comVarData.lemonPallets.totalCount > 0) {
        return getLemonFeaturedValues(pallets);
      }
      if (comVarData.cherryPallets.totalCount > 0) {
        return getCherryFeaturedValues(pallets);
      }
      if (comVarData.applePallets.totalCount > 0) {
        return getAppleFeaturedValues(pallets);
      }
      return [...getCommonFeaturedValues(pallets)];
    }
    return placeholderFeaturedValues(3);
  };

  const featuredValues = getFeaturedValues();

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    if (!previousComVarData && comVarData && !commodity) {
      setComVarQuery(
        {
          commodity: (comVarData.commodityList as string[])[0],
          variety: (comVarData.varietyList as string[])[0],
        },
        'replaceIn',
      );
    }
  }, [commodity, comVarData, setComVarQuery, previousComVarData, variety]);

  useEffect(() => {
    if (
      comVarData &&
      comVarData.varietyList &&
      comVarData.varietyList.length > 0 &&
      !comVarData.varietyList.includes(variety)
    ) {
      setComVarQuery(
        {
          variety: (comVarData.varietyList as string[])[0],
        },
        'replaceIn',
      );
    }
  }, [comVarData, setComVarQuery, variety]);

  return (
    <Page
      breadcrumbs={breadcrumbs(id, pathname, search, dateParams)}
      title="Arrival Inspection"
    >
      {data ? (
        <l.Flex alignStart flex={1}>
          <l.Div flex={8}>
            <BaseData<PsaArrivalReport> data={data} labels={baseLabels} />
            <l.Div height={th.spacing.lg} />
            <TabBar />
            <l.Div height={th.spacing.lg} />
            {isReport ? (
              <Document
                file={`${api.baseURL}${data.reportUrl}`}
                onLoadSuccess={onLoadSuccess}
              >
                {times(
                  (idx) => (
                    <PdfPage
                      key={idx}
                      pageNumber={idx + 1}
                      height={933}
                      width={721}
                    />
                  ),
                  numPages,
                )}
              </Document>
            ) : (
              <>
                <l.Flex alignCenter mb={th.spacing.lg}>
                  <ty.BodyText mr={th.spacing.md}>Commodity:</ty.BodyText>
                  <Select
                    onChange={(e) => {
                      setComVarQuery({
                        commodity: e.target.value,
                        variety: undefined,
                      });
                    }}
                    value={commodity || ''}
                  >
                    {(comVarData && comVarData.commodityList
                      ? comVarData.commodityList.length > 0
                        ? comVarData.commodityList
                        : ['-']
                      : ['Loading...']
                    ).map((key) => (
                      <option key={key} value={`${key}`}>
                        {key}
                      </option>
                    ))}
                  </Select>
                  <ty.BodyText ml={th.spacing.lg} mr={th.spacing.md}>
                    Variety:
                  </ty.BodyText>
                  <Select
                    onChange={(e) => {
                      setComVarQuery({ variety: e.target.value });
                    }}
                    value={variety || ''}
                  >
                    {(comVarData && comVarData.varietyList
                      ? comVarData.varietyList.length > 0
                        ? comVarData.varietyList
                        : ['-']
                      : ['Loading...']
                    ).map((key) => (
                      <option key={key} value={`${key}`}>
                        {key}
                      </option>
                    ))}
                  </Select>
                </l.Flex>
                {((comVarData &&
                  comVarData.commodityList &&
                  comVarData.commodityList.length > 0) ||
                  loading) && <FeaturedValues values={featuredValues} />}
                <l.Div height={th.spacing.lg} />
                <PsaArrivalPallets
                  inspection={comVarData}
                  loading={comVarLoading}
                  error={comVarError}
                />
              </>
            )}
          </l.Div>
          <l.Div width={th.spacing.lg} />
          <l.Div flex={3}>
            <ImageList
              data={
                picturesData && picturesData.nodes.length > 0
                  ? { pictures: picturesData }
                  : data || { pictures: { nodes: [] } }
              }
            />
          </l.Div>
        </l.Flex>
      ) : (
        <DataMessage
          data={data ? (data as any) || [] : []}
          error={error}
          loading={loading}
        />
      )}
    </Page>
  );
};

export default Details;
