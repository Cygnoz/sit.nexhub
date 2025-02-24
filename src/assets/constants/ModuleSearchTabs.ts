import { endponits } from "../../Services/apiEndpoints";

export const tabsConfig: any = {
    Customer: {
      endpoint: endponits.GET_ALL_CUSTOMER,
      requestKey: "getCustomerRequest",
      searchFields: [
        "customerDisplayName",
        "customerEmail",
        "mobile",
        "companyName",
      ],
      navigatePath: "/customer/view/",
    },
    Inventory: {
      endpoint: endponits.GET_ALL_ITEMS_TABLE,
      requestKey: "getAllItems",
      searchFields: ["itemName", "sku", "itemType"],
      navigatePath: "/inventory/Item",
    },
    "Sales Order": {
      endpoint: endponits.GET_ALL_SALES_ORDER,
      requestKey: "getAllSales",
      searchFields: [
        "salesOrder",
        "customerDisplayName",
        "deliveryMethod",
        "salesOrderDate",
      ],
      navigatePath: "/sales/viewsalesorder/",
    },
    Quote: {
      endpoint: endponits.GET_ALL_QUOTES,
      requestKey: "getAllSales",
      searchFields: [
        "salesQuotes",
        "customerDisplayName",
        "deliveryMethod",
        "salesQuoteDate",
      ],
      navigatePath: "/sales/viewsalesorder/",
    },
    Invoice: {
      endpoint: endponits.GET_ALL_SALES_INVOICE,
      requestKey: "getAllSales",
      searchFields: [
        "salesInvoice",
        "customerDisplayName",
        "deliveryMethod",
        "salesInvoiceDate",
      ],
      navigatePath: "/sales/viewsalesorder/",
    },
    Receipt: {
      endpoint: endponits.GET_ALL_SALES_RECIEPT,
      requestKey: "getAllSales",
      searchFields: [
        "receipt",
        "customerDisplayName",
        "paymentMode",
        "createdDate",
      ],
      navigatePath: "/sales/receipt/view/",
    },
    "Credit Note": {
      endpoint: endponits.GET_ALL_CREDIT_NOTE,
      requestKey: "getAllSales",
      searchFields: [
        "creditNote",
        "customerDisplayName",
        "invoiceType",
        "createdDate",
      ],
      navigatePath: "/sales/viewsalesorder/",
    },
    Accounts: {
      endpoint: endponits.Get_ALL_Acounts,
      requestKey: "getAllAccounts",
      searchFields: ["accountName", "accountHead", "accountCode", "createdDate"],
      navigatePath: "/accountant/view/",
    },
    "Manual Journal": {
      endpoint: endponits.GET_ALL_JOURNALS,
      requestKey: "getAllAccounts",
      searchFields: ["journalId", "reference", "date", "note"],
      navigatePath: "/accountant/manualjournal/view/",
    },
    Supplier: {
      endpoint: endponits.GET_ALL_SUPPLIER,
      requestKey: "getAllSuppliers",
      searchFields: ["supplierDisplayName", "supplierEmail", "mobile"],
      navigatePath: "/supplier/view/",
    },
    "Purchase Order": {
      endpoint: endponits.GET_ALL_PURCHASE_ORDER,
      requestKey: "getAllPurchases",
      searchFields: ["purchaseOrder", "supplierDisplayName", "purchaseOrderDate"],
      navigatePath: "/purchase/purchase-order/view/",
    },
    Bills: {
      endpoint: endponits.GET_ALL_BILLS,
      requestKey: "getAllPurchases",
      searchFields: ["billNumber", "supplierDisplayName", "billDate"],
      navigatePath: "/purchase/bills/view/",
    },
    "Payment Made": {
      endpoint: endponits.GET_PAYMENTMADE,
      requestKey: "getAllPurchases",
      searchFields: ["paymentMade", "supplierDisplayName", "paymentDate"],
      navigatePath: "/purchase/payment-made/view/",
    },
    "Debit Note": {
      endpoint: endponits.GET_ALL_DEBIT_NOTE,
      requestKey: "getAllPurchases",
      searchFields: ["debitNote", "supplierDisplayName", "supplierDebitDate"],
      navigatePath: "/purchase/debit-note/view/",
    },
  };
  