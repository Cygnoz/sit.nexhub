import { useState } from "react";
import exploreTextLight from "../../assets/AppsIcons/app-title.png";
import exploreTextDark from "../../assets/AppsIcons/app-title-lite.png";
import IconGrid from "./LandingIcons/IconGrid";
import invoice from "../../assets/AppsIcons/Invoice.png";
import quotes from "../../assets/AppsIcons/Quote.png";
import reciept from "../../assets/AppsIcons/Reciept.png";
import creditNote from "../../assets/AppsIcons/Credit-note.png";
import salesReturn from "../../assets/AppsIcons/Sales-return.png";
import purchasOrder from "../../assets/AppsIcons/Purchase-order.png";
import bills from "../../assets/AppsIcons/Bills.png";
import PaymentMade from "../../assets/AppsIcons/Payment-made.png";
import debitNote from "../../assets/AppsIcons/Debit-note.png";
import chartOfAcc from "../../assets/AppsIcons/Chart-of-account.png";
import manualJournal from "../../assets/AppsIcons/Manual-Journals.png";
import bank from "../../assets/AppsIcons/Bank.png";
import cash from "../../assets/AppsIcons/Cash.png";
import daybook from "../../assets/AppsIcons/Day-book.png";
import itemTracking from "../../assets/AppsIcons/Item-tracking.png";
import unitofMeasurment from "../../assets/AppsIcons/Unit of Measure.png";
import settings from "../../assets/AppsIcons/Settings.png";
import report from "../../assets/AppsIcons/Report.png";


const iconDataMap: any = {
  All: [
    { icon: invoice, label: "Sales Order", route: "/sales/salesorder", index: 3, subIndex: 1 },
    { icon: quotes, label: "Quotes", route: "/sales/quote", index: 3, subIndex: 2 },
    { icon: invoice, label: "Invoice", route: "/sales/invoice", index: 3, subIndex: 3 },
    { icon: reciept, label: "Receipt", route: "/sales/receipt", index: 3, subIndex: 4 },
    { icon: creditNote, label: "Credit Note", route: "/sales/credit-note", index: 3, subIndex: 7 },
    { icon: salesReturn, label: "Sales Return", route: "/item-tracking", index: 5, subIndex: 2 },
    { icon: purchasOrder, label: "Purchase Order", route: "/purchase/purchase-order", index: 8, subIndex: 1 },
    { icon: bills, label: "Bills", route: "/purchase/bills", index: 8, subIndex: 2 },
    { icon: PaymentMade, label: "Payment Made", route: "/purchase/payment-made", index: 8, subIndex: 3 },
    { icon: debitNote, label: "Debit Note", route: "/purchase/debitnote", index: 8, subIndex: 4 },
    { icon: chartOfAcc, label: "Chart of Account", route: "/accountant/chart-OF-accountant", index: 4, subIndex: 1 },
    { icon: manualJournal, label: "Manual Journals", route: "/accountant/manualjournal", index: 4, subIndex: 2 },
    { icon: bank, label: "Bank", route: "/accountant/bank", index: 4, subIndex: 3 },
    { icon: cash, label: "Cash", route: "/accountant/cash", index: 4, subIndex: 4 },
    { icon: daybook, label: "Day Book", route: "/accountant/daybook", index: 4, subIndex: 5 },
    { icon: invoice, label: "Item", route: "/inventory/Item", index: 1, subIndex: 1 },
    { icon: unitofMeasurment, label: "Unit of Measure", route: "/inventory/unit", index: 1, subIndex: 2 },
    { icon: itemTracking, label: "Item Tracking", route: "/inventory/item-tracking", index: 1, subIndex: 3 },
    { icon: invoice, label: "Customer", route: "/customer/home", index: 2, subIndex: 1 },
    { icon: invoice, label: "Supplier", route: "/supplier/home", index: 5, subIndex: 1 },
    { icon: invoice, label: "Expense", route: "/expense/home", index: 6, subIndex: 1 },
    { icon: settings, label: "Settings", route: "/settings", index: 21, subIndex: 0 },
    { icon: report, label: "Report", route: "/report", index: 22, subIndex: 1 },
  ],
  Sales: [
    { icon: invoice, label: "Sales Order", route: "/sales/salesorder", index: 3, subIndex: 1 },
    { icon: quotes, label: "Quotes", route: "/sales/quote", index: 3, subIndex: 2 },
    { icon: invoice, label: "Invoice", route: "/sales/invoice", index: 3, subIndex: 3 },
    { icon: reciept, label: "Receipt", route: "/sales/receipt", index: 3, subIndex: 4 },
    { icon: creditNote, label: "Credit Note", route: "/sales/credit-note", index: 3, subIndex: 7 },
  ],
  Purchase: [
    { icon: purchasOrder, label: "Purchase Order", route: "/purchase/purchase-order", index: 8, subIndex: 1 },
    { icon: bills, label: "Bills", route: "/purchase/bills", index: 8, subIndex: 2 },
    { icon: PaymentMade, label: "Payment Made", route: "/purchase/payment-made", index: 8, subIndex: 3 },
    { icon: debitNote, label: "Debit Note", route: "/purchase/debitnote", index: 8, subIndex: 4 },
  ],
  Inventory: [
    { icon: invoice, label: "Item", route: "/inventory/Item", index: 1, subIndex: 1 },
    { icon: unitofMeasurment, label: "Unit of Measure", route: "/inventory/unit", index: 1, subIndex: 2 },
    { icon: itemTracking, label: "Item Tracking", route: "/inventory/item-tracking", index: 1, subIndex: 3 },
  ],
  Accounts: [
    { icon: chartOfAcc, label: "Chart of Account", route: "/accountant/chart-OF-accountant", index: 4, subIndex: 1 },
    { icon: manualJournal, label: "Manual Journals", route: "/accountant/manualjournal", index: 4, subIndex: 2 },
    { icon: bank, label: "Bank", route: "/accountant/bank", index: 4, subIndex: 3 },
    { icon: cash, label: "Cash", route: "/accountant/cash", index: 4, subIndex: 4 },
    { icon: daybook, label: "Day Book", route: "/accountant/daybook", index: 4, subIndex: 5 },
  ],
  Settings: [
    { icon: settings, label: "Organization", route: "/settings/organization/profile", index: 0, subIndex: 0 },
    { icon: settings, label: "Taxes & Compliance", route: "/settings/taxes", index: 0, subIndex: 0 },
    { icon: settings, label: "Users & Roles", route: "/settings/users-roles", index: 0, subIndex: 0 },
    { icon: settings, label: "Preferences", route: "/settings/preferences", index: 0, subIndex: 0 },
    { icon: settings, label: "Sales", route: "/settings/sales/salesOrder", index: 0, subIndex: 0 },
    { icon: settings, label: "Purchases", route: "/settings/purchase/puschaseOrder", index: 0, subIndex: 0 },
    { icon: settings, label: "Items", route: "/settings/items/item", index: 0, subIndex: 0 },
    { icon: settings, label: "Online Payments", route: "/settings/online-payments", index: 0, subIndex: 0 },
    { icon: settings, label: "Customization", route: "/settings/customization", index: 0, subIndex: 0 },
    { icon: settings, label: "Reminder & Notification", route: "/settings/reminder-notification", index: 0, subIndex: 0 },
    { icon: settings, label: "Reward Settings", route: "/settings/rewards", index: 0, subIndex: 0 },

  ]
};

