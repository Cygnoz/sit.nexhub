import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const Reports = lazy(() => import("../pages/Reports"));
const DayBook = lazy(() => import("../features/accountant/DayBook/DayBook"));
const BalanceSheet = lazy(() => import("../features/report_s/BalanceSheet"));
const ProfitAndLoss = lazy(() => import("../features/report_s/P&L/ProfitAndLoss"));
const TradingAccount = lazy(
  () => import("../features/report_s/TradingAccount/TradingAccount")
);
const TrialBalance = lazy(
  () => import("../features/report_s/TrailBalance/TrialBalance")
);
const Account = lazy(() => import("../features/report_s/TrailBalance/Account"));
const MonthlySummery = lazy(
  () => import("../features/report_s/TrailBalance/MonthlySummery")
);
const Ledger = lazy(() => import("../features/report_s/TrailBalance/Ledger"));
const Stock = lazy(() => import("../features/report_s/TradingAccount/Stock"));
const Accounts = lazy(
  () => import("../features/report_s/TradingAccount/Accounts")
);
const GroupSummary = lazy(
  () => import("../features/report_s/P&L/GroupSummary")
);


const ReportsRoutes: RouteObject[] = [
  { path: "/reports", element: <Reports /> },
  { path: "/reports/daybook", element: <DayBook /> },
  { path: "/reports/profitandloss", element: <ProfitAndLoss /> },
  { path: "/reports/balance-sheet", element: <BalanceSheet /> },
  { path: "/reports/trading-account", element: <TradingAccount /> },
  { path: "/reports/trialBalance", element: <TrialBalance /> },
  { path: "/reports/profitandloss/groupsummary/:accountSubhead", element: <GroupSummary /> },
  { path: "/reports/trialBalance/:accountSubHead", element: <Account /> },
  {
    path: "/reports/trialBalance/:accountSubHead/monthly-summery",
    element: <MonthlySummery />,
  },
  {
    path: "/reports/trialBalance/:accountSubHead/monthly-summery/ledger",
    element: <Ledger />,
  },
  { path: "/reports/trading-account/:accountName", element: <Stock /> },
  {
    path: "/reports/trading-account/accounts/:accountSubhead",
    element: <Accounts />,
  },
  {
    path: "/reports/trading-account/:accountSubHead/monthly-summery",
    element: <MonthlySummery />,
  },
  {
    path: "/reports/trading-account/:accountSubHead/monthly-summery/ledger",
    element: <Ledger />,
    
  },
  { path: "/reports/balance-sheet/accounts/:accountSubhead", element: <Accounts /> },
  { path: "/reports/balance-sheet/:accountSubhead/monthly-summery", element: <MonthlySummery /> },

  {
    path: "/reports/balance-sheet/:accountSubHead/monthly-summery/ledger",
    element: <Ledger />,
    
  },
  {
    path: "/reports/profitandloss/groupsummary/account/:accountSubhead",
    element: <MonthlySummery />,
  },
  {
    path: "/reports/profitandloss/:accountSubHead/monthly-summery/ledger",
    element: <Ledger />,
  },
];

export default ReportsRoutes;
