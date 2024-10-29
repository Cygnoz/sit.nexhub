import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import Button from "../../../Components/Button";
import CehvronDown from "../../../assets/icons/CehvronDown";
import Upload from "../../../assets/icons/Upload";
import Modal from "../../../Components/model/Modal";
import PlusCircle from "../../../assets/icons/PlusCircle";
import Globe from "../../../assets/icons/Globe";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import Pen from "../../../assets/icons/Pen";
import { useParams } from "react-router-dom";
import { CustomerEditResponseContext } from "../../../context/ContextShare";

type Props = { customerDataPorps?: CustomerData; addressEdit?: string };
type CustomerData = {
  organizationId: string;
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
  debitOpeningBalance: string;
  creditOpeningBalance: string;
  enablePortal: boolean;
  documents: string;
  department: string;
  designation: string;
  websiteURL: string;
  taxType: string;
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

const EditCustomerModal = ({ customerDataPorps, addressEdit }: Props) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [currencyData, setcurrencyData] = useState<any | []>([]);
  const [countryData, setcountryData] = useState<any | []>([]);
  const [stateList, setStateList] = useState<any | []>([]);
  const [shippingstateList, setshippingStateList] = useState<any | []>([]);
  const [taxPreference, SetTaxPreference] = useState<string>("Taxable");
  const [taxselected, setTaxSelected] = useState<string | null>("Taxable");
  const [openingType, setOpeningtype] = useState<any | null>("Debit");
  const shippingAddressRef = useRef<HTMLDivElement | null>(null);
  const BillingAddressRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<string>("otherDetails");
  const [paymentTerms, setPaymentTerms] = useState<any | []>([]);
  const [gstOrVat, setgstOrVat] = useState<any | []>([]);
  const [oneOrganization, setOneOrganization] = useState<any | []>([]);
  const [placeOfSupplyList, setPlaceOfSupplyList] = useState<any | []>([]);
  const { request: editCustomerDetails } = useApi("put", 5002);
  const { request: getCountryData } = useApi("get", 5004);
  const { request: getCurrencyData } = useApi("get", 5004);
  const { request: getPaymentTerms } = useApi("get", 5004);
  const { request: getOrganization } = useApi("get", 5004);
  const { request: getTax } = useApi("get", 5002);
  const param = useParams();

  const { setcustomereditResponse } = useContext(CustomerEditResponseContext)!;
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    companyName: false,
    customerDisplayName: false,
  });
  const [customerdata, setCustomerData] = useState<CustomerData>({
    organizationId: "INDORG0001",
    customerType: "",
    salutation: "",
    firstName: "",
    lastName: "",
    companyName: "",
    customerDisplayName: "",
    customerEmail: "",
    workPhone: "",
    mobile: "",
    dob: "",
    cardNumber: "",
    pan: "",
    currency: "",
    creditOpeningBalance: "",
    debitOpeningBalance: "",
    paymentTerms: "",
    enablePortal: false,
    creditDays: "",
    creditLimit: "",
    interestPercentage: "",
    documents: "",
    department: "",
    designation: "",
    websiteURL: "",
    taxType: "",
    gstTreatment: "",
    gstin_uin: "",
    placeOfSupply: "",
    businessLegalName: "",
    businessTradeName: "",
    vatNumber: "",
    billingAttention: "",
    billingCountry: "",
    billingAddressLine1: "",
    billingAddressLine2: "",
    billingCity: "",
    billingState: "",
    billingPinCode: "",
    billingPhone: "",
    billingFaxNumber: "",
    shippingAttention: "",
    shippingCountry: "",
    shippingAddress1: "",
    shippingAddress2: "",
    shippingCity: "",
    shippingState: "",
    shippingPinCode: "",
    shippingPhone: "",
    shippingFaxNumber: "",
    contactPerson: [
      {
        salutation: "",
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
      },
    ],
    remark: "",
  });
  const [rows, setRows] = useState(customerdata.contactPerson || []);

  const addRow = () => {
    setRows([
      ...rows,
      { salutation: "", firstName: "", lastName: "", email: "", mobile: "" },
    ]);
  };

  // console.log(customerdata,"data");
  // console.log(customerDataPorps,"props");

  const closeModal = () => {
    setModalOpen(false);
  };

  const getTabClassName = (tabName: string) => {
    return activeTab === tabName
      ? "cursor-pointer font-bold text-darkRed"
      : "cursor-pointer font-bold";
  };

  const getBorderClassName = (tabName: string) => {
    return activeTab === tabName ? "border-darkRed" : "border-neutral-300";
  };

  // data from checkboxes
  const handleRadioChange = (type: string, field: "customerType") => {
    setCustomerData((prevFormData) => ({
      ...prevFormData,
      [field]: type,
    }));

    if (field === "customerType") {
      setSelected(type);
    }
  };

  //data from table
  const handleRowChange = (
    index: number,
    field: keyof (typeof rows)[number],
    value: string
  ) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);

    setCustomerData((prevFormData) => ({
      ...prevFormData,
      contactPerson: newRows,
    }));
  };

  const handlePhoneChange = (phoneType: string, value: string) => {
    setCustomerData((prevData) => ({
      ...prevData,
      [phoneType]: value,
    }));
  };
  // console.log(customerdata);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    if (name == "companyName") {
      setCustomerData({ ...customerdata, customerDisplayName: value });
    }
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setCustomerData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      if (name !== "openingBalance") {
        setCustomerData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }

    if (name === "openingType") {
      // Update openingType state first
      setOpeningtype(value);

      // Update supplierData state based on the new openingType value
      if (value === "Debit") {
        setCustomerData((prevData) => ({
          ...prevData,
          debitOpeningBalance: prevData.creditOpeningBalance,
          creditOpeningBalance: "", // Clear creditOpeningBalance
        }));
      } else if (value === "Credit") {
        setCustomerData((prevData) => ({
          ...prevData,
          creditOpeningBalance: prevData.debitOpeningBalance,
          debitOpeningBalance: "", // Clear debitOpeningBalance
        }));
      }
    }

    // Update openingBalance field
    if (name === "openingBalance") {
      if (openingType === "Credit") {
        setCustomerData((prevData) => ({
          ...prevData,
          creditOpeningBalance: value,
        }));
      } else if (openingType === "Debit") {
        setCustomerData((prevData) => ({
          ...prevData,
          debitOpeningBalance: value,
        }));
      }
    }
  };

  const getAdditionalData = async () => {
    try {
      // Fetching currency data
      const Currencyurl = `${endponits.GET_CURRENCY_LIST}`;
      const { response, error } = await getCurrencyData(Currencyurl);

      if (!error && response) {
        setcurrencyData(response?.data);
        // console.log(response.data, "currencyData");
      }

      const paymentTermsUrl = `${endponits.GET_PAYMENT_TERMS}`;
      const { response: paymentTermResponse, error: paymentTermError } =
        await getPaymentTerms(paymentTermsUrl);

      if (!paymentTermError && paymentTermResponse) {
        setPaymentTerms(paymentTermResponse.data);
        // console.log(paymentTermResponse.data);
      }

      const taxUrl = `${endponits.GET_TAX}`;
      const { response: taxResponse, error: taxError } = await getTax(taxUrl);

      if (!taxError && taxResponse) {
        if (taxResponse) {
          // console.log(taxResponse.data.taxType, "tax");

          setgstOrVat(taxResponse.data);
        }
      } else {
        console.log(taxError.response.data, "tax");
      }

      const CountryUrl = `${endponits.GET_COUNTRY_DATA}`;
      const { response: countryResponse, error: countryError } =
        await getCountryData(CountryUrl);
      if (!countryError && countryResponse) {
        // console.log(countryResponse.data[0].countries, "country");
        setcountryData(countryResponse?.data[0].countries);
      } else {
        console.log(countryError, "country");
      }
    } catch (error) {
      console.log("Error in fetching currency data or payment terms", error);
    }
  };

  const handleCopyAddress = (e: any) => {
    e.preventDefault();
    setCustomerData((prevData) => ({
      ...prevData,
      shippingAttention: customerdata.billingAttention,
      shippingCountry: customerdata.billingCountry,
      shippingAddress1: customerdata.billingAddressLine1,
      shippingAddress2: customerdata.billingAddressLine2,
      shippingCity: customerdata.billingCity,
      shippingState: customerdata.billingState,
      shippingPinCode: customerdata.billingPinCode,
      shippingPhone: customerdata.billingPhone,
      shippingFaxNumber: customerdata.billingFaxNumber,
    }));
  };

  useEffect(() => {
    if (customerdata.billingCountry) {
      const country = countryData.find(
        (c: any) => c.name === customerdata.billingCountry
      );
      if (country) {
        setStateList(country.states || []);
      }
    }

    if (customerdata.shippingCountry) {
      const country = countryData.find(
        (c: any) => c.name === customerdata.shippingCountry
      );
      if (country) {
        setshippingStateList(country.states || []);
      }
    }
  }, [customerdata.shippingCountry, customerdata.billingCountry, countryData]);

  const { id } = param;

  const handleEdit = async () => {
    const newErrors = { ...errors };

    if (customerdata.customerDisplayName === "") {
      newErrors.customerDisplayName = true;
    }
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }
    const url = `${endponits.EDIT_CUSTOMER}/${id}`;
    try {
      const apiResponse = await editCustomerDetails(url, customerdata);
      // console.log(apiResponse);
      const { response, error } = apiResponse;
      if (!error && response) {
        setModalOpen(false);
        toast.success(response.data.message);
        setcustomereditResponse((prevCustomerResponse: any) => ({
          ...prevCustomerResponse,
          customerdata,
        }));
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleplaceofSupply = () => {
    if (oneOrganization.organizationCountry) {
      const country = countryData.find(
        (c: any) =>
          c.name.toLowerCase() ===
          oneOrganization.organizationCountry.toLowerCase()
      );

      if (country) {
        const states = country.states;
        // console.log("States:", states);

        setPlaceOfSupplyList(states);
      } else {
        console.log("Country not found");
      }
    } else {
      console.log("No country selected");
    }
  };

  const getOneOrganization = async () => {
    try {
      const url = `${endponits.GET_ONE_ORGANIZATION}`;
      const apiResponse = await getOrganization(url);

      const { response, error } = apiResponse;

      if (!error && response?.data) {
        setOneOrganization(response.data);
        // console.log(response.data,"org");
      }
    } catch (error) {
      console.error("Error fetching organization:", error);
    }
  };

  useEffect(() => {
    getOneOrganization();
    if (addressEdit) {
      setActiveTab("address");
    }
  }, []);

  useEffect(() => {
    handleplaceofSupply();
  }, [getOneOrganization]);

  useEffect(() => {
    getAdditionalData();
    if (customerDataPorps) {
      setCustomerData(customerDataPorps);
      setRows(customerDataPorps.contactPerson || []);
      setSelected(customerDataPorps.customerType);
    }
  }, [customerDataPorps]);

  const addressscroll = () => {
    if (addressEdit === "shippingAddressEdit" && shippingAddressRef.current) {
      shippingAddressRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    if (addressEdit === "billingAddressEdit" && BillingAddressRef.current) {
      BillingAddressRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    addressscroll();
  }, [addressEdit, addressscroll]);

  return (
    <div>
      {addressEdit ? (
        <button onClick={() => setModalOpen(true)}>
          <Pen color={"#303F58"} />
        </button>
      ) : (
        <Button
          onClick={() => setModalOpen(true)}
          variant="secondary"
          size="sm"
          className="text-[10px] h-6 px-5"
        >
          <Pen color={"#303F58"} />
          Edit
        </Button>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        className=""
        style={{ width: "80%" }}
      >
        <>
          <div className="p-5 mt-3">
            <div className="mb-5 flex p-2 rounded-xl bg-CreamBg relative overflow-hidden items-center">
              <div className="relative ">
                <h3 className="text-lg font-bold text-textColor">
                  Edit Customer
                </h3>
              </div>
              <div
                className="ms-auto text-3xl cursor-pointer relative z-10"
                onClick={() => setModalOpen(false)}
              >
                &times;
              </div>
            </div>
            <form
              className="text-slate-600 text-sm overflow-scroll hide-scrollbar space-y-5 p-2"
              style={{ height: "480px" }}
            >
              <div>
                <label
                  className="block text-sm mb-1 text-labelColor"
                  htmlFor=""
                >
                  Customer Type
                </label>
                <div className="flex items-center space-x-4 text-textColor text-sm">
                  <div className="flex gap-2 justify-center items-center">
                    <div
                      className="grid place-items-center mt-1"
                      onChange={() =>
                        handleRadioChange("Business", "customerType")
                      }
                    >
                      <input
                        id="Business"
                        type="radio"
                        name="customerType"
                        className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                          selected === "Business"
                            ? "border-8 border-neutral-400"
                            : "border-1 border-neutral-400"
                        }`}
                        checked={selected === "Business"}
                        onChange={() =>
                          handleRadioChange("Business", "customerType")
                        }
                      />
                      <div
                        className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                          selected === "Business"
                            ? "bg-neutral-100"
                            : "bg-transparent"
                        }`}
                      />
                    </div>
                    <label
                      htmlFor="Business"
                      className="text-start font-medium"
                    >
                      Business
                    </label>
                  </div>
                  <div className="flex gap-2 justify-center items-center">
                    <div
                      className="grid place-items-center mt-1"
                      onChange={() =>
                        handleRadioChange("Individual", "customerType")
                      }
                    >
                      <input
                        id="Individual"
                        type="radio"
                        name="customerType"
                        className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                          selected === "Individual"
                            ? "border-8 border-neutral-400"
                            : "border-1 border-neutral-400"
                        }`}
                        checked={selected === "Individual"}
                        onChange={() =>
                          handleRadioChange("Individual", "customerType")
                        }
                      />
                      <div
                        className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                          selected === "Individual"
                            ? "bg-neutral-100"
                            : "bg-transparent"
                        }`}
                      />
                    </div>
                    <label
                      htmlFor="Individual"
                      className="text-start font-medium"
                    >
                      Individual
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-2">
                  <label htmlFor="salutation">Salutation</label>
                  <div className="relative w-full">
                    <select
                      name="salutation"
                      className="block appearance-none w-full h-9 mt-1 text-[#818894] bg-white border border-inputBorder text-sm  pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      value={customerdata.salutation}
                      onChange={handleChange}
                    >
                      <option defaultChecked value="Mr.">
                        Mr.
                      </option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 col-span-10 gap-4 ">
                  <div>
                    <label htmlFor="firstName" className="text-slate-600">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300  h-9 p-2 text-[#818894]"
                      placeholder="Enter First Name"
                      value={customerdata.firstName}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleChange(e);
                        if (value && !/^[A-Za-z\s]+$/.test(value)) {
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            lastName: true,
                          }));
                        } else {
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            lastName: false,
                          }));
                        }
                      }}
                    />

                    {errors.lastName && customerdata.lastName.length > 0 && (
                      <div className="text-red-800 text-xs ms-2 mt-1">
                        Please enter a valid first name (letters only).
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="text-slate-600">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300  h-9 p-2 text-[#818894]"
                      placeholder="Enter Last Name"
                      value={customerdata.lastName}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleChange(e);
                        if (value && !/^[A-Za-z\s]+$/.test(value)) {
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            lastName: true,
                          }));
                        } else {
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            lastName: false,
                          }));
                        }
                      }}
                    />

                    {errors.lastName && customerdata.lastName.length > 0 && (
                      <div className="text-red-800 text-xs ms-2 mt-1">
                        Please enter a valid Last name (letters only).
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="companyName">Company Name </label>
                  <input
                    type="text"
                    name="companyName"
                    className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300  h-9 p-2 text-[#818894]"
                    placeholder="Enter Company Name"
                    value={customerdata.companyName}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleChange(e);

                      if (!value || !/^[A-Za-z0-9\s\W]+$/.test(value)) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          customerDisplayName: true,
                        }));
                      } else {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          customerDisplayName: false,
                        }));
                      }
                    }}
                  />

                  {errors.companyName &&
                    customerdata.companyName.length > 0 && (
                      <div className="text-red-800 text-xs ms-2 mt-1">
                        Please enter a valid Company Name (letters only).
                      </div>
                    )}
                </div>
                <div>
                  <label htmlFor="companyName">Customer Display Name </label>
                  <input
                    required
                    type="text"
                    name="customerDisplayName"
                    className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                    placeholder="Enter Display Name"
                    value={customerdata.customerDisplayName}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleChange(e);

                      if (!value || !/^[A-Za-z0-9\s\W]+$/.test(value)) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          customerDisplayName: true,
                        }));
                      } else {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          customerDisplayName: false,
                        }));
                      }
                    }}
                  />

                  {errors.customerDisplayName && (
                    <div className="text-red-800 text-xs ms-2 mt-1">
                      Please enter a Customer Display Name.
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="">Customer Email</label>
                  <input
                    type="email"
                    name="customerEmail"
                    className="pl-2 text-sm w-[100%] mt-1  rounded-md text-start bg-white border border-slate-300  h-9 p-2 text-[#818894]"
                    placeholder="Enter Email"
                    onChange={handleChange}
                    value={customerdata.customerEmail}
                  />

                
                </div>
                <div>
                  <label htmlFor="">Membership Card Number</label>
                  <input
                    type="text"
                    className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300  h-9 p-2 text-[#818894]"
                    placeholder="XXX"
                    name="cardNumber"
                    value={customerdata.cardNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="">Work Phone</label>

                  <PhoneInput
                    inputClass="appearance-none text-[#818894] bg-white border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    inputStyle={{ height: "38px", width: "100%" }}
                    containerStyle={{ width: "100%" }}
                    country={"in"}
                    value={customerdata.workPhone}
                    onChange={(e) => handlePhoneChange("workPhone", e)}
                  />
                </div>
                <div>
                  <label htmlFor="">Mobile</label>
                  <PhoneInput
                    inputClass="appearance-none text-[#818894] bg-white border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    inputStyle={{ height: "38px", width: "100%" }}
                    containerStyle={{ width: "100%" }}
                    country={"in"}
                    value={customerdata.mobile}
                    onChange={(e) => handlePhoneChange("mobile", e)}
                  />
                </div>
                <div>
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                    placeholder="Value"
                    value={customerdata.dob}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]} // Set max to today's date
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4"></div>

              <div className="flex mt-5 px-5">
                <div className="w-[20%] bg-gray-100 p-4">
                  <ul className="h-full   space-y-0 border-gray-300 text-slate-700">
                    <li
                      className={`${getTabClassName(
                        "otherDetails"
                      )} border-r-4 ${getBorderClassName("otherDetails")} p-2 `}
                      onClick={() => setActiveTab("otherDetails")}
                    >
                      Other Details
                    </li>
                    <li
                      className={`${getTabClassName(
                        "taxes"
                      )} border-r-4 ${getBorderClassName("taxes")} p-2`}
                      onClick={() => setActiveTab("taxes")}
                    >
                      Taxes
                    </li>
                    <li
                      className={`${getTabClassName(
                        "address"
                      )} border-r-4 ${getBorderClassName("address")} p-2`}
                      onClick={() => setActiveTab("address")}
                    >
                      Address
                    </li>
                    <li
                      className={`${getTabClassName(
                        "contactPersons"
                      )} border-r-4 ${getBorderClassName(
                        "contactPersons"
                      )} p-2`}
                      onClick={() => setActiveTab("contactPersons")}
                    >
                      Contact Persons
                    </li>
                    <li
                      className={`${getTabClassName(
                        "remarks"
                      )} border-r-4 ${getBorderClassName("remarks")} p-2`}
                      onClick={() => setActiveTab("remarks")}
                    >
                      Remarks
                    </li>
                  </ul>
                </div>
                <div className=" w-full p-2 ps-16">
                  {activeTab === "otherDetails" && (
                    <div className="space-y-4  p-4 ">
                      <div className="grid grid-cols-2 gap-4">
                        {/* <div>
                          <label className="block mb-1">Opening Balance</label>
                          <div className="flex">
                            <div className="relative w-20 ">
                              <select
                                className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder 
                                   text-sm pl-2 pr-2 rounded-l-md leading-tight 
                                   focus:outline-none focus:bg-white focus:border-gray-500"
                                name="openingType"
                                value={openingType}
                                onChange={handleChange}
                              >
                                <option value="Debit">Dr</option>

                                <option value="Credit">Cr</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <CehvronDown color="gray" />
                              </div>
                            </div>
                            <input
                              type="text"
                              className="text-sm w-[100%] rounded-r-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                              placeholder={`Enter ${openingType} Opening Balance`}
                              onChange={handleChange}
                              name="openingBalance"
                              value={
                                openingType === "Debit"
                                  ? customerdata.debitOpeningBalance
                                  : customerdata.creditOpeningBalance
                              }
                            />
                          </div>
                        </div> */}
                        <div>
                          <label className="block mb-1">PAN</label>
                          <input
                            type="text"
                            className=" text-sm w-[100%]  rounded-md text-start bg-white border border-slate-300  h-9 p-2 text-[#818894]"
                            placeholder="Enter Pan Number"
                            name="pan"
                            value={customerdata.pan}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <div className="">
                            <label htmlFor="" className="block mb-1">
                              Currency
                            </label>
                            <div className="relative w-full">
                              <select
                                className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder 
                                 text-sm pl-2 pr-8 rounded-md leading-tight 
                                 focus:outline-none focus:bg-white focus:border-gray-500"
                                name="currency"
                                value={customerdata.currency}
                                onChange={handleChange}
                              >
                                <option value="">Select Currency</option>

                                {currencyData.map(
                                  (item: any, index: number) => (
                                    <option
                                      key={index}
                                      value={item.currencyCode}
                                    >
                                      {item.currencyName} ({item.currencySymbol}
                                      )
                                    </option>
                                  )
                                )}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <CehvronDown color="gray" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative w-full">
                          <label htmlFor="" className="block mb-1">
                            Payment Terms
                          </label>
                          <select
                            className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder 
                                 text-sm pl-2 pr-8 rounded-md leading-tight 
                                 focus:outline-none focus:bg-white focus:border-gray-500"
                            name="paymentTerms"
                            value={customerdata.paymentTerms}
                            onChange={handleChange}
                          >
                            <option value="" className="text-gray">
                              Select Payment Terms
                            </option>
                            {paymentTerms &&
                              paymentTerms.map((item: any) => (
                                <option
                                  key={item._id}
                                  value={item.name}
                                  className="text-gray"
                                >
                                  {item.name}
                                </option>
                              ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0  mt-6 right-0 flex items-center px-2 text-gray-700">
                            <CehvronDown color="gray" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-lightPink p-5 rounded-lg space-y-5">
                        <p className="font-bold text-">Enable Portal?</p>
                        <div className="flex items-center mt-4 gap-1 text-textColor">
                          <input
                            name="enablePortal"
                            defaultChecked={customerdata.enablePortal}
                            onChange={handleChange}
                            type="checkbox"
                            className=" h-6 w-5 mx-1 customCheckbox"
                            id=""
                          />
                          <label htmlFor="" className="text-textColor text-sm ">
                            Allow portal access to this customer
                          </label>
                        </div>
                        <div className="relative w-[349px]">
                          <label htmlFor="" className="block mb-1 ">
                            Select Language
                          </label>
                          <select
                            className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder 
                                 text-sm pl-2 pr-8 rounded-md leading-tight 
                                 focus:outline-none focus:bg-white focus:border-gray-500"
                            name="currency"
                            // value={customerdata.}
                            onChange={handleChange}
                          >
                            <option value="English" className="text-gray">
                              English
                            </option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0  mt-6 right-0 flex items-center px-2 text-gray-700">
                            <CehvronDown color="gray" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block mb-1">
                          Documents
                          <div className="border-dashed border border-neutral-300 p-2 rounded flex gap-2">
                            <Upload />
                            <span>Upload File</span>
                          </div>
                          <p className="text-xs mt-1 text-gray-600">
                            You Can Upload a Maximum of 10 Files, 10 MB each
                          </p>
                          <input
                            type="file"
                            className="hidden"
                            // value={customerdata.documents}
                            name="documents"
                            // onChange={(e)=>handleFileChange(e)}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block mb-1">Derpartment</label>
                        <input
                          type="text"
                          className=" text-sm w-[49%]  rounded-md text-start bg-white border border-slate-300  h-9 p-2 text-[#818894]"
                          placeholder="Value"
                          name="department"
                          value={customerdata.department}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label className="block mb-1">Designation</label>

                        <input
                          type="text"
                          className=" text-sm w-[49%]  rounded-md text-start bg-white border border-slate-300  h-9 p-2 text-[#818894]"
                          placeholder="Value"
                          name="designation"
                          value={customerdata.designation}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="">
                        <label htmlFor="" className="block mb-1">
                          Website
                        </label>
                        <div className="relative w-full">
                          <div className="pointer-events-none absolute inset-y-0  flex items-center px-2 text-gray-700 w-[50%]">
                            <Globe />
                          </div>
                          <input
                            type="text"
                            className=" text-sm w-[49%] ps-9 rounded-md text-start bg-white border border-slate-300  h-9 p-2 text-[#818894]"
                            placeholder="Value"
                            name="websiteURL"
                            value={customerdata.websiteURL}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "taxes" && (
                    <>
                      <div className="mb-3">
                        <label className="block text-sm mb-1 text-labelColor">
                          Tax Preference
                        </label>
                        <div className="flex items-center space-x-4 text-textColor text-sm">
                          <div className="flex gap-2 justify-center items-center">
                            <div className="grid place-items-center mt-1">
                              <input
                                id="Taxable"
                                type="radio"
                                className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                                  taxselected === "Taxable"
                                    ? "border-8 border-neutral-400"
                                    : "border-1 border-neutral-400"
                                }`}
                                checked={taxselected === "Taxable"}
                                onClick={() => {
                                  SetTaxPreference("Taxable");
                                  setTaxSelected("Taxable");
                                }}
                              />
                              <div
                                className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                                  taxselected === "Taxable"
                                    ? "bg-neutral-100"
                                    : "bg-transparent"
                                }`}
                              />
                            </div>
                            <label
                              htmlFor="Taxable"
                              className="text-start font-medium"
                            >
                              Taxable
                            </label>
                          </div>
                          <div className="flex gap-2 justify-center items-center">
                            <div className="grid place-items-center mt-1">
                              <input
                                id="Tax Exempt"
                                type="radio"
                                className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                                  taxselected === "Tax Exempt"
                                    ? "border-8 border-neutral-400"
                                    : "border-1 border-neutral-400"
                                }`}
                                checked={taxselected === "Tax Exempt"}
                                onClick={() => {
                                  SetTaxPreference("Tax Exempt");
                                  setTaxSelected("Tax Exempt");
                                }}
                              />
                              <div
                                className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                                  taxselected === "Tax Exempt"
                                    ? "bg-neutral-100"
                                    : "bg-transparent"
                                }`}
                              />
                            </div>
                            <label
                              htmlFor="Tax Exempt"
                              className="text-start font-medium"
                            >
                              Tax Exempt
                            </label>
                          </div>
                        </div>
                      </div>

                      {taxPreference == "Taxable" && (
                        <>
                          {gstOrVat.taxType === "GST" && (
                            <div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="relative w-full">
                                  <label
                                    htmlFor="gstTreatment"
                                    className="block mb-1"
                                  >
                                    GST Treatment
                                  </label>
                                  <select
                                    className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    name="gstTreatment"
                                    value={customerdata.gstTreatment}
                                    onChange={handleChange}
                                  >
                                    <option value="" className="text-gray">
                                      Select GST Treatment
                                    </option>
                                    {gstOrVat?.gstTreatment?.map(
                                      (item: any, index: number) => (
                                        <option value={item} key={index}>
                                          {item}
                                        </option>
                                      )
                                    )}
                                  </select>

                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mt-6 text-gray-700">
                                    <CehvronDown color="gray" />
                                  </div>
                                </div>

                                <div>
                                  <label
                                    htmlFor="gstin_uin"
                                    className="block mb-1"
                                  >
                                    GSTIN/UIN
                                  </label>
                                  <input
                                    type="text"
                                    name="gstin_uin"
                                    className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                                    placeholder="GSTIN/UIN"
                                    value={customerdata.gstin_uin}
                                    onChange={handleChange}
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor="businessLegalName"
                                    className="block mb-1"
                                  >
                                    Business Legal Name
                                  </label>
                                  <input
                                    type="text"
                                    name="businessLegalName"
                                    className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                                    placeholder="Enter Business Legal Name"
                                    value={customerdata.businessLegalName}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="businessTradeName"
                                    className="block mb-1"
                                  >
                                    Business Trade Name
                                  </label>
                                  <input
                                    type="text"
                                    name="businessTradeName"
                                    className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                                    placeholder="Enter Business Trade Name"
                                    value={customerdata.businessTradeName}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="relative w-full">
                                  <label
                                    htmlFor="placeOfSupply"
                                    className="block mb-1"
                                  >
                                    Place of Supply
                                  </label>
                                  <select
                                    className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    name="placeOfSupply"
                                    value={customerdata.placeOfSupply}
                                    onChange={handleChange}
                                  >
                                    <option value="" className="text-gray">
                                      Value
                                    </option>
                                    {placeOfSupplyList &&
                                      placeOfSupplyList.map(
                                        (item: any, index: number) => (
                                          <option
                                            key={index}
                                            value={item}
                                            className="text-gray"
                                          >
                                            {item}
                                          </option>
                                        )
                                      )}
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mt-6 text-gray-700">
                                    <CehvronDown color="gray" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {gstOrVat.taxType === "VAT" && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label
                                  htmlFor="vatNumber"
                                  className="block mb-1"
                                >
                                  VAT Number
                                </label>
                                <input
                                  type="text"
                                  name="vatNumber"
                                  className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                                  placeholder="Enter VAT Number"
                                  value={customerdata.vatNumber}
                                  onChange={handleChange}
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="businessTradeName"
                                  className="block mb-1"
                                >
                                  Business Trade Name
                                </label>
                                <input
                                  type="text"
                                  name="businessTradeName"
                                  className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                                  placeholder="Enter Business Trade Name"
                                  value={customerdata.businessTradeName}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {taxPreference === "Tax Exempt" && (
                        <div>
                          <label className="block mb-1">Exemption Reason</label>
                          <input
                            type="text"
                            className="pl-2 text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                            placeholder="Value"
                            //  name="billingAttention"
                            //  value={customerdata.billingAttention}
                            //  onChange={handleChange}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === "address" && (
                    <>
                      {/* Billing Address */}
                      <div
                        className="space-y-3 p-5 text-sm"
                        ref={BillingAddressRef}
                      >
                        <p>
                          <b>Billing Address</b>
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Attention */}
                          <div>
                            <label className="block mb-1">Attention</label>
                            <input
                              type="text"
                              className="pl-2 text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                              placeholder="Value"
                              name="billingAttention"
                              value={customerdata.billingAttention}
                              onChange={handleChange}
                            />
                          </div>

                          {/* Country */}
                          <div className="relative w-full">
                            <label htmlFor="" className="mb-1 block">
                              Country/Region
                            </label>
                            <select
                              className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              name="billingCountry"
                              value={customerdata.billingCountry}
                              onChange={handleChange}
                            >
                              <option value="">Select a country</option>
                              {countryData && countryData.length > 0 ? (
                                countryData.map((item: any, index: number) => (
                                  <option key={index} value={item.name}>
                                    {item.name}
                                  </option>
                                ))
                              ) : (
                                <option disabled></option>
                              )}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 mt-6 flex items-center px-2 text-gray-700">
                              <CehvronDown color="gray" />
                            </div>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="">
                          <label
                            className="text-slate-600 "
                            htmlFor="organizationAddress"
                          >
                            Address
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input
                              className="pl-3 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder="Street 1"
                              name="billingAddressLine1"
                              value={customerdata.billingAddressLine1}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <input
                              className="pl-3 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] p-2 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder="Street 2"
                              name="billingAddressLine2"
                              value={customerdata.billingAddressLine2}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <label className="text-slate-600 " htmlFor="">
                              City
                            </label>
                            <input
                              className="pl-3 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] p-2 mt-2 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder="Enter City"
                              name="billingCity"
                              value={customerdata.billingCity}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="relative ">
                            <label
                              className="text-slate-600"
                              htmlFor="organizationAddress"
                            >
                              State / Region / County
                            </label>
                            <div className="relative w-full mt-2">
                              <select
                                value={customerdata.billingState}
                                onChange={handleChange}
                                name="billingState"
                                id="billingState"
                                className="block appearance-none w-full text-[#818894] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                                disabled={!customerdata.billingCountry}
                              >
                                <option value="">
                                  State / Region / County
                                </option>
                                {stateList.length > 0 ? (
                                  stateList.map((item: any, index: number) => (
                                    <option key={index} value={item}>
                                      {item}
                                    </option>
                                  ))
                                ) : (
                                  <></>
                                )}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <CehvronDown color="gray" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Other fields */}
                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <div>
                            <label
                              className="text-slate-600 "
                              htmlFor="organizationAddress"
                            >
                              Pin / Zip / Post code
                            </label>
                            <input
                              className="pl-3 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] p-2 mt-2 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder=" Pin / Zip / Post code"
                              type="text"
                              name="billingPinCode"
                              value={customerdata.billingPinCode}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <label
                              className="text-slate-600 "
                              htmlFor="organizationAddress"
                            >
                              Phone
                            </label>
                            <div className="w-full border-0 mt-2">
                              <PhoneInput
                                inputClass="appearance-none text-[#818894] bg-white border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                                inputStyle={{ height: "38px", width: "100%" }}
                                containerStyle={{ width: "100%" }}
                                country={
                                  customerdata.billingCountry
                                    ? customerdata.billingCountry.toLowerCase()
                                    : "in"
                                }
                                value={customerdata.billingPhone}
                                onChange={(e) =>
                                  handlePhoneChange("billingPhone", e)
                                }
                              />
                            </div>
                          </div>
                          <div className="relative w-full">
                            <label htmlFor="" className="mb-2 block">
                              Fax Number
                            </label>
                            <input
                              type="text"
                              className="pl-2 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-slate-300 h-9 p-2 "
                              placeholder="Enter Fax Number"
                              name="billingFaxNumber"
                              value={customerdata.billingFaxNumber}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div
                        className="space-y-3 p-5 text-sm"
                        ref={shippingAddressRef}
                      >
                        <div className="flex">
                          <p>
                            <b>Shipping Address</b>
                          </p>
                          <button
                            className="ml-auto text-gray"
                            onClick={handleCopyAddress}
                          >
                            <b>Copy Billing Address</b>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Attention */}
                          <div>
                            <label className="block mb-1">Attention</label>
                            <input
                              type="text"
                              className="pl-2 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-slate-300 h-9 p-2 "
                              placeholder="Value"
                              name="shippingAttention"
                              value={customerdata.shippingAttention}
                              onChange={handleChange}
                            />
                          </div>

                          {/* Country */}
                          <div className="relative w-full">
                            <label htmlFor="" className="mb-1 block">
                              Country/Region
                            </label>
                            <select
                              className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              name="shippingCountry"
                              value={customerdata.shippingCountry}
                              onChange={handleChange}
                            >
                              <option value="">Select a country</option>
                              {countryData && countryData.length > 0 ? (
                                countryData.map((item: any, index: number) => (
                                  <option key={index} value={item.name}>
                                    {item.name}
                                  </option>
                                ))
                              ) : (
                                <option disabled></option>
                              )}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 mt-6 flex items-center px-2 text-gray-700">
                              <CehvronDown color="gray" />
                            </div>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="">
                          <label
                            className="text-slate-600 "
                            htmlFor="organizationAddress"
                          >
                            Address
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input
                              className="pl-3 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder="Street 1"
                              name="shippingAddress1"
                              value={customerdata.shippingAddress1}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <input
                              className="pl-3 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] p-2 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder="Street 2"
                              name="shippingAddress2"
                              value={customerdata.shippingAddress2}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <label className="text-slate-600 " htmlFor="">
                              City
                            </label>
                            <input
                              className="pl-3 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] p-2 mt-2 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder="Enter City"
                              name="shippingCity"
                              value={customerdata.shippingCity}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="relative ">
                            <label
                              className="text-slate-600"
                              htmlFor="organizationAddress"
                            >
                              State / Region / County
                            </label>
                            <div className="relative w-full mt-2">
                              <select
                                value={customerdata.shippingState}
                                onChange={handleChange}
                                name="shippingState"
                                id="shippingState"
                                className="block appearance-none w-full text-[#818894] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                                disabled={!customerdata.shippingCountry}
                              >
                                <option value="">
                                  State / Region / County
                                </option>
                                {shippingstateList.length > 0 ? (
                                  shippingstateList.map(
                                    (item: any, index: number) => (
                                      <option key={index} value={item}>
                                        {item}
                                      </option>
                                    )
                                  )
                                ) : (
                                  <></>
                                )}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <CehvronDown color="gray" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Other fields */}
                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <div>
                            <label
                              className="text-slate-600 "
                              htmlFor="organizationAddress"
                            >
                              Pin / Zip / Post code
                            </label>
                            <input
                              className="pl-3 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] p-2 mt-2 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder=" Pin / Zip / Post code"
                              type="text"
                              name="shippingPinCode"
                              value={customerdata.shippingPinCode}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  handleChange(e);
                                }
                              }}
                            />
                          </div>
                          <div>
                            <label
                              className="text-slate-600 "
                              htmlFor="organizationAddress"
                            >
                              Phone
                            </label>
                            <div className="w-full border-0 mt-2">
                              <PhoneInput
                                inputClass="appearance-none text-[#818894] bg-white border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                                inputStyle={{ height: "38px", width: "100%" }}
                                containerStyle={{ width: "100%" }}
                                country={
                                  customerdata.shippingCountry
                                    ? customerdata.shippingCountry.toLowerCase()
                                    : "in"
                                }
                                value={customerdata.shippingPhone}
                                onChange={(e) =>
                                  handlePhoneChange("shippingPhone", e)
                                }
                              />
                            </div>
                          </div>
                          <div className="relative w-full">
                            <label htmlFor="" className="mb-2 block">
                              Fax Number
                            </label>
                            <input
                              type="text"
                              className="pl-2 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-slate-300 h-9 p-2 "
                              placeholder="Enter Fax Number"
                              name="shippingFaxNumber"
                              value={customerdata.shippingFaxNumber}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "contactPersons" && (
                    <>
                      <div className="rounded-lg border-2 border-tableBorder mt-5">
                        <table className="min-w-full bg-white rounded-lg relative mb-4 border-dropdownText">
                          <thead className="text-[12px] text-center text-dropdownText">
                            <tr className="bg-lightPink">
                              <th className="py-2 px-5 font-medium border-b border-tableBorder relative">
                                Salutation
                              </th>
                              <th className="py-2 px-5 font-medium border-b border-tableBorder relative">
                                First Name
                              </th>
                              <th className="py-2 px-4 font-medium border-b border-tableBorder relative">
                                Last Name
                              </th>
                              <th className="py-2 px-4 font-medium border-b border-tableBorder relative">
                                Email Address
                              </th>
                              <th className="py-2 px-4 font-medium border-b border-tableBorder relative">
                                Mobile
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-dropdownText text-center text-[13px]">
                            {rows.map((row, index) => (
                              <tr className="relative text-center" key={index}>
                                <td className="py-2.5 px- border-y border-tableBorder justify-center mt-4 gap-2 items-center flex-1">
                                <div className="relative w-full text-center ms-3">
                                    <select
                                      className="block  appearance-none w-full h-9  text-zinc-400 bg-white  text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                      value={row.salutation}
                                      onChange={(e) =>
                                        handleRowChange(
                                          index,
                                          "salutation",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="" className="text-gray">
                                        Select
                                      </option>
                                      <option value="Mr." className="text-gray">
                                        Mr.
                                      </option>
                                      <option
                                        value="Mrs."
                                        className="text-gray"
                                      >
                                        Mrs.
                                      </option>
                                      <option value="Ms." className="text-gray">
                                        Ms.
                                      </option>
                                      <option value="Dr." className="text-gray">
                                        Dr.
                                      </option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                      <CehvronDown color="gray" />
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2.5 px-4  border-y border-tableBorder">
                                  <input
                                    type="text"
                                    value={row.firstName}
                                    className="text-sm w-[100%] text-center rounded-md bg-white h-9 p-2 mx-4 text-[#818894]"
                                    placeholder="Value"
                                    onChange={(e) =>
                                      handleRowChange(
                                        index,
                                        "firstName",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className="py-2.5 px-4 border-y border-tableBorder flex-1">
                                  <input
                                    type="text"
                                    value={row.lastName}
                                    className="text-sm w-[100%] rounded-md text-center bg-white h-9 p-2 text-[#818894]"
                                    placeholder="Value"
                                    onChange={(e) =>
                                      handleRowChange(
                                        index,
                                        "lastName",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className="py-2.5 px-4 border-y border-tableBorder relative">
                                  <input
                                    type="text"
                                    value={row.email}
                                    className="text-sm w-[100%] rounded-md text-center bg-white h-9 p-2 text-[#818894]"
                                    placeholder="Value"
                                    onChange={(e) =>
                                      handleRowChange(
                                        index,
                                        "email",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className="py-2.5 px-4 border-y border-tableBorder relative">
                                  <input
                                    type="text"
                                    value={row.mobile}
                                    className="text-sm w-[100%] rounded-md text-center bg-white h-9 p-2 text-[#818894]"
                                    placeholder="Value"
                                    onChange={(e) =>
                                      handleRowChange(
                                        index,
                                        "mobile",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div
                        className="flex gap-2 text-darkRed font-bold items-center my-4 cursor-pointer"
                        onClick={addRow}
                      >
                        <PlusCircle color={"darkRed"} />
                        Add Contact Person
                      </div>
                    </>
                  )}
                  {activeTab === "remarks" && (
                    <div>
                      <div>
                        <label className="block mb-1">Remarks</label>
                        <textarea
                          rows={3}
                          className="pl-2 text-sm w-[100%]  rounded-md text-start bg-white border border-slate-300   p-2 text-[#818894]"
                          placeholder="Value"
                          name="remark"
                          value={customerdata.remark}
                          onChange={(e: any) => handleChange(e)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="flex justify-end gap-2 mb-3 m-5">
            <Button variant="primary" size="sm" onClick={handleEdit}>
              Save
            </Button>
            <Button onClick={closeModal} variant="secondary" size="sm">
              Cancel
            </Button>
          </div>
        </>
      </Modal>
    </div>
  );
};

export default EditCustomerModal;
