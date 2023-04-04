import React from 'react';
import { Slide } from 'yet-another-react-lightbox/*';

import Chevron from 'assets/images/chevron';
import { baseDataTransforms } from 'components/base-data';
import { LabelInfo } from 'components/column-label';
import useLightbox from 'hooks/use-lightbox';
import { useDateRangeQueryParams } from 'hooks/use-query-params';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { gridTemplateColumns as defaultGridTemplateColumns } from '.';

const ListItem = <T extends {}>({
  data,
  gridTemplateColumns,
  listLabels,
  slides,
  slug,
}: {
  data: T;
  gridTemplateColumns?: string;
  listLabels: LabelInfo<T>[];
  slides: Slide[];
  slug: string;
}) => {
  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const dateParams =
    startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';

  const { Lightbox, openLightbox } = useLightbox(slides);

  return (
    <l.Div mb={th.spacing.sm}>
      <l.AreaLink to={`/reports/inspections/${slug}${dateParams}`}>
        <l.Cell>
          <l.Grid
            gridTemplateColumns={
              gridTemplateColumns || defaultGridTemplateColumns
            }
          >
            {listLabels.map(
              ({ key, getValue, transformKey, transformValue }, idx) => {
                const value =
                  (transformKey
                    ? baseDataTransforms[transformKey](data[key])
                    : getValue
                    ? getValue(data)
                    : transformValue
                    ? transformValue(data[key])
                    : data[key]) || '-';
                return (
                  <l.Flex
                    alignCenter
                    key={`${String(key)}-${idx}`}
                    overflow="hidden"
                    px={th.spacing.sm}
                    py={th.spacing.xs}
                  >
                    <ty.BodyText>{value}</ty.BodyText>
                  </l.Flex>
                );
              },
            )}
            <l.Flex overflow="hidden" px={th.spacing.sm}>
              {slides.map(({ src }, idx) => (
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
                    src={src}
                  />
                </l.Flex>
              ))}
            </l.Flex>
            <l.Flex centered height={th.sizes.fill}>
              <Chevron height={th.spacing.md} />
            </l.Flex>
          </l.Grid>
        </l.Cell>
      </l.AreaLink>
      <Lightbox />
    </l.Div>
  );
};

export default ListItem;
