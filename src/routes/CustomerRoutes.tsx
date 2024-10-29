import { lazy } from "react";
import { RouteObject } from "react-router-dom";

// Lazy load your components
const Customer = lazy(() => import("../pages/Customer"));
const CustomerHome = lazy(() => import("../features/Customer/CustomerHome/CustomerHome"));
const SeeCustomerDetails = lazy(() => import("../features/Customer/CustomerHome/SeeCustomerDetails"));
const SeeCustomerInfo = lazy(() => import("../features/Customer/SeeCustomerInfo"));

const CustomerRoutes: RouteObject[] = [
  { path: "/customer", element: <Customer /> },
  { path: "/customer/home", element: <CustomerHome /> },
  { path: "/customer/view/:id", element: <SeeCustomerDetails /> },
  { path: "/customer/info", element: <SeeCustomerInfo /> },
];

export default CustomerRoutes;
