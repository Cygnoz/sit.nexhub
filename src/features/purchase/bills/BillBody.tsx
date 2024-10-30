export interface Bill {
    organizationId: string;
    supplierId: string;
    supplierDisplayName:string;
    billNumber: string;
    sourceOfSupply: string;
    destinationOfSupply: string;
    taxMode: string;
    orderNumber: string;
    purchaseOrderDate: string;
    expectedShipmentDate: string;
    paymentTerms: string;
    paymentMode: string;
    billDate: string;
    dueDate: string;
    itemTable: {
        itemId: string;
        itemName: string;
        itemQuantity: number;
        itemCostPrice: number;
        itemDiscount: number;
        itemDiscountType: string;
        itemSgst: number;
        itemCgst: number;
        itemIgst: number;
        itemVat: number;
        itemSgstAmount: number;
        itemCgstAmount: number;
    }[];
    otherExpense: number;
    otherExpenseReason: string;
    vehicleNo: string;
    freight: number;
    addNotes: string;
    termsAndConditions: string;
    attachFiles: string;
    subTotal: number;
    totalItem: number;
    sgst: number;
    cgst: number;
    igst:number;
    transactionDiscountType: string;
    transactionDiscount: number;
    transactionDiscountAmount: number;
    totalTaxAmount: number;
    itemTotalDiscount: number;
    roundOff: number;
    paidStatus: string;
    shipmentPreference: string;
    grandTotal: number;
    balanceAmount:number;
    paidAmount:number;
}
