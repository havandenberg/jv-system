import React from 'react';
import styled from '@emotion/styled';

import api from 'api';
import Chevron from 'assets/images/chevron';
import useLightbox from 'hooks/use-lightbox';
import { PeruInspectionReport } from 'components/reports/inspections/departure/peru/types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { listLabels } from './data-utils';
import { gridTemplateColumns } from '.';

const GridContainer = styled(l.Grid)({
  background: th.colors.brand.containerBackground,
  border: th.borders.primary,
  borderRadius: th.borderRadii.default,
  paddingLeft: th.spacing.sm,
  transition: th.transitions.default,
  ':hover': {
    background: th.colors.brand.containerBackgroundAccent,
  },
});

const ListItem = ({ data }: { data: PeruInspectionReport }) => {
  const { Lightbox, openLightbox } = useLightbox(
    data.imageUrls,
    data.containerId,
  );
  return (
    <l.Div mb={th.spacing.sm}>
      <l.AreaLink to={`/reports/inspections/${data.containerId}`}>
        <GridContainer gridTemplateColumns={gridTemplateColumns}>
          {listLabels.map(({ key }) => (
            <l.Flex alignCenter key={key} p={th.spacing.sm}>
              <ty.BodyText>{data[key]}</ty.BodyText>
            </l.Flex>
          ))}
          <l.Flex overflow="hidden" px={th.spacing.sm}>
            {data.imageUrls.map((imageUrl, idx) => (
              <l.Flex
                alignCenter
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
              </l.Flex>
            ))}
          </l.Flex>
          <l.Flex centered height={th.sizes.fill}>
            <Chevron height={th.spacing.md} />
          </l.Flex>
        </GridContainer>
      </l.AreaLink>
      <Lightbox />
    </l.Div>
  );
};

export default ListItem;
