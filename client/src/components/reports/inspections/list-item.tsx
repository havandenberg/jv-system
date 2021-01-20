import React from 'react';
import styled from '@emotion/styled';

import api from 'api';
import Chevron from 'assets/images/chevron';
import useLightbox from 'hooks/use-lightbox';
import { PeruInspectionReport } from 'components/reports/inspections/types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { listLabels } from './data-utils';
import { gridTemplateColumns } from '.';

const GridContainer = styled(l.Grid)({
  background: th.colors.brand.containerBackground,
  border: th.borders.primary,
  borderRadius: th.borderRadii.default,
  height: th.sizes.lg,
  paddingLeft: th.spacing.sm,
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
          {listLabels.map(({ key }) => (
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
                  src={`${api.baseURL}${imageUrl}`}
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
