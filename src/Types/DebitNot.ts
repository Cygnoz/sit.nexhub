export interface DebitNoteBody {
    organizationId: string;
    supplierId: string;
    supplierDisplayName: string;
  
    sourceOfSupply: string;
    destinationOfSupply: string;
    taxMode: string;
  
    billId: string;
    supplierInvoiceNum: number | string;
    billDate: string; 
    billType: string;
    debitNote: string;
    orderNumber: string;
    supplierDebitDate: string; 
    paymentMode:string;
    depositAccountId:string;
    subject: string;
  
    items: {
      itemId: string;
      itemName: string;
      itemQuantity: number | string;
      itemCostPrice: number | string;
      itemTax: number | string;
      itemAmount: number | string;
      itemSgst: number | string;
      itemCgst: number | string;
      itemIgst: number | string;
      itemSgstAmount: number | string;
      itemCgstAmount: number | string;
      stock:number | string
    }[];
  
    addNotes: string;
    attachFiles: string;
  
    subTotal: number | string;
    totalItem: number | string;
    sgst: number | string;
    cgst: number | string;
    igst:number | string;
    totalTaxAmount: number | string;
    itemTotalDiscount: number | string;
    grandTotal: number | string;
  }
  