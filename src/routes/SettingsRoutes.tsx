import { RouteObject } from "react-router-dom";
import Settings from "../pages/Settings";
import Currencies from "../features/settings/organisation/Currencies/Currencies";
import ExchangeRates from "../features/settings/organisation/Currencies/ExchangeRates";
import CreateOrganizationForm from "../features/settings/organisation/CreateOrganizationFrom";
import InvoiceSettings from "../features/settings/organisation/InvoiceSettings/InvoiceSettings";
import Taxes from "../features/settings/taxes/Taxes";
import GSTComponent from "../features/settings/taxes/gst/GSTComponent";
import VATComponent from "../features/settings/taxes/vat/VATComponent";
import Shipments from "../features/settings/sales/shipments/Shipments";
import DeliveryChallans from "../features/settings/sales/deliveryChallans/DeliveryChallans";
import Items from "../features/settings/items/Items";
import Rewards from "../features/settings/rewards/Rewards";
import RefferAndEarn from "../features/settings/rewards/RefferAndEarn";
import MembershipCard from "../features/settings/rewards/MembershipCard";
import Invoices from "../features/settings/sales/invoice/Invoices";
import SalesOrder from "../features/settings/sales/salesOrder/SalesOrder";
import CreditNotes from "../features/settings/sales/creditnote/CreditNotes";
import ExpensesHome from "../features/settings/Purcahse/Expense/ExpensesHome";
import PurchaseOrders from "../features/settings/Purcahse/PuchaseOrder";
import MsmeSettings from "../features/settings/taxes/msmeSettings/MsmeSettings";
import TransactionNumber from "../features/settings/customization/TransactionNumber";
import CustomerAndSupplier from "../features/settings/Preferences/CustomerAndSupplier";
import AccountsSettings from "../features/settings/organisation/Accounts/AccountsSettings";

// Define Routes
const SettingsRoutes: RouteObject[] = [
  { path: "/settings", element: <Settings /> },
  {
    path: "/settings/organization/profile",
    element: <CreateOrganizationForm />,
  },
  {
    path: "/settings/organization/accounts",
    element: <AccountsSettings />,
  },
  { path: "/settings/organization/invoice", element: <InvoiceSettings /> },
  { path: "/settings/organization/currencies", element: <Currencies /> },
  {
    path: "/settings/currencies/exchange-rates/:_id",
    element: <ExchangeRates />,
  },
  { path: "/settings/taxes", element: <Taxes /> },
  { path: "/settings/taxes/GST", element: <GSTComponent /> },
  { path: "/settings/taxes/VAT", element: <VATComponent /> },
  { path: "/settings/taxes/msme", element: <MsmeSettings /> },
  { path: "/settings/sales/invoices", element: <Invoices /> },
  { path: "/settings/sales/shipments", element: <Shipments /> },
  { path: "/settings/sales/deliverychallans", element: <DeliveryChallans /> },
  { path: "/settings/items/item", element: <Items /> },
  { path: "/settings/rewards", element: <Rewards /> },
  { path: "/settings/rewards/refferandearn", element: <RefferAndEarn /> },
  { path: "/settings/rewards/membershipcard", element: <MembershipCard /> },
  { path: "/settings/sales/salesOrder", element: <SalesOrder /> },
  { path: "/settings/sales/CreditNotes", element: <CreditNotes /> },
  { path: "/settings/purchases/expenses", element: <ExpensesHome /> },
  { path: "/settings/purchase/puschaseOrder", element: <PurchaseOrders /> },
  {
    path: "/settings/transaction-number-series",
    element: <TransactionNumber />,
  },
  {
    path: "/settings/preferences/CustomerAndSupplier",
    element: <CustomerAndSupplier />,
  },
];

export default SettingsRoutes;
