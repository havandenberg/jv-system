import * as React from 'react';
import { Global } from '@emotion/react';
import { Theme, globalStyle } from 'onno-react';

import th from './theme';

const theme: Theme = {
  globalStyles: th.globalStyles,
};

const GlobalStyles = () => <Global styles={globalStyle({ theme })} />;

export default GlobalStyles;
