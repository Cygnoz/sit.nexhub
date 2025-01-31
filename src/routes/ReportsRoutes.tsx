import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const Reports = lazy(() => import("../pages/Reports"));
const DayBook = lazy(() => import("../features/accountant/DayBook/DayBook"))
const BalanceSheet = lazy(() => import("../features/report_s/BalanceSheet"))
const ProfitAndLoss = lazy(() => import(("../features/report_s/ProfitAndLoss")))
const TradingAccount = lazy(() => import(("../features/report_s/TradingAccount")))
const TrialBalance = lazy(() => import(("../features/report_s/TrailBalance/TrialBalance")))
const Account = lazy(() => import(("../features/report_s/TrailBalance/Account")))
const MonthlySummery = lazy(() => import(("../features/report_s/TrailBalance/MonthlySummery")))
const Ledger = lazy(() => import(("../features/report_s/TrailBalance/Ledger")))


const ReportsRoutes: RouteObject[] = [
    { path: "/reports", element: <Reports /> },
    { path: "/reports/daybook", element: <DayBook /> },
    { path: "/reports/profitandloss", element: <ProfitAndLoss /> },
    { path: "/reports/balanceSheet", element: <BalanceSheet /> },
    { path: "/reports/tradingAccount", element: <TradingAccount /> },
    { path: "/reports/trialBalance", element: <TrialBalance /> },
    { path: "/reports/trialBalance/:accountSubHead", element: <Account  /> },
    { path: "/reports/trialBalance/:accountSubHead/monthly-summery", element: <MonthlySummery  /> },
    { path: "/reports/trialBalance/:accountSubHead/monthly-summery/ledger", element: <Ledger  /> }


]

export default ReportsRoutes;
