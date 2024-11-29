import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import AddExpensePage from "../features/expense/ExpenseHome/AddExpensePage";

// Lazy load your components
const Expense = lazy(() => import("../pages/Expense"));
const ExpenseHome = lazy(() => import("../features/expense/ExpenseHome/ExpenseHome"));
const ExpenseView = lazy(() => import("../features/expense/ExpenseHome/ExpenseView"));

const ExpenseRoutes: RouteObject[] = [
  { path: "/expense", element: <Expense /> },
  { path: "/expense/home", element: <ExpenseHome /> },
  { path: "/expense/view/:id", element: <ExpenseView /> },
  {path:"/expense/add-expense",element:<AddExpensePage/>},
  
  
];

export default ExpenseRoutes;
