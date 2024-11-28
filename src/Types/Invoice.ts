export interface invoice {
    customerId: string;
    customerName: string;
    placeOfSupply: string;
    reference: string;
    salesInvoiceDate: string;
    dueDate:string;
  
    paymentMode:string;
    paymentTerms:string;
    deliveryMethod:string;
    expectedShipmentDate:string;
    salesOrderNumber:string;
    
    items: Array<{
      itemId: string;
      itemName: string;
      quantity: string;
      sellingPrice: string;
      taxPreference: string;
      discountType: string;
      discountAmount: string;
      amount: string;
      itemAmount: string;
      taxGroup: string;
      cgst: string;
      sgst: string;
      igst: string;
      cgstAmount: string;
      sgstAmount: string;
      igstAmount: string;
      vatAmount: string;
      itemTotaltax: string;
    }>;
    totalItemDiscount:string;
    note: string;
    tc: string;
    subtotalTotal:string;
    otherExpenseAmount: string;
    otherExpenseReason: string;
    vehiclestring: string;
    freightAmount: string;
    roundOffAmount: string;

    otherExpenseAccountId:string;
    freightAccountId:string;
    paidAmount:string;
    depositAccountId:string;
    
    discountTransactionType: string;
    discountTransactionAmount: string;
    transactionDiscount:string;
  
    subTotal: string;
    totalItem: string;
    cgst: string;
    sgst: string;
    igst: string;
    vat: string;
    totalDiscount: string;
    totalTax: string;
    totalAmount: string;
}