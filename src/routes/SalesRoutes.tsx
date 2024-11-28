import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import SalesDashboard from "../features/sales/dashboard/SalesDashboard";
import ViewSales from "../features/sales/commonComponents/ViewSales";

// Lazy load your components
const SalesOrder = lazy(() => import("../features/sales/salesOrder/SalesOrder"));
const NewSalesOrder = lazy(() => import("../features/sales/salesOrder/NewSalesOrder"));
const InvoiceHome = lazy(() => import("../features/sales/invoice/InvoiceHome"));
const NewInvoice = lazy(() => import("../features/sales/invoice/NewInvoice"));
const QuoteHome = lazy(() => import("../features/sales/quote/QuoteHome"));
const NewSalesQuote = lazy(() => import("../features/sales/quote/NewSalesQuote"));
const CreditNote = lazy(() => import("../features/sales/creditNote/CreditNote"));
const NewCreditNote = lazy(() => import("../features/sales/creditNote/NewCreditNote"));
const ViewCreditNote = lazy(() => import("../features/sales/creditNote/viewCreditNote/ViewCreditNote"));
const ReceiptHome = lazy(() => import("../features/sales/Receipt/ReceiptHome"));
const RecieptView = lazy(() => import("../features/sales/Receipt/viewRecipet/RecieptView"));
const NewReceipt = lazy(() => import("../features/sales/Receipt/NewReceipt"));
const SalesInfo = lazy(() => import("../features/sales/SalesInfo"));
const SalesReturn = lazy(() => import("../features/sales/salesReturn/SalesReturn"));
const NewSalesReturn = lazy(() => import("../features/sales/salesReturn/NewSalesReturn"));

const SalesRoutes: RouteObject[] = [
  { path: "/sales", element: <SalesDashboard /> },
  { path: "/sales/salesorder", element: <SalesOrder /> },
  { path: "/sales/viewsalesorder/:id", element: <ViewSales /> },
  { path: "/sales/salesorder/new", element: <NewSalesOrder /> },
  { path: "/sales/invoice", element: <InvoiceHome /> },
  { path: "/sales/invoice/new", element: <NewInvoice /> },
  { path: "/sales/quote", element: <QuoteHome /> },
  { path: "/sales/quote/new", element: <NewSalesQuote /> },
  { path: "/sales/credit-note", element: <CreditNote /> },
  { path: "/sales/credit-note/new", element: <NewCreditNote /> },
  { path: "/sales/credit-note/view", element: <ViewCreditNote /> },
  { path: "/sales/receipt", element: <ReceiptHome /> },
  { path: "/sales/receipt/view/:id", element: <RecieptView /> },
  { path: "/sales/receipt/new", element: <NewReceipt /> },
  { path: "/sales/info", element: <SalesInfo /> },
  { path: "/sales/salesreturn", element: <SalesReturn/> },
  { path: "/sales/newsalesreturn", element: <NewSalesReturn/> },


];

export default SalesRoutes;
