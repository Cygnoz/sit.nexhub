import { lazy } from "react";
import { RouteObject } from "react-router-dom";

// Lazy load your components
const Supplier = lazy(() => import("../pages/Supplier"));
const SupplierHome = lazy(() => import("../features/Supplier/SupplierHome/SupplierHome"));
const SeeSupplierDetails = lazy(() => import("../features/Supplier/SupplierHome/ViewSupplier/SeeSupplierDetails"));
const SupplierInfo = lazy(() => import("../features/Supplier/SupplierInfo"));

const SupplierRoutes: RouteObject[] = [
  { path: "/supplier", element: <Supplier /> },
  { path: "/supplier/home", element: <SupplierHome /> },
  { path: "/supplier/view/:id", element: <SeeSupplierDetails /> },
  { path: '/supplier/info', element: <SupplierInfo /> },
];

export default SupplierRoutes;
