import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Inventory from 'components/inventory/inventory';
import InventoryItemDetails from 'components/inventory/inventory/items/details';
import Orders from 'components/inventory/orders';
import OrderDetails from 'components/inventory/orders/details';
import OrderEntryDetails from 'components/inventory/orders/entry/details';
import CreateOrder from 'components/inventory/orders/entry';
import LoadNumberManager from 'components/inventory/orders/load-number-manager';
import Repacks from 'components/inventory/repacks';
import RepackDetails from 'components/inventory/repacks/details';
import RepackQueue from 'components/inventory/repacks/queue';
import TruckLoads from 'components/inventory/truck-loads';
import TruckRates from 'components/inventory/truck-loads/rates';
import TruckRateDetails from 'components/inventory/truck-loads/rates/details';
import TruckLoadDetails from 'components/inventory/truck-loads/details';
import Pallets from 'components/inventory/inventory/pallets';
import PalletDetails from 'components/inventory/inventory/pallets/details';
import Products from 'components/inventory/products';
import CommonCategoryDetails from 'components/inventory/products/category/details';
import CreateCommonCategory from 'components/inventory/products/category/create';
import CommonPackTypeDetails from 'components/inventory/products/pack-type/details';
import CreateCommonPackType from 'components/inventory/products/pack-type/create';
import CommonSpeciesDetails from 'components/inventory/products/species/details';
import CreateCommonSpecies from 'components/inventory/products/species/create';
import CommonSizeDetails from 'components/inventory/products/size/details';
import CreateCommonSize from 'components/inventory/products/size/create';
import CommonVarietyDetails from 'components/inventory/products/variety/details';
import CreateCommonVariety from 'components/inventory/products/variety/create';
import Vessels from 'components/inventory/vessels';
import CreateVessel from 'components/inventory/vessels/create';
import VesselDetails from 'components/inventory/vessels/details';
import VesselSchedule from 'components/inventory/vessels/schedule';
import Containers from 'components/inventory/containers';
import ContainerDetails from 'components/inventory/containers/details';
import ContainerSchedule from 'components/inventory/containers/schedule';
import ContainerBulkEdit from './containers/bulk-edit';

const InventoryTab = () => (
  <Switch>
    <Route
      exact
      path="/inventory/pallets/:palletId"
      component={PalletDetails}
    />
    <Route exact path="/inventory/pallets" component={Pallets} />
    <Route
      exact
      path="/inventory/items/:itemId/pallets/:palletId"
      component={PalletDetails}
    />
    <Route exact path="/inventory/items/:id" component={InventoryItemDetails} />

    <Route exact path="/inventory/orders/create" component={CreateOrder} />
    <Route
      path="/inventory/orders/load-numbers"
      component={LoadNumberManager}
    />
    <Route exact path="/inventory/orders/:id/edit" component={CreateOrder} />
    <Route exact path="/inventory/orders/:id/review" component={CreateOrder} />
    <Route
      exact
      path="/inventory/orders/:orderId/entry/:entryId"
      component={OrderEntryDetails}
    />
    <Route exact path="/inventory/orders/:id" component={OrderDetails} />
    <Route exact path="/inventory/orders" component={Orders} />

    <Route exact path="/inventory/repacks/queue" component={RepackQueue} />
    <Route exact path="/inventory/repacks/:id" component={RepackDetails} />
    <Route exact path="/inventory/repacks" component={Repacks} />

    <Route
      exact
      path="/inventory/truck-loads/rates/:id"
      component={TruckRateDetails}
    />
    <Route exact path="/inventory/truck-loads/rates" component={TruckRates} />
    <Route
      exact
      path="/inventory/truck-loads/:id"
      component={TruckLoadDetails}
    />
    <Route exact path="/inventory/truck-loads" component={TruckLoads} />

    <Route
      exact
      path="/inventory/vessels/:vesselId/items/:itemId/pallets/:palletId"
      component={PalletDetails}
    />
    <Route
      exact
      path="/inventory/vessels/:vesselId/items/:id"
      component={InventoryItemDetails}
    />
    <Route exact path="/inventory/vessels/create" component={CreateVessel} />
    <Route
      exact
      path="/inventory/vessels/schedule"
      component={VesselSchedule}
    />
    <Route exact path="/inventory/vessels/:id" component={VesselDetails} />
    <Route exact path="/inventory/vessels" component={Vessels} />

    <Route
      exact
      path="/inventory/containers/schedule"
      component={ContainerSchedule}
    />
    <Route
      exact
      path="/inventory/containers/bulk-edit"
      component={ContainerBulkEdit}
    />
    <Route
      exact
      path="/inventory/containers/:containerId"
      component={ContainerDetails}
    />
    <Route exact path="/inventory/containers" component={Containers} />

    <Route exact path="/inventory/products" component={Products} />
    <Route
      exact
      path="/inventory/products/categories/create"
      component={CreateCommonCategory}
    />
    <Route
      exact
      path="/inventory/products/categories/:categoryId"
      component={CommonCategoryDetails}
    />
    <Route
      exact
      path="/inventory/products/create"
      component={CreateCommonSpecies}
    />
    <Route
      exact
      path="/inventory/products/categories/:categoryId/create"
      component={CreateCommonSpecies}
    />
    <Route
      exact
      path="/inventory/products/:speciesId/:routeTabId?"
      component={CommonSpeciesDetails}
    />
    <Route
      exact
      path="/inventory/products/:speciesId/varieties/create"
      component={CreateCommonVariety}
    />
    <Route
      exact
      path="/inventory/products/:speciesId/varieties/:varietyId"
      component={CommonVarietyDetails}
    />
    <Route
      exact
      path="/inventory/products/:speciesId/sizes/create"
      component={CreateCommonSize}
    />
    <Route
      exact
      path="/inventory/products/:speciesId/sizes/:sizeId"
      component={CommonSizeDetails}
    />
    <Route
      exact
      path="/inventory/products/:speciesId/pack-types/create"
      component={CreateCommonPackType}
    />
    <Route
      exact
      path="/inventory/products/:speciesId/pack-types/:packTypeId"
      component={CommonPackTypeDetails}
    />

    <Route exact path="/inventory/index" component={Inventory} />

    <Redirect to="/inventory/index" />
  </Switch>
);

export default InventoryTab;
