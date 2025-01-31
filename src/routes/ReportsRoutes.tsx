import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import GroupSummary from "../features/report_s/GroupSummary";

const Reports = lazy(() => import("../pages/Reports"));
const DayBook = lazy(() => import("../features/accountant/DayBook/DayBook"))
const BalanceSheet = lazy(() => import("../features/report_s/BalanceSheet"))
const ProfitAndLoss = lazy(() => import(("../features/report_s/ProfitAndLoss")))
const TradingAccount = lazy(() => import(("../features/report_s/TradingAccount")))
const TrialBalance = lazy(() => import(("../features/report_s/TrialBalance")))

const ReportsRoutes: RouteObject[] = [
    { path: "/reports", element: <Reports /> },
    { path: "/reports/daybook", element: <DayBook /> },
    { path: "/reports/profitandloss", element: <ProfitAndLoss /> },
    { path: "/reports/balanceSheet", element: <BalanceSheet /> },
    { path: "/reports/tradingAccount", element: <TradingAccount /> },
    { path: "/reports/trialBalance", element: <TrialBalance /> },
    { path: "/reports/profitandloss/indirectExpense", element: <GroupSummary/> },

]

export default ReportsRoutes;
