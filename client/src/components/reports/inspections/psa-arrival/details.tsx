import React, { useState } from 'react';
import { pluck, times } from 'ramda';
import { Document, Page as PdfPage } from 'react-pdf/dist/esm/entry.webpack';
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useParams,
} from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import useLightbox from 'hooks/use-lightbox';
import { PsaArrivalPicture, PsaArrivalReport } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { InspectionTypes } from '..';
import { baseLabels, getFeaturedValues } from './data-utils';
import PsaArrivalPallets from './pallets';
import FeaturedValue from 'components/featured-value';

const breadcrumbs = (id: string, currentPath: string) => [
  {
    text: 'All Inspections',
    to: `/reports/inspections/${InspectionTypes.ARRIVAL}`,
  },
  { text: id, to: currentPath },
];

const tabs: (id: string) => Tab[] = (id) => [
  {
    id: 'report',
    text: 'Report',
    to: `/reports/inspections/arrival/${id}`,
  },
  {
    id: 'pallets',
    text: 'Pallets',
    to: `/reports/inspections/arrival/${id}/pallets`,
  },
];

const Details = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const { pathname } = useLocation();
  const baseUrl = `/reports/inspections/${InspectionTypes.ARRIVAL}/:id`;
  const { data, error, loading } = api.usePsaArrivalInspection(id);
  const imageUrls = data
    ? pluck('imageUrl', data.pictures.nodes as PsaArrivalPicture[]) || []
    : [];
  const titleList = data
    ? (data.pictures.nodes as PsaArrivalPicture[]).map(
        (picture) => `${picture.pictureDescription}`,
      )
    : undefined;

  const { Lightbox, openLightbox } = useLightbox(
    imageUrls,
    '',
    `${api.baseURL}/`,
    titleList,
  );
  const { TabBar } = useTabBar(tabs(id), true);

  const [numPages, setNumPages] = useState(0);

  const featuredValues = data
    ? getFeaturedValues(data as PsaArrivalReport)
    : [];

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

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
      breadcrumbs={breadcrumbs(id, pathname)}
      title="Arrival Inspection"
    >
      {data ? (
        <l.Flex alignStart flex={1}>
          <l.Div flex={8}>
            <BaseData<PsaArrivalReport> data={data} labels={baseLabels} />
            <l.Flex justifyBetween my={th.spacing.lg} width={th.sizes.fill}>
              {featuredValues.map((value, idx) => (
                <React.Fragment key={idx}>
                  <FeaturedValue {...value} />
                  {idx < featuredValues.length - 1 && (
                    <l.Div width={th.spacing.md} />
                  )}
                </React.Fragment>
              ))}
            </l.Flex>
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
              <Redirect to={`${baseUrl}/report`} />
            </Switch>
          </l.Div>
          <l.Div width={th.spacing.lg} />
          <l.Div flex={3}>
            <ty.CaptionText mb={th.spacing.md} secondary>
              Images ({imageUrls.length})
            </ty.CaptionText>
            <l.Flex column pr={th.spacing.tn}>
              {imageUrls.map((imageUrl: string, idx: number) => (
                <l.Div
                  cursor="pointer"
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openLightbox(idx);
                  }}
                >
                  <l.Img
                    width={th.sizes.fill}
                    py={th.spacing.tn}
                    mr={th.spacing.tn}
                    src={`${api.baseURL}/${imageUrl}`}
                  />
                </l.Div>
              ))}
            </l.Flex>
          </l.Div>
        </l.Flex>
      ) : (
        <DataMessage
          data={data ? (data as any[]) || [] : []}
          error={error}
          loading={loading}
        />
      )}
      <Lightbox />
    </Page>
  );
};

export default Details;