type Props = {
  mode?: boolean;
  setMode?:boolean
};

const ViewApps : React.FC<Props> = ({ mode }) => {
  const [selectedTab, setSelectedTab] = useState("All");


  return (
    <>
      <div className="flex items-center justify-center mt-16">
        <img
          src={mode ? exploreTextDark : exploreTextLight}
          className="w-[45%]"
          alt="App Title"
        />
      </div>
      <div className="mt-9 flex justify-center items-center">
        <div className={`flex items-center w-[80%] justify-center gap-4 px-6 py-4 rounded-full 
        shadow-md overflow-x-auto border 
        ${mode ? "bg-[#F3F3F3] border-0" : "bg-[#FFFFFF1A] border-[#73796f]"}`}>

          {["All", "Sales", "Purchase", "Inventory", "Accounts", "Settings"].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex items-center gap-2 px-10 py-2 rounded-full text-base
        ${mode ? (selectedTab === tab ? "bg-white font-semibold" : "") : (selectedTab === tab ? "bg-white font-semibold" : "")}
        ${mode ? (selectedTab === tab ? "text-[#303F58]" : "text-[#303F58]") : (selectedTab === tab ? "text-textColor" : "text-[#F6F6F6]")}
      `}
            >
              <span>{tab}</span>
            </button>
          ))}
        </div>

      </div>
      <div className="mt-9 px-44 h-[100vh]">
        {iconDataMap[selectedTab] ? (
          <IconGrid
            key={selectedTab} // Key added to reset on tab change
            iconData={iconDataMap[selectedTab]}
            mode ={mode}
          />
        ) : (
          <p>Select a category</p>
        )}
      </div>

    </>
  );
};

export default ViewApps;
