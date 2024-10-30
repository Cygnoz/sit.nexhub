export  type SupplierData = {
    _id:string,  
    supplierProfile:string; 
    salutation: string;
    firstName: string;
    lastName: string;
    companyName: string;
    supplierDisplayName: string;
    supplierEmail: string;
    workPhone: string;
    mobile: string;
    creditDays: string;
    creditLimit: string;
    interestPercentage: string;
    pan: string;
    currency: string;
    debitOpeningBalance?:string,
    creditOpeningBalance?:string,
    paymentTerms: string;
    tds: string;
    documents: string;
    websiteURL: string;
    department: string;
    designation: string;
    // taxType:""
    gstTreatment: string;
    gstinUin: string;
    vatNumber: string;
    sourceOfSupply: string;
    msmeType: string;
    msmeNumber: string;
    msmeRegistered: boolean;
    billingAttention: string;
    billingCountry: string;
    billingAddressStreet1: string;
    billingAddressStreet2: string;
    billingCity: string;
    billingState: string;
    billingPinCode: string;
    billingPhone: string;
    billingFaxNum: string;
    shippingAttention: string;
    shippingCountry: string;
    shippingAddressStreet1: string;
    shippingAddressStreet2: string;
    shippingCity: string;
    shippingState: string;
    shippingPinCode: string;
    shippingPhone: string;
    shippingFaxNum: string;
    status:string,
    contactPerson: {
      salutation: string;
      firstName: string;
      lastName: string;
      emailAddress: string;
      workPhone: string;
      mobile: string;
    }[];
  
    bankDetails: {
      accountHolderName: string;
      bankName: string;
      accountNum: string;
      ifscCode: string;
    }[];
    remarks: string;
  };

