export interface SalesQuote {
  customerId: string;
  customerDisplayName: string;
  placeOfSupply: string;
  reference: string;
  salesQuoteDate: string;
  expiryDate: string;
  subject: string;
  taxPreference:string;
  items: {
    itemId: string;
    itemName: string;
    quantity: string;
    sellingPrice: string;
    taxPreference: string;
    taxGroup: string;
    cgst: string;
    sgst: string;
    igst: string;
    cgstAmount: string;
    sgstAmount: string;
    igstAmount: string;
    vatAmount: string;
    itemTotalTax: string;
    discountType: string;
    discountAmount: string;
    amount: string;
    itemAmount:string;
   
  }[];
  totalItemDiscount:string;
  note: string;
  tc: string;
  subtotalTotal:string;
  totalDiscount:string;
  discountTransactionType: string;
  discountTransactionAmount: string;
  transactionDiscount:string;
  subTotal: string;
  totalItem: string;
  cgst: string;
  sgst: string;
  igst: string;
  vat: string;
  totalTax: string;
  totalAmount: string;
}