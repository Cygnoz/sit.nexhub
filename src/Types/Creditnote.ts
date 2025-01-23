export interface CreditNoteBody {
  organizationId: string;
  customerId: string;
  customerDisplayName: string;
  
  placeOfSupply: string;
  
  invoiceId: string;
  invoiceNumber: string | number;
  invoiceDate: string;
  invoiceType: string;
  creditNote: string;
  orderNumber: string;
  customerCreditDate: string;
  paymentMode: string;
  paidThroughAccountId: string;
  subject: string;
  
  items: {
    itemId: string;
    itemName: string;
    quantity: number | string;
    sellingPrice: number | string;
    taxPreference: string;
    itemAmount: number | string;
    sgst: number | string;
    cgst: number | string;
    igst: number | string;
    vat: number | string;
    sgstAmount: number | string;
    cgstAmount: number | string;
    igstAmount: number | string;
    vatAmount: number | string;
    itemTotaltax: number | string;
    salesAccountId:any;
  }[];
  
  addNotes: string;
  attachFiles: string;
  termsAndConditions: string;
  
  subTotal: number | string;
  totalItem: number | string;
  sgst: number | string;
  cgst: number | string;
  igst: number | string;
  vat: number | string;
  totalTax: number | string;
  totalAmount: number | string;
}
