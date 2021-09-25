import React from 'react';
import styled from '@emotion/styled';
import { CSSProperties } from 'onno';
import { isEmpty } from 'ramda';
import ClipLoader from 'react-spinners/ClipLoader';

import l, { DivProps } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Wrapper = styled(l.Flex)({
  alignItems: 'center',
  background: th.colors.brand.containerBackground,
  border: th.borders.disabled,
  borderRadius: th.borderRadii.default,
  flexDirection: 'column',
  height: 300,
  justifyContent: 'center',
});

interface MessageProps {
  image?: React.ReactNode;
  header?: string;
  headerStyles?: CSSProperties;
  text?: string;
  textStyles?: CSSProperties;
  wrapperStyles?: DivProps;
}

const PageMessage = ({
  image,
  header,
  headerStyles,
  text,
  textStyles,
  wrapperStyles,
}: MessageProps) => (
  <Wrapper {...wrapperStyles}>
    {image && <l.Div mb={th.spacing.lg}>{image}</l.Div>}
    {header && (
      <ty.LargeText mb={text ? th.spacing.lg : 0} secondary {...headerStyles}>
        {header}
      </ty.LargeText>
    )}
    {text && (
      <ty.BodyText secondary {...textStyles}>
        {text}
      </ty.BodyText>
    )}
  </Wrapper>
);

export default PageMessage;

export const Empty = ({ header = 'No data found', ...rest }: MessageProps) => (
  <PageMessage header={header} {...rest} />
);

export const Error = ({
  header = 'An error has occurred ❌',
  ...rest
}: MessageProps) => <PageMessage header={header} {...rest} />;

export const Loading = ({
  text = 'Loading data...',
  ...rest
}: MessageProps) => (
  <PageMessage
    image={<ClipLoader color={th.colors.brand.secondary} size={th.sizes.xl} />}
    text={text}
    {...rest}
  />
);

interface QueryState {
  data: any[];
  error: any;
  loading: boolean;
}

export interface DataMessageProps extends QueryState {
  emptyProps?: MessageProps;
  errorProps?: MessageProps;
  loadingProps?: MessageProps;
}

export const DataMessage = ({
  data,
  emptyProps,
  error,
  errorProps,
  loading,
  loadingProps,
}: DataMessageProps) => {
  if (error) {
    return <Error {...errorProps} />;
  }
  if (loading) {
    return <Loading {...loadingProps} />;
  }
  if (isEmpty(data)) {
    return <Empty {...emptyProps} />;
  }
  return null;
};
