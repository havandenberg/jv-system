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
  paddingBottom: th.spacing.sm,
  paddingLeft: th.spacing.md,
  paddingRight: th.spacing.sm,
  paddingTop: th.spacing.sm,
});

interface Props<T> {
  data: T;
  changes?: T;
  editing?: boolean;
  handleChange?: (field: keyof T, value: any) => void;
  labels: LabelInfo<T>[];
  showValidation?: boolean;
}

const BaseData = <T extends {}>({
  data,
  changes,
  editing,
  handleChange,
  labels,
  showValidation,
}: Props<T>) => (
  <BaseDataContainer>
    {labels.map(
      (
        {
          key,
          getValue,
          label,
          isBoolean,
          transformKey,
          transformValue,
          validate,
        },
        idx,
      ) => {
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
        const isValid = !validate || validate(content.value);
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
                borderColor:
                  showValidation && !isValid
                    ? th.colors.status.error
                    : th.colors.brand.secondary,
                height: th.sizes.icon,
                fontSize: th.fontSizes.body,
                padding: th.spacing.xs,
                width: 175,
              }}
              isBoolean={isBoolean}
              onChange={(e) => {
                handleChange &&
                  handleChange(
                    key,
                    isBoolean ? e.target.checked : e.target.value,
                  );
              }}
            />
          </l.Div>
        );
      },
    )}
  </BaseDataContainer>
);

export default BaseData;
