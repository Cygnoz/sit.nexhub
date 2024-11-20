import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import ProfitAndLoss from "../features/report_s/ProfitAndLoss";

const Reports = lazy(() => import("../pages/Reports"));
const DayBook = lazy(() => import("../features/accountant/DayBook/DayBook"))

const ReportsRoutes: RouteObject[] = [
    { path: "/reports", element: <Reports /> },
    { path: "/reports/daybook", element: <DayBook /> },
    { path: "/reports/profitandloss", element: <ProfitAndLoss /> },
]

export default ReportsRoutes;
