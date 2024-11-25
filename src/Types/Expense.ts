interface ExpenseDetail {
    expenseAccountId: string;
    expenseAccount: string;
    note: string;
    taxGroup: string;
    taxExemption: string;
    sgst: number;
    cgst: number;
    igst: number;
    vat: number;
    sgstAmount: number;
    cgstAmount: number;
    amount: number;
  }
  
  export interface ExpenseData {
    expenseDate: string;
    paidThrough: string;
    paidThroughId: string;
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
    amount: number;
    invoice: string;
    uploadFiles: string;
    subTotal: number;
    taxGroup:string;
    sgst: number;
    cgst: number;
    igst: number;
    vat: number;
    grandTotal: number;
    expenseAccount:string;
    expenseAccountId: string;
    note:string;
    amountIs:string;
    expense: ExpenseDetail[];
  }
  