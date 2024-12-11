export const endponits = {
  // Settings
  GET_ADDITIONAL_DATA: `get-additional-data`,
  CREATE_ORGANIZATION: `setup-organization`,
  GET_ONE_ORGANIZATION: `get-one-organization`,
  GET_COUNTRY_DATA: `get-countries-data`,
  GET_CURRENCY_LIST: `get-currency`,

  //Sales
  ADD_SALES_SETTINGS: `add-sales-settings`,
  ADD_SALES_INVOICE_SETTINGS: "add-salesInvoice-settings",
  ADD_SALES_DELIVARY_CHALLANS: "add-deliveryChellans",
  GET_PREFIX: "get-prefix",
  ADD_PREFIX: "add-prefix",
  EDIT_PREFIX: "edit-prefix",
  STATUS_PREFIX: "status-prefix",
  DELETE_PREFIX:"prefix",
  ADD_SALES_QUOTE: "add-sales-quotes",
  GET_LAST_SALES_QUOTE_PREFIX: "get-last-sales-quotes-prefix",
  GET_ALL_QUOTES: "get-all-sales-quotes",
  GET_ONE_QUOTES: "get-one-sales-quotes",
  GET_ONE_SALES_ORDER: "get-one-sales-order",

  //sales order
  GET_LAST_SALES_ORDER_PREFIX: "get-last-sales-order-prefix",
  ADD_SALES_ORDER: "add-sales-order",
  //invoice
  GET_INVOICE_PREFIX:"sales-invoice-prefix",
  ADD_SALES_INVOICE:"sales-invoice",
  GET_ALL_SALES_INVOICE:"sales-invoice",
  GET_ONE_INVOICE:"sales-order",
  GET_ONE_JOURNAL_INVOICE:"invoice-journal",
  //sales reciept
  ADD_SALES_RECIEPT:"sales-receipt",
  GET_ALL_SALES_RECIEPT:"get-all-receipt",
  GET_ONE_SALES_RECIEPT:"get-receipt",
  //getall-item-sales
  GET_ALL_ITEMS_SALES: "get-all-item-xs",
  GET_ALL_ITEMS_TABLE:"get-all-item-m",
  //sales order
  GET_ALL_SALES_ORDER: "get-all-sales-order",

  // Organisation Invoices
  ADD_INVOICE_SETTINGS: "add-invoice-settings",
  GET_SETTINGS: "get-settings",
  ADD_PAYMENT_TERMS: `add-payment-terms`,
  EDIT_PAYMENT_TERMS: `edit-payment-terms/:id`,
  DELETE_PAYMENT_TERMS: `delete-payment-terms`,
  GET_PAYMENT_TERMS: `get-all-payment-terms`,

  // Accounts > setting
  ADD_DEFUALT_ACCOUNT: `add-default-account`,
  GET_DEFUALT_ACCOUNT: `get-default-account`,

  // items settings
  ADD_ITEMS: `add-item-settings`,

  // Prefreance settings
  Customer_Supplier_prefreance: "update-supplier-customer-settings",

  // get settingsData
  GET_SETTINGS_DATA: `get-settings`,

  //Add Item Inventory
  ADD_ITEM: "add-item",
  GET_ALL_ITEM: "get-all-item",
  UPDATE_ITEM: "edit-item",
  GET_ALL_ITEMS_Dropdown: `get-itemDropdown`,

  // Accountant
  Get_ALL_Acounts: "get-all-account",
  Get_LAST_Journel_Prefix: "get-last-journal-prefix",
  Add_NEW_Journel: "add-journal-entry",
  GET_ALL_JOURNALS: "get-all-journal",
  GET_ONE_JOURNAL: "get-one-journal",
  Add_NEW_ACCOUNT: "add-account",
  GET_ONE_TRIAL_BALANCE: "get-one-trial-balance",

  // Customer
  GET_ALL_CUSTOMER: "get-all-customer",
  ADD_CUSTOMER: "add-customer",
  GET_TAX: `customer-additional-data`,
  GET_ONE_CUSTOMER: `/get-one-customer`,
  EDIT_CUSTOMER: `edit-customer`,
  UPDATE_CUSTOMER_STATUS: `update-customer-status`,
  GET_CUSTOMER_HISTORY: `get-one-customer-history`,
  GET_CUSTOMER_TRANSACTIONS: `get-Customer-Trandactions`,

  // Supplier
  ADD_SUPPLIER: "add-suppliers",
  GET_ALL_SUPPLIER: "get-all-supplier",
  GET_ONE_SUPPLIER: "get-supplier",
  EDIT_SUPPLIER: "update-supplier",
  GET_TAX_SUPPLIER: `supplier-additional-data`,
  UPDATE_SUPPLIER_STATUS: `update-supplier-status`,
  GET_ONE_SUPPLIER_HISTORY: `get-one-supplier-history`,

  //Currency
  GET_CURRENCIES: "get-currency",
  ADD_CURRENCIES: "add-currency",
  DELETE_CURRENCIES: (id: string) => `delete-currency/${id}`,
  EDIT_CURRENCIES: `edit-currency`,
  GET_ONE_CURRENCY: (id: string) => `/view-currency/${id}`,

  // Inventory
  GET_INVENTORY_DASHBOARD: `/get-inventory-Dashboard`,

  // Item Tracking
  GET_ALL_ITEM_TRANKING: `get-all-item-track`,

  // Settings/Taxes
  // Gst
  GET_ALL_TAX: "get-tax",
  ADD_NEW_TAX: "add-tax",
  UPDATE_TAX_VAT: `edit-tax`,

  //Purchase Order Settings
  ADD_PURCHASE_ORDER_SETTINGS: "add-purchase-settings",

  //Get All Items
  GET_ALL_ITEMS: "get-itemDropdown",

  // settings > slaes > creditNote
  ADD_CREDIT_NOTE_SETTINGS: `add-creditNote-settings`,

  // Inventory
  GET_ALL_BRMC: `get-all-bmcr`,
  ADD_BRMC: `add-bmcr`,
  UPDATE_BRMC: `update-bmcr`,
  DELETE_BRMC: `delete-bmcr`,
  GET_ONE_BRMC: `get-a-bmcr`,
  ADD_UNIT: `add-unit`,
  GET_ALL_UNIT: `get-all-unit`,
  UPDATE_UNIT: `edit-unit`,
  DELETE_UNIT: `delete-unit`,
  GET_ONE_UNIT: `/get-one-unit`,

  // PURCHASE

  // bill
  ADD_BILL: `/add-Bills`,
  GET_ALL_BILLS: `/get-all-Bills`,
  GET_A_BILL:`get-a-Bill`,

  // Purchase order
  ADD_PURCHASE_ORDER: `add-purchaseOrder`,
  GET_LAST_PURCHASE_ORDER_PREFIX: `get-last-purchase-order-prefix`,
  GET_ALL_PURCHASE_ORDER: `get-all-purchaseOrders`,
  GET_ONE_PURCHASE_ORDER: `get-purchaseOrder`,

  // Payment Made
  ADD_PAYMET_MADE:`add-payment`,
  GET_PAYMENTMADE:`getAllPayments`,
  GET_PAYMENT:`getPayment`,

  // Debit note
 GET_DEBIT_NOTE_PREFIX:`get-last-debit-note-prefix`,
 ADD_DEBIT_NOTE:`add-DebitNote`,
 GET_ALL_DEBIT_NOTE:`get-all-debitNote`,
 GET_DEBIT_NOTE:`getDebitNote`,



  // Login
  LOGIN: "/login",
  GET_OTP: "/verify-otp",


    //  Expense 
    ADD_EXPENSES:`add-expense`,
    GET_ALL_EXPENSE:`get-all-expense`,
    GET_A_EXPENSE:`get-one-expense`,

  //Expense > category
  ADD_EXPENSE_CATEGORY:`add-category`,
  GET_ALL_EXPENSE_CATEGORY:`get-all-category`,
  GET_ONE_EXPENSE_CATEGORY:`get-one-category`,
  UPDATE_EXPENSE_CATEGORY:`update-category`,
  DELETE_EXPENSE_CATEGORY:`delete-category`
};
