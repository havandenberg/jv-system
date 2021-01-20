import React from 'react';
import ScrollUp from 'react-scroll-up';

import UpArrow from 'assets/images/up-arrow';
import th from 'ui/theme';

const ScrollToTop = () => (
  <ScrollUp
    showUnder={64}
    style={{
      color: th.colors.brand.primary,
    }}
  >
    <UpArrow height={th.sizes.sm} />
  </ScrollUp>
);

export default ScrollToTop;
