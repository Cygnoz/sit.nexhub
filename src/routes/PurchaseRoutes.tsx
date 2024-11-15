import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Purchaseview from "../features/purchase/CommonComponents/PurchaseTable/Purchaseview";

// Lazy load your components
const Purchase = lazy(() => import("../pages/Purchase"));
const BillsHomes = lazy(() => import("../features/purchase/bills/BillsHomes"));
const NewBills = lazy(() => import("../features/purchase/bills/NewBills"));
const DebitNote = lazy(() => import("../features/purchase/debitNote/DebitNote"));
const NewDebitNote = lazy(() => import("../features/purchase/debitNote/NewDebitNote"));
const ViewDebitNote = lazy(() => import("../features/purchase/debitNote/viewDebitNote/ViewDebitNote"));
const PaymentMade = lazy(() => import("../features/purchase/paymentMade/PaymentMade"));
const PaymentView = lazy(() => import("../features/purchase/paymentMade/PaymentView/PaymentView"));
const PurchaseOrder = lazy(() => import("../features/purchase/purchaseOrder/PurchaseOrder"));
const NewPurchaseOrder = lazy(() => import("../features/purchase/purchaseOrder/addPurchaseOrder/NewPurchaseOrder"));
const AddPaymentMade = lazy(() => import("../features/purchase/paymentMade/addPaymentMade/AddPaymentMade"));

const PurchaseRoutes: RouteObject[] = [
  { path: "/purchase", element: <Purchase /> },
  { path: "/purchase/bills", element: <BillsHomes /> },
  { path: "/purchase/bills/new", element: <NewBills /> },
  // { path: "/purchase/bills/view", element: <ViewBills /> },
  { path: "/purchase/debitnote", element: <DebitNote /> },
  { path: "/purchase/debit-note/new", element: <NewDebitNote /> },
  { path: "/purchase/viewdebitnote", element: <ViewDebitNote /> },
  { path: "/purchase/payment-made", element: <PaymentMade /> },
  { path: "/purchase/payment-made/view", element: <PaymentView /> },
  { path: "/purchase/purchase-order", element: <PurchaseOrder /> },
  { path: "/purchase/purchase-order/new", element: <NewPurchaseOrder /> },
  { path: "/purchase/purchase-order/view/:id", element: <Purchaseview page="PurchaseOrder" /> },
  { path: "/purchase/bills/view/:id", element: <Purchaseview page="Bills" /> },
  { path: "/purchase/debit-note/view/:id", element: <Purchaseview page="DebitNote" /> },

  { path: "/purchase/payment-made/new-payment-made", element: <AddPaymentMade /> },
];

export default PurchaseRoutes;
