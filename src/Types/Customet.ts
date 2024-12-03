export interface CustomerData {
    customerProfile:string;
    _id?:string;
    customerType: string;
    salutation: string;
    firstName: string;
    lastName: string;
    companyName: string;
    customerDisplayName: string;
    customerEmail: string;
    workPhone: string;
    mobile: string;
    dob: string;
    cardNumber: string;
    pan: string;
    currency: string;
    paymentTerms: string;
    creditDays: string;
    creditLimit: string;
    interestPercentage: string;
    debitOpeningBalance?: string;  
    creditOpeningBalance?: string;
    enablePortal: boolean;
    documents: string;
    department: string;
    designation: string;
    websiteURL: string;
    taxType: string;
    exemptionReason: string;
    taxPreference: string;
    gstTreatment: string;
    gstin_uin: string;
    placeOfSupply: string;
    businessLegalName: string;
    businessTradeName: string;
    vatNumber: string;
    billingAttention: string;
    billingCountry: string;
    billingAddressLine1: string;
    billingAddressLine2: string;
    billingCity: string;
    billingState: string;
    billingPinCode: string;
    billingPhone: string;
    billingFaxNumber: string;
    shippingAttention: string;
    shippingCountry: string;
    shippingAddress1: string;
    shippingAddress2: string;
    shippingCity: string;
    shippingState: string;
    shippingPinCode: string;
    shippingPhone: string;
    shippingFaxNumber: string;
    contactPerson: {
      salutation: string;
      firstName: string;
      lastName: string;
      email: string;
      mobile: string;
    }[];
    remark: string;
  };