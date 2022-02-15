import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Agenda from 'components/sales/agenda';
import Calendar from 'components/sales/calendar';
import PriceSheet from 'components/sales/price-sheet';
import Inventory from 'components/sales/inventory';
import InventoryItemDetails from 'components/sales/inventory/items/details';
import Pallets from 'components/sales/inventory/pallets';
import PalletDetails from 'components/sales/inventory/pallets/details';
import ShipperProjections from 'components/sales/projections';
import Vessels from 'components/sales/vessels';
import VesselDetails from 'components/sales/vessels/details';
import { IS_PRODUCTION } from 'utils/env';

const Sales = () => (
  <Switch>
    <Route
      exact
      path="/sales/inventory/pallets/:id"
      component={PalletDetails}
    />
    <Route exact path="/sales/inventory/pallets" component={Pallets} />
    <Route
      exact
      path="/sales/inventory/items/:itemId/pallets/:id"
      component={PalletDetails}
    />
    <Route
      exact
      path="/sales/inventory/items/:id"
      component={InventoryItemDetails}
    />
    <Route exact path="/sales/inventory" component={Inventory} />

    <Route
      exact
      path="/sales/vessels/:vesselId/items/:itemId/pallets/:id"
      component={PalletDetails}
    />
    <Route
      exact
      path="/sales/vessels/:vesselId/items/:id"
      component={InventoryItemDetails}
    />
    <Route exact path="/sales/vessels/:id" component={VesselDetails} />
    <Route exact path="/sales/vessels" component={Vessels} />

    <Route exact path="/sales/projections" component={ShipperProjections} />

    <Route exact path="/sales/price-sheet" component={PriceSheet} />
    <Route exact path="/sales/agenda" component={Agenda} />
    <Route exact path="/sales/calendar" component={Calendar} />

    {IS_PRODUCTION ? (
      <Redirect to="/sales/price-sheet" />
    ) : (
      <Redirect to="/sales/inventory?coast=EC" />
    )}
  </Switch>
);

export default Sales;
