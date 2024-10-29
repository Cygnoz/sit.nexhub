import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load your components
const BankAccountView = lazy(() => import('../features/accountant/Bank/BankAccountView'));
const BankHome = lazy(() => import('../features/accountant/Bank/BankHome'));
const Cash = lazy(() => import('../features/accountant/Cash/Cash'));
const CashTableView = lazy(() => import('../features/accountant/Cash/CashTableView'));
const ChartOfAccountant = lazy(() => import('../features/accountant/chartOfAccountant/ChartOfAccountant'));
const ManualHome = lazy(() => import('../features/accountant/manualJournel/ManualHome'));
const ManualView = lazy(() => import('../features/accountant/manualJournel/ManualView'));
const NewJournal = lazy(() => import('../features/accountant/manualJournel/newJournal/NewJournal'));
const Accountant = lazy(() => import('../pages/Accountant'));
const AccountantInfo = lazy(() => import('../features/accountant/accountantInfo/AccountantInfo'));
const AccountantView = lazy(() => import('../features/accountant/accountantView/AccountantView'));
const DayBook = lazy(() => import('../features/accountant/DayBook/DayBook'));

const AccountantRoutes: RouteObject[] = [
  { path: "/accountant", element: <Accountant /> },
  { path: "/accountant/cash", element: <Cash /> },
  { path: "/accountant/cashView", element: <CashTableView /> },
  { path: "/accountant/manualjournal", element: <ManualHome /> },
  { path: "/accountant/manualjournal/view/:id", element: <ManualView /> },
  { path: "/accountant/newjournal", element: <NewJournal /> },
  { path: "/accountant/bank", element: <BankHome /> },
  { path: "/accountant/bank/account-view", element: <BankAccountView /> },
  { path: "/accountant/chart-OF-accountant", element: <ChartOfAccountant /> },
  { path: "/accountant/info", element: <AccountantInfo /> },
  { path: "/accountant/view/:id", element: <AccountantView /> },
  { path: "/accountant/daybook", element: <DayBook /> },
];

export default AccountantRoutes;
