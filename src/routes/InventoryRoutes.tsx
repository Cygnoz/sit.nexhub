  import { RouteObject } from "react-router-dom";
import Inventory from "../pages/Inventory";
import ItemHome from "../features/inventory/Item/ItemHome";
import UnitHome from "../features/inventory/Unit/UnitHome";
import Unitconversion from "../features/inventory/Unit/Unitconversion";
import AddItem from "../features/inventory/Item/AddItem";
import ItemTrackingHome from "../features/inventory/ItemTracking/ItemTrackingHome";

const InventoryRoutes: RouteObject[] = [
  { path: "/inventory", element: <Inventory /> },
  { path: "/inventory/Item", element: <ItemHome /> },
  { path: "/inventory/Item/new", element: <AddItem /> },
  { path: "/inventory/unit", element: <UnitHome /> },
  { path: "/inventory/unit/unit-conversion", element: <Unitconversion /> },
  { path: "/inventory/item-tracking", element: <ItemTrackingHome/> },
];

export default InventoryRoutes;
