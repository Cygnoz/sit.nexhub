import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import SalesDashboard from "../features/sales/dashboard/SalesDashboard";

// Lazy load your components
const SalesOrder = lazy(() => import("../features/sales/salesOrder/SalesOrder"));
const ViewSalesOrder = lazy(() => import("../features/sales/salesOrder/viewSalesQuote/ViewSalesOrder"));
const NewSalesOrder = lazy(() => import("../features/sales/salesOrder/NewSalesOrder"));
const InvoiceHome = lazy(() => import("../features/sales/invoice/InvoiceHome"));
const NewInvoice = lazy(() => import("../features/sales/invoice/NewInvoice"));
// const ViewInvoice = lazy(() => import("../features/sales/invoice/ViewInvoice"));
// const ViewSalesInvoice = lazy(() => import("../features/sales/invoice/viewInvoice/ViewSalesInvoice"))
const QuoteHome = lazy(() => import("../features/sales/quote/QuoteHome"));
const ViewSalesQuote = lazy(() => import("../features/sales/quote/viewSalesQuote/ViewSalesQuote"));
const NewSalesQuote = lazy(() => import("../features/sales/quote/NewSalesQuote"));
const CreditNote = lazy(() => import("../features/sales/creditNote/CreditNote"));
const NewCreditNote = lazy(() => import("../features/sales/creditNote/NewCreditNote"));
const ViewCreditNote = lazy(() => import("../features/sales/creditNote/viewCreditNote/ViewCreditNote"));
const ReceiptHome = lazy(() => import("../features/sales/Receipt/ReceiptHome"));
const ReceiptView = lazy(() => import("../features/sales/Receipt/ReceiptView"));
const NewReceipt = lazy(() => import("../features/sales/Receipt/NewReceipt"));
const SalesInfo = lazy(() => import("../features/sales/SalesInfo"));

const SalesRoutes: RouteObject[] = [
  { path: "/sales", element: <SalesDashboard /> },
  { path: "/sales/salesorder", element: <SalesOrder /> },
  { path: "/sales/viewsalesorder/:id", element: <ViewSalesOrder /> },
  { path: "/sales/salesorder/new", element: <NewSalesOrder /> },
  { path: "/sales/invoice", element: <InvoiceHome /> },
  { path: "/sales/invoice/new", element: <NewInvoice /> },
  // { path: "/sales/invoice/view", element: <ViewInvoice /> },
  { path: "/sales/quote", element: <QuoteHome /> },
  { path: "/sales/quote/view/:id", element: <ViewSalesQuote /> },
  // { path: "/sales/invoice/view/:id", element: <ViewSalesInvoice /> },
  { path: "/sales/quote/new", element: <NewSalesQuote /> },
  { path: "/sales/credit-note", element: <CreditNote /> },
  { path: "/sales/credit-note/new", element: <NewCreditNote /> },
  { path: "/sales/credit-note/view", element: <ViewCreditNote /> },
  { path: "/sales/receipt", element: <ReceiptHome /> },
  { path: "/sales/receipt/view", element: <ReceiptView /> },
  { path: "/sales/receipt/new", element: <NewReceipt /> },
  { path: "/sales/info", element: <SalesInfo /> },
];

export default SalesRoutes;
