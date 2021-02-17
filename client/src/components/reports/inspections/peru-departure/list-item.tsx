import React from 'react';
import styled from '@emotion/styled';

import api from 'api';
import Chevron from 'assets/images/chevron';
import useLightbox from 'hooks/use-lightbox';
import { PeruDepartureInspection } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { gridTemplateColumns } from '..';
import { listLabels } from './data-utils';

const GridContainer = styled(l.Grid)({
  background: th.colors.brand.containerBackground,
  border: th.borders.disabled,
  borderRadius: th.borderRadii.default,
  paddingLeft: th.spacing.sm,
  transition: th.transitions.default,
  ':hover': {
    background: th.colors.brand.containerBackgroundAccent,
    border: th.borders.secondary,
  },
});

const ListItem = ({ data }: { data: PeruDepartureInspection }) => {
  const { Lightbox, openLightbox } = useLightbox(
    data.imageUrls || [],
    data.containerId,
    `${api.baseURL}/`,
  );
  return (
    <l.Div mb={th.spacing.sm}>
      <l.AreaLink to={`/reports/inspections/${data.containerId}`}>
        <GridContainer gridTemplateColumns={gridTemplateColumns}>
          <l.Flex alignCenter pl={th.spacing.sm}>
            <ty.BodyText>D</ty.BodyText>
          </l.Flex>
          {listLabels.map(({ key }) => (
            <l.Flex alignCenter key={key} p={th.spacing.sm}>
              <ty.BodyText>{data[key]}</ty.BodyText>
            </l.Flex>
          ))}
          <l.Flex overflow="hidden" px={th.spacing.sm}>
            {(data.imageUrls || []).map((imageUrl, idx) => (
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
                  src={`${api.baseURL}/${imageUrl}`}
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
