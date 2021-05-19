import React from 'react';
import styled from '@emotion/styled';

import { LabelInfo } from 'components/column-label';
import EditableCell from 'components/editable-cell';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatPhoneNumber } from 'utils/format';

export const baseDataTransforms = {
  link: (val: any) => (
    <l.Anchor href={val} target="_blank">
      {val}
    </l.Anchor>
  ),
  phone: (val: any) => (
    <l.Anchor href={`tel:${val}`}>{formatPhoneNumber(val)}</l.Anchor>
  ),
  email: (val: any) => <l.Anchor href={`mailto:${val}`}>{val}</l.Anchor>,
};

const BaseDataContainer = styled(l.Grid)({
  background: th.colors.brand.containerBackground,
  border: th.borders.primary,
  borderRadius: th.borderRadii.default,
  gridTemplateColumns: 'repeat(5, 1fr)',
  paddingLeft: th.spacing.md,
  paddingRight: th.spacing.sm,
  paddingTop: th.spacing.sm,
});

interface Props<T> {
  data: T;
  changes?: T;
  editing?: boolean;
  handleChange?: (field: keyof T, value: any) => void;
  validate?: () => boolean;
  labels: LabelInfo<T>[];
}

const BaseData = <T extends {}>({
  data,
  changes,
  editing,
  handleChange,
  labels,
}: Props<T>) => (
  <BaseDataContainer>
    {labels.map(
      ({ key, getValue, label, transformKey, transformValue }, idx) => {
        const content = changes
          ? {
              dirty: changes[key] !== data[key],
              value: `${
                changes[key] === undefined
                  ? data[key] || ''
                  : changes[key] || data[key] || ''
              }`,
            }
          : { dirty: false, value: `${data[key]}` };
        const value = transformKey
          ? baseDataTransforms[transformKey](data[key])
          : getValue
          ? getValue(data)
          : transformValue
          ? transformValue(data[key])
          : data[key];
        return (
          <l.Div
            height={th.sizes.fill}
            key={idx}
            pb={th.spacing.md}
            pr={th.spacing.sm}
            pt={th.spacing.sm}
          >
            <ty.CaptionText mb={th.spacing.sm} secondary>
              {label}
            </ty.CaptionText>
            <EditableCell
              content={content}
              defaultChildren={<ty.BodyText>{value}</ty.BodyText>}
              editing={!!editing}
              inputProps={{
                borderRadius: th.borderRadii.default,
                padding: th.spacing.xs,
                width: 150,
              }}
              onChange={(e) => {
                handleChange && handleChange(key, e.target.value);
              }}
            />
          </l.Div>
        );
      },
    )}
  </BaseDataContainer>
);

export default BaseData;
