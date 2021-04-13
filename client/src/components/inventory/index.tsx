import React from 'react';
import { Route } from 'react-router-dom';

import PriceSheet from 'components/inventory/price-sheet';

const Inventory = () => (
  <Route path="/inventory/price-sheet" component={PriceSheet} />
);

export default Inventory;
