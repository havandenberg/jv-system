import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Agenda from 'components/sales/agenda';
import Calendar from 'components/sales/calendar';
import PriceSheet from 'components/sales/price-sheet';
import Inventory from 'components/sales/inventory';
import InventoryItemDetails from 'components/sales/inventory/items/details';
import Pallets from 'components/sales/inventory/pallets';
import PalletDetails from 'components/sales/inventory/pallets/details';
import Products from 'components/sales/products';
import ShipperProjections from 'components/sales/projections';
import Vessels from 'components/sales/vessels';
import VesselDetails from 'components/sales/vessels/details';

import CreateCommonCategory from './products/category/create';
import CommonCategoryDetails from './products/category/details';
import CommonPackTypeDetails from './products/pack-type/details';
import CreateCommonPackType from './products/pack-type/create';
import CreateCommonSpecies from './products/species/create';
import CommonSpeciesDetails from './products/species/details';
import CreateCommonSize from './products/size/create';
import CommonSizeDetails from './products/size/details';
import CreateCommonVariety from './products/variety/create';
import CommonVarietyDetails from './products/variety/details';
import Programs from './programs';
import CreateVessel from './vessels/create';

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
    <Route exact path="/sales/vessels/create" component={CreateVessel} />
    <Route exact path="/sales/vessels/:id" component={VesselDetails} />
    <Route exact path="/sales/vessels" component={Vessels} />

    <Route exact path="/sales/projections" component={ShipperProjections} />

    <Route exact path="/sales/products" component={Products} />
    <Route
      exact
      path="/sales/products/categories/create"
      component={CreateCommonCategory}
    />
    <Route
      exact
      path="/sales/products/categories/:categoryId"
      component={CommonCategoryDetails}
    />
    <Route
      exact
      path="/sales/products/create"
      component={CreateCommonSpecies}
    />
    <Route
      exact
      path="/sales/products/categories/:categoryId/create"
      component={CreateCommonSpecies}
    />
    <Route
      exact
      path="/sales/products/:speciesId/:routeTabId?"
      component={CommonSpeciesDetails}
    />
    <Route
      exact
      path="/sales/products/:speciesId/varieties/create"
      component={CreateCommonVariety}
    />
    <Route
      exact
      path="/sales/products/:speciesId/varieties/:varietyId"
      component={CommonVarietyDetails}
    />
    <Route
      exact
      path="/sales/products/:speciesId/sizes/create"
      component={CreateCommonSize}
    />
    <Route
      exact
      path="/sales/products/:speciesId/sizes/:sizeId"
      component={CommonSizeDetails}
    />
    <Route
      exact
      path="/sales/products/:speciesId/packTypes/create"
      component={CreateCommonPackType}
    />
    <Route
      exact
      path="/sales/products/:speciesId/packTypes/:packTypeId"
      component={CommonPackTypeDetails}
    />

    <Route exact path="/sales/programs" component={Programs} />

    <Route exact path="/sales/price-sheet" component={PriceSheet} />
    <Route exact path="/sales/agenda" component={Agenda} />
    <Route exact path="/sales/calendar" component={Calendar} />

    <Redirect to="/sales/inventory" />
  </Switch>
);

export default Sales;
