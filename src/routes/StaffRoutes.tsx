import { lazy } from "react";
import { RouteObject } from "react-router-dom";

// Lazy load your components
const Staffs = lazy(() => import("../pages/Staffs"));
const StaffHome = lazy(() => import("../features/staffs/StaffHome"));
const StaffsOverview = lazy(() => import("../features/staffs/staffsView/StaffsOverview"));

const StaffRoutes: RouteObject[] = [
  { path: "/staffs", element: <Staffs /> },
  { path: "/staffs/home", element: <StaffHome /> },
  { path: "/staffs/view", element: <StaffsOverview /> },
];

export default StaffRoutes;
