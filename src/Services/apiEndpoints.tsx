export const endponits = {
  // Settings
  GET_ADDITIONAL_DATA: `get-additional-data`,
  CREATE_ORGANIZATION: `setup-organization`,
  GET_ONE_ORGANIZATION: `get-one-organization`,
  GET_COUNTRY_DATA: `get-countries-data`,
  GET_CURRENCY_LIST: `get-currency`,
  // Organisation Invoices
  ADD_INVOICE_SETTINGS: "add-invoice-settings",
  GET_INVOICE_SETTINGS: "get-settings",
  ADD_PAYMENT_TERMS: `add-payment-terms`,
  EDIT_PAYMENT_TERMS: `edit-payment-terms/:id`,
  DELETE_PAYMENT_TERMS: `delete-payment-terms`,
  GET_PAYMENT_TERMS: `get-all-payment-terms`,

  // Accountant
  Get_ALL_Acounts: "get-all-account",
  Get_LAST_Journel_Prefix: "get-last-journal-prefix",
  Add_NEW_Journel: "add-journal-entry",
  GET_ALL_JOURNALS: "get-all-journal",
  Add_NEW_ACCOUNT: "add-account",

  // Customer
  GET_ALL_CUSTOMER: "get-all-customer",
  ADD_CUSTOMER: "add-customer",

  // Supplier
  GET_ALL_SUPPLIER: "",

  //Currency
  GET_CURRENCIES: "get-currency",
  ADD_CURRENCIES: "add-currency",
  DELETE_CURRENCIES: (id: string) => `delete-currency/${id}`,
  EDIT_CURRENCIES: `edit-currency`,

  // Inventory
  // Settings/Taxes
  // Gst
  GET_ALL_TAX: "get-tax",
  ADD_NEW_TAX: "add-tax",
  UPDATE_TAX_VAT: `edit-tax`,


  //Get All Items
GET_ALL_ITEMS:"get-itemDropdown",

  // Inventory
  // Brand
  GET_ALL_BRAND: "get-all-brands",
  GET_BRAND: (id: string) => `get-one-brand/${id}`,
  UPDATE_BRAND: `update-brand`,
  DELETE_BRAND: (id: string) => `delete-brand/${id}`,
  ADD_BRAND: "add-brand",

  // Category
  GET_ALL_CATEGORIES: "get-all-category",
  ADD_CATEGORY: "add-category",
  DELETE_CATEGORY: (id: string) => `delete-category/${id}`,
  UPDATE_CATEGORY: `update-category`,
  GET_CATEGORY: (id: string) => `get-one-category/${id}`,

  // Manufacturer
  GET_ALL_MANUFACTURER: "get-all-manufacturer",
  ADD_MANUFACTURER: "add-manufacturer",
  DELETE_MANUFACTURER: (id: string) => `delete-manufacturer/${id}`,
  UPDATE_MANUFACTURER: `update-manufacturer`,

  // Rack
  GET_ALL_RACK: "get-all-rack",
  ADD_RACK: "add-rack",
  UPDATE_RACK: "update-rack",
  GET_RACK: (id: string) => `get-one-rack/${id}`,
  DELETE_RACK: (id: string) => `delete-rack/${id}`,
};
