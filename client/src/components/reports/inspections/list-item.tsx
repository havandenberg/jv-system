import React from 'react';
import styled from '@emotion/styled';

import { API_BASE } from 'api';
import Chevron from 'assets/images/chevron';
import useLightbox from 'hooks/use-lightbox';
import { PeruInspectionReport } from 'components/reports/inspections/types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { gridTemplateColumns } from '.';

interface Column {
  key: keyof PeruInspectionReport;
  label: string;
}

export const columns: Column[] = [
  {
    key: 'inspectionDate',
    label: 'Inspection Date',
  },
  {
    key: 'containerId',
    label: 'Container ID',
  },
  {
    key: 'exporter',
    label: 'Exporter',
  },
  {
    key: 'variety',
    label: 'Variety',
  },
  {
    key: 'qualityScore',
    label: 'Quality',
  },
  {
    key: 'conditionScore',
    label: 'Condition',
  },
];

const GridContainer = styled(l.Grid)({
  background: th.colors.brand.containerBackground,
  border: th.borders.primary,
  borderRadius: th.borderRadii.default,
  height: th.sizes.lg,
  transition: th.transitions.default,
  ':hover': {
    background: th.colors.brand.containerBackgroundAccent,
  },
});

const ListItem = ({ data }: { data: PeruInspectionReport }) => {
  const { Lightbox, openLightbox } = useLightbox(data.imageUrls);
  return (
    <>
      <l.AreaLink to={`/reports/inspections/${data.containerId}`}>
        <GridContainer gridTemplateColumns={gridTemplateColumns}>
          {columns.map(({ key }) => (
            <l.Flex
              alignCenter
              height={th.sizes.fill}
              key={key}
              px={th.spacing.sm}
            >
              <ty.BodyText>{data[key]}</ty.BodyText>
            </l.Flex>
          ))}
          <l.Flex overflow="hidden" px={th.spacing.sm}>
            {data.imageUrls.map((imageUrl, idx) => (
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
                  height={60}
                  py={th.spacing.tn}
                  mr={th.spacing.tn}
                  src={`${API_BASE}${imageUrl}`}
                />
              </l.Div>
            ))}
          </l.Flex>
          <l.Flex centered height={th.sizes.fill}>
            <Chevron height={th.spacing.md} />
          </l.Flex>
        </GridContainer>
      </l.AreaLink>
      <Lightbox />
    </>
  );
};

export default ListItem;
