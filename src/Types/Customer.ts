export interface ContactPerson {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

export interface Customer {
  billingCountry: string;
  billingState: string;
  companyName: string;
  contactPerson: ContactPerson[]; // Array of contact persons
  createdDate: string; // Consider using Date if you plan to manipulate dates
  currency: string;
  customerDisplayName: string;
  customerEmail: string;
  enablePortal: boolean;
  firstName: string;
  gstTreatment: string;
  lastModifiedDate: string; // Same as above for Date handling
  lastName: string;
  organizationId: string;
  placeOfSupply: string;
  salutation: string;
  shippingCountry: string;
  shippingState: string;
  status: string;
  taxType: string;
  __v: number; // Version key
  _id: string; // Identifier
}
