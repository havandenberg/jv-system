import React from 'react';
import styled from '@emotion/styled';
import ClipLoader from 'react-spinners/ClipLoader';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Wrapper = styled(l.Flex)({
  alignItems: 'center',
  flexDirection: 'column',
  height: 250,
  justifyContent: 'center',
  width: th.sizes.fill,
});

const Loading = ({ text = 'Loading data...' }: { text?: string }) => (
  <Wrapper>
    <ClipLoader color={th.colors.brand.secondary} size={th.sizes.xl} />
    {text && (
      <ty.BodyText mt={th.spacing.lg} secondary>
        {text}
      </ty.BodyText>
    )}
  </Wrapper>
);

export default Loading;
