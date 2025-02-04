interface ExpenseDetail {
    expenseAccountId: string;
    note: string;
    taxGroup: string;
    taxExemption: string;
    sgst: number;
    cgst: number;
    igst: number;
    vat: number;
    sgstAmount: number;
    cgstAmount: number;
    igstAmount:number;
    amount: number;
  }
  
  export interface ExpenseData {
    expenseNumber:string;
    expenseDate: string;
    paidThroughAccountId: string;
    expenseCategory: string;
    expenseType: string;
    hsnCode: string;
    sac: string;
    distance: string;
    ratePerKm: string;
    supplierId: string;
    supplierDisplayName: string;
    gstTreatment: string;
    gstin: string;
    sourceOfSupply: string;
    destinationOfSupply: string;
    invoice: string;
    uploadFiles: string;
    subTotal: number;  
    grandTotal: number;
    amountIs:string;
    sgst:number;
    cgst:number;
    igst:number;
    vat:number;
    expense: ExpenseDetail[];
  }
  