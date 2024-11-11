import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const Reports = lazy(() => import("../pages/Reports"));
const DayBook = lazy(() => import("../features/accountant/DayBook/DayBook"))

const ReportsRoutes: RouteObject[] = [
    { path: "/reports", element: <Reports /> },
    { path: "/reports/daybook", element: <DayBook /> },
]

export default ReportsRoutes;
