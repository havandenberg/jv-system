import React from 'react';

import Chevron from 'assets/images/chevron';
import { baseDataTransforms } from 'components/base-data';
import { LabelInfo } from 'components/column-label';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { gridTemplateColumns as defaultGridTemplateColumns } from '.';

const ListItem = <T extends {}>({
  data,
  gridTemplateColumns,
  listLabels,
  slug,
}: {
  data: T;
  gridTemplateColumns?: string;
  listLabels: LabelInfo<T>[];
  slug: string;
}) => (
  <l.Div mb={th.spacing.sm}>
    <l.AreaLink to={`/reports/inspections/arrival/${slug}`}>
      <l.Cell height={th.sizes.fill}>
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
                  key={`${key}-${idx}`}
                  overflow="hidden"
                  p={th.spacing.sm}
                >
                  <ty.BodyText>{value}</ty.BodyText>
                </l.Flex>
              );
            },
          )}
          <l.Flex centered height={th.sizes.fill}>
            <Chevron height={th.spacing.md} />
          </l.Flex>
        </l.Grid>
      </l.Cell>
    </l.AreaLink>
  </l.Div>
);

export default ListItem;
