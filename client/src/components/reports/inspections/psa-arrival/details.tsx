import React, { useEffect, useState } from 'react';
import { pluck, times } from 'ramda';
import { Document, Page as PdfPage } from 'react-pdf/dist/esm/entry.webpack';
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useParams,
} from 'react-router-dom';
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
import b from 'ui/button';
import { Select } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { InspectionTypes } from '..';
import {
  baseLabels,
  commonFeaturedValues,
  getGrapeFeaturedValues,
  getCitrusFeaturedValues,
  getStoneFruitFeaturedValues,
  getPomegranateFeaturedValues,
  getPersimmonFeaturedValues,
  getPearFeaturedValues,
  getLemonFeaturedValues,
  getCherryFeaturedValues,
  getAppleFeaturedValues,
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

const tabs: (id: string, palletCount: string, search: string) => Tab[] = (
  id,
  palletCount,
  search,
) => [
  {
    id: 'report',
    text: 'Report',
    to: `/reports/inspections/arrival/${id}/report${search}`,
  },
  {
    id: 'pallets',
    text: `Pallets (${palletCount})`,
    to: `/reports/inspections/arrival/${id}/pallets${search}`,
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
  const baseUrl = `/reports/inspections/${InspectionTypes.ARRIVAL}/:id`;

  const {
    data: comVarData,
    loading: comVarLoading,
    error: comVarError,
  } = api.usePsaArrivalInspectionComVarList(id);
  const previousComVarData = usePrevious(comVarData);

  const {
    data,
    loading: detailsLoading,
    error: detailsError,
  } = api.usePsaArrivalInspection(id);

  const loading = comVarLoading || detailsLoading;
  const error = comVarError || detailsError;

  const palletIds = comVarData
    ? pluck('palletId', comVarData.grapePallets.nodes as PsaGrapePallet[])
        .concat(
          pluck(
            'palletId',
            comVarData.citrusPallets.nodes as PsaCitrusPallet[],
          ),
        )
        .concat(
          pluck(
            'palletId',
            comVarData.stoneFruitPallets.nodes as PsaStoneFruitPallet[],
          ),
        )
        .concat(
          pluck(
            'palletId',
            comVarData.pomegranatePallets.nodes as PsaPomegranatePallet[],
          ),
        )
        .concat(
          pluck(
            'palletId',
            comVarData.persimmonPallets.nodes as PsaPersimmonPallet[],
          ),
        )
        .concat(
          pluck('palletId', comVarData.pearPallets.nodes as PsaPearPallet[]),
        )
        .concat(
          pluck('palletId', comVarData.lemonPallets.nodes as PsaLemonPallet[]),
        )
        .concat(
          pluck(
            'palletId',
            comVarData.cherryPallets.nodes as PsaCherryPallet[],
          ),
        )
        .concat(
          pluck('palletId', comVarData.applePallets.nodes as PsaApplePallet[]),
        )
    : [];

  const { data: picturesData } = api.usePsaArrivalInspectionPictures(
    palletIds as string[],
  );

  const [{ commodity, variety }, setComVarQuery] = useQuerySet({
    commodity: StringParam,
    variety: StringParam,
  });

  const palletCount = loading
    ? '-'
    : `${
        comVarData && variety
          ? comVarData.grapePallets.totalCount ||
            comVarData.citrusPallets.totalCount ||
            comVarData.stoneFruitPallets.totalCount ||
            comVarData.pomegranatePallets.totalCount ||
            comVarData.persimmonPallets.totalCount ||
            comVarData.pearPallets.totalCount ||
            comVarData.lemonPallets.totalCount ||
            comVarData.cherryPallets.totalCount ||
            comVarData.applePallets.totalCount
          : 0
      }`;

  const { TabBar } = useTabBar(tabs(id, palletCount, search), true);

  const [numPages, setNumPages] = useState(0);

  const getFeaturedValues = () => {
    if (data && comVarData && variety) {
      if (comVarData.grapePallets.totalCount > 0) {
        return getGrapeFeaturedValues(comVarData as PsaArrivalReport);
      }
      if (comVarData.citrusPallets.totalCount > 0) {
        return getCitrusFeaturedValues(comVarData as PsaArrivalReport);
      }
      if (comVarData.stoneFruitPallets.totalCount > 0) {
        return getStoneFruitFeaturedValues(comVarData as PsaArrivalReport);
      }
      if (comVarData.pomegranatePallets.totalCount > 0) {
        return getPomegranateFeaturedValues(comVarData as PsaArrivalReport);
      }
      if (comVarData.persimmonPallets.totalCount > 0) {
        return getPersimmonFeaturedValues(comVarData as PsaArrivalReport);
      }
      if (comVarData.pearPallets.totalCount > 0) {
        return getPearFeaturedValues(comVarData as PsaArrivalReport);
      }
      if (comVarData.lemonPallets.totalCount > 0) {
        return getLemonFeaturedValues(comVarData as PsaArrivalReport);
      }
      if (comVarData.cherryPallets.totalCount > 0) {
        return getCherryFeaturedValues(comVarData as PsaArrivalReport);
      }
      if (comVarData.applePallets.totalCount > 0) {
        return getAppleFeaturedValues(comVarData as PsaArrivalReport);
      }
      return [
        ...commonFeaturedValues(comVarData as PsaArrivalReport),
        ...placeholderFeaturedValues(2),
      ];
    }
    return placeholderFeaturedValues(5);
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
      actions={[
        <b.Primary disabled key={0} mr={th.spacing.sm}>
          View Departure
        </b.Primary>,
        <b.Primary disabled key={1}>
          Compare
        </b.Primary>,
      ]}
      breadcrumbs={breadcrumbs(id, pathname, search, dateParams)}
      title="Arrival Inspection"
    >
      {data ? (
        <l.Flex alignStart flex={1}>
          <l.Div flex={8}>
            <BaseData<PsaArrivalReport> data={data} labels={baseLabels} />
            <l.Flex alignCenter my={th.spacing.lg}>
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
            <TabBar />
            <l.Div height={th.spacing.lg} />
            <Switch>
              <Route
                exact
                path={`${baseUrl}/report`}
                render={() => (
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
                )}
              />
              <Route
                exact
                path={`${baseUrl}/pallets`}
                render={() => <PsaArrivalPallets inspection={data} />}
              />
              <Redirect to={`${baseUrl}/report${search}`} />
            </Switch>
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
