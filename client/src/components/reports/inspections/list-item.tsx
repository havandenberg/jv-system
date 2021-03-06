import React from 'react';
import styled from '@emotion/styled';

import api from 'api';
import Chevron from 'assets/images/chevron';
import { baseDataTransforms } from 'components/base-data';
import { LabelInfo } from 'components/column-label';
import useLightbox from 'hooks/use-lightbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { gridTemplateColumns as defaultGridTemplateColumns } from '.';

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

const ListItem = <T extends { imageUrls?: string[] | null }>({
  data,
  gridTemplateColumns,
  lightboxTitle,
  listLabels,
  slug,
  titleList,
}: {
  data: T;
  gridTemplateColumns?: string;
  lightboxTitle: string;
  listLabels: LabelInfo<T>[];
  slug: string;
  titleList?: string[];
}) => {
  const { Lightbox, openLightbox } = useLightbox(
    data.imageUrls || [],
    lightboxTitle,
    `${api.baseURL}/`,
    titleList,
  );
  return (
    <l.Div mb={th.spacing.sm}>
      <l.AreaLink to={`/reports/inspections/${slug}`}>
        <GridContainer
          gridTemplateColumns={
            gridTemplateColumns || defaultGridTemplateColumns
          }
        >
          {listLabels.map(({ key, getValue, transformKey, transformValue }) => {
            const value = transformKey
              ? baseDataTransforms[transformKey](data[key])
              : getValue
              ? getValue(data)
              : transformValue
              ? transformValue(data[key])
              : data[key];
            return (
              <l.Flex
                alignCenter
                key={`${key}`}
                overflow="hidden"
                p={th.spacing.sm}
              >
                <ty.BodyText>{value}</ty.BodyText>
              </l.Flex>
            );
          })}
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
