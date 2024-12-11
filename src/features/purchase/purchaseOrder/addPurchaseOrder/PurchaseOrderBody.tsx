export interface PurchaseOrder {
  supplierId: string;
  supplierDisplayName: string;  
  supplierBillingCountry: string; 
  supplierBillingState: string; 
  taxMode: string;
  sourceOfSupply: string;
  destinationOfSupply: string;
  deliveryAddress: string;
  customerId: string;
  reference: string;
  // purchaseOrder: string; 
  shipmentPreference: string;
  purchaseOrderDate: string;
  expectedShipmentDate: string;
  paymentTerms: string;
  paymentMode: string;

  items: Array<{
    itemImage?: string;
    itemId: string;
    itemName: string; 
    itemQuantity: number;
    itemCostPrice: number;
    itemTax:string;
    itemDiscount: number;
    itemDiscountType: string;
    itemAmount: number;
    itemSgst: number;
    itemCgst: number;
    itemIgst: number;
    itemVat: number;
    itemSgstAmount: number; 
    itemCgstAmount: number; 
    itemIgstAmount: number; 
    itemVatAmount: number;  
    taxPreference:string;
  }>;

  otherExpense: number;
  otherExpenseReason: string;
  freight: number;
  vehicleNo: string;
  addNotes: string;
  termsAndConditions: string;
  attachFiles: string;

  subTotal: number;
  totalItem: number;
  sgst: number;
  cgst: number;
  igst: number;
  vat: number;
  itemTotalDiscount: number;
  totalTaxAmount: number;
  roundOff: number;
  transactionDiscountType:string;
  transactionDiscount:number;
  transactionDiscountAmount:number;
  total:number;
  grandTotal: number;
}
