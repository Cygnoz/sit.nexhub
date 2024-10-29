import { lazy } from "react";
import { RouteObject } from "react-router-dom";

// Lazy load your components
const Inventory = lazy(() => import("../pages/Inventory"));
const ItemHome = lazy(() => import("../features/inventory/Item/ItemHome"));
const UnitHome = lazy(() => import("../features/inventory/Unit/UnitHome"));
const Unitconversion = lazy(() => import("../features/inventory/Unit/Unitconversion"));
const AddItem = lazy(() => import("../features/inventory/Item/AddItem"));
const ItemTrackingHome = lazy(() => import("../features/inventory/ItemTracking/ItemTrackingHome"));

const InventoryRoutes: RouteObject[] = [
  { path: "/inventory", element: <Inventory /> },
  { path: "/inventory/item", element: <ItemHome /> },
  { path: "/inventory/item/new", element: <AddItem /> },
  { path: "/inventory/unit", element: <UnitHome /> },
  { path: "/inventory/unit/unit-conversion", element: <Unitconversion /> },
  { path: "/inventory/item-tracking", element: <ItemTrackingHome /> },
 
];

export default InventoryRoutes;
