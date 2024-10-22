export interface SalesQuote {
  customerId: string;
  customerName: string;
  placeOfSupply: string;
  reference: string;
  salesQuoteDate: string;
  expiryDate: string;
  subject: string;
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
    itemTotaltax: string;
    discountType: string;
    discountAmount: string;
    amount: string;
   
  }[];
  totalItemDiscount:string;
  note: string;
  tc: string;
  subtotalTotal:string;
  totalDiscount:string;
  // discountType: string;
  discountTransactionType: string;
  discountTransactionAmount: string;
  transactionDiscount:string;
  // discountTax: string;
  subTotal: string;
  totalItem: string;
  cgst: string;
  sgst: string;
  igst: string;
  vat: string;
  totalTax: string;
  totalAmount: string;
}