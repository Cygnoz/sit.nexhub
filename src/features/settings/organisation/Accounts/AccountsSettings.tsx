import { ChangeEvent, useEffect, useState } from "react";
import CehvronDown from "../../../../assets/icons/CehvronDown";
import Button from "../../../../Components/Button";
import Banner from "../../banner/Banner";
import { endponits } from "../../../../Services/apiEndpoints";
import useApi from "../../../../Hooks/useApi";
import toast, { Toaster } from "react-hot-toast";

interface AccountDetails {
  salesAccount: string;
  purchaseAccount: string;
  salesDiscountAccount: string;
  purchaseDiscountAccount: string;
  accountReceivableAccount: string;
  accountPayableAccount: string;
  outputCgst: string;
  outputSgst: string;
  outputIgst: string;
  outputVat: string;
  inputCgst: string;
  inputSgst: string;
  inputIgst: string;
  inputVat: string;
}

type Props = {};

function AccountsSettings({}: Props) {
  const [isVat, setIsVat] = useState(true);
  const [allAccounts, setAllAccounts] = useState<any>([]);
  const [tax, setTax] = useState<any>([]);
  const [accounts, setAccounts] = useState<any>([]);

  const { request: getAccounts } = useApi("get", 5001);
  const { request: addaccount } = useApi("post", 5004);
  const { request: getAccountData } = useApi("get", 5004);
  const { request: getTax } = useApi("get", 5004);

  const [inputData, setInputData] = useState<AccountDetails>({
    salesAccount: "",
    purchaseAccount: "",
    salesDiscountAccount: "",
    purchaseDiscountAccount: "",
    accountReceivableAccount: "",
    accountPayableAccount: "",
    outputCgst: "",
    outputSgst: "",
    outputIgst: "",
    outputVat: "",
    inputCgst: "",
    inputSgst: "",
    inputIgst: "",
    inputVat: "",
  });

  const handleToggle = () => {
    setIsVat(!isVat);
  };

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const url = `${endponits.ADD_DEFUALT_ACCOUNT}`;
      const { response, error } = await addaccount(url, inputData);
      if (!error && response) {
        toast.success(response.data.message);
      } else {
        toast.error(error.response.data.message);

        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async (
    url: string,
    setData: React.Dispatch<React.SetStateAction<any>>,
    fetchFunction: (url: string) => Promise<any>
  ) => {
    try {
      const { response, error } = await fetchFunction(url);
      if (!error && response) {
        setData(response.data);
        console.log(response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const taxUrl = `${endponits.GET_ALL_TAX}`;
    const allAccountsUrl = `${endponits.Get_ALL_Acounts}`;
    const getAccountUrl = `${endponits.GET_DEFUALT_ACCOUNT}`;

    const fetchAllData = async () => {
      await fetchData(taxUrl, setTax, getTax);
      await fetchData(allAccountsUrl, setAllAccounts, getAccounts);
      await fetchData(getAccountUrl, setAccounts, getAccountData);
    };

    fetchAllData();
  }, []);

  // Single useEffect for setting input data based on accounts
  useEffect(() => {
    if (accounts) {
      setInputData((prevData: any) => ({
        ...prevData,
        ...accounts,
      }));
    }
  }, [accounts]);

  return (
    <>
      <div className="m-4 overflow-y-scroll hide-scrollbar h-auto">
        <Banner seeOrgDetails />
        <div className="flex">
          <p className="mt-4 text-textColor">
            <b>Accounts</b>
          </p>
          <div className="ml-auto items-center justify-center mt-4">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isVat}
                  onChange={handleToggle}
                />
                <div
                  className={`w-11 h-6 rounded-full shadow-inner transition-colors ${
                    isVat ? "bg-checkBox" : "bg-dropdownBorder"
                  }`}
                ></div>
                <div
                  className={`dot absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                    isVat ? "transform translate-x-full left-2" : "left-1"
                  }`}
                ></div>
              </div>
            </label>
          </div>
        </div>

        <form>
          <div className="bg-white border-slate-200 border-2 rounded-md mt-4 p-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Default Sales Account */}
              <div className="relative">
                <label htmlFor="salesAccount" className="text-slate-600">
                  Default Sales Account
                </label>
                <div className="relative w-full mt-3">
                  <select
                    onChange={handleInputChange}
                    value={inputData.salesAccount}
                    name="salesAccount"
                    id="salesAccount"
                    className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  >
                    <option value="">Select Account</option>
                    {allAccounts
                      .filter((item: any) => item.accountSubhead === "Income")
                      .map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.accountName}
                        </option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>

              {/* Default Purchase Account */}
              <div>
                <label htmlFor="purchaseAccount" className="text-slate-600">
                  Default Purchase Account
                </label>
                <div className="w-full mt-2.5 relative">
                  <select
                    onChange={handleInputChange}
                    value={inputData.purchaseAccount}
                    name="purchaseAccount"
                    className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  >
                    <option value="">Select Account</option>
                    {allAccounts
                      .filter(
                        (item: any) =>
                          item.accountSubhead === "Cost of Goods Sold"
                      )
                      .map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.accountName}
                        </option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>

              {/* Sales Discount Account */}
              <div className="relative">
                <label
                  htmlFor="salesDiscountAccount"
                  className="text-slate-600"
                >
                  Sales Discount Account
                </label>
                <div className="relative w-full mt-3">
                  <select
                    onChange={handleInputChange}
                    value={inputData.salesDiscountAccount}
                    name="salesDiscountAccount"
                    className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  >
                    <option value="">Select Account</option>
                    {allAccounts
                      .filter((item: any) => item.accountSubhead === "Income")
                      .map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.accountName}
                        </option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>

              {/* Purchase Discount Account */}
              <div>
                <label
                  htmlFor="purchaseDiscountAccount"
                  className="text-slate-600 flex items-center gap-1"
                >
                  <p>Purchase Discount Account</p>
                </label>
                <div className="w-full mt-2.5 relative">
                  <select
                    onChange={handleInputChange}
                    value={inputData.purchaseDiscountAccount}
                    name="purchaseDiscountAccount"
                    className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  >
                    <option value="">Select Account</option>
                    {allAccounts
                      .filter((item: any) => item.accountSubhead === "Expense")
                      .map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.accountName}
                        </option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>

              {/* Account Receivable */}
              <div>
                <label
                  htmlFor="accountReceivableAccount"
                  className="text-slate-600 flex items-center gap-1"
                >
                  <p>Account Receivable</p>
                </label>
                <div className="w-full mt-2.5 relative">
                  <select
                    onChange={handleInputChange}
                    value={inputData.accountReceivableAccount}
                    name="accountReceivableAccount"
                    className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  >
                    <option value="">Select Account</option>
                    {allAccounts
                      .filter(
                        (item: any) =>
                          item.accountSubhead === "Accounts Receivable"
                      )
                      .map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.accountName}
                        </option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>

              {/* Account Payable */}
              <div>
                <label
                  htmlFor="accountPayableAccount"
                  className="text-slate-600 flex items-center gap-1"
                >
                  <p>Account Payable</p>
                </label>
                <div className="w-full mt-2.5 relative">
                  <select
                    onChange={handleInputChange}
                    value={inputData.accountPayableAccount}
                    name="accountPayableAccount"
                    className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  >
                    <option value="">Select Account</option>
                    {allAccounts
                      .filter(
                        (item: any) =>
                          item.accountSubhead === "Accounts Payable"
                      )
                      .map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.accountName}
                        </option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-textColor">
            <b>Tax Selection</b>
          </p>
          {tax.taxType !== "" && (
            <div className="bg-white border-slate-200 border-2 rounded-md mt-4 p-5">
              {tax.taxType == "GST" && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="relative">
                    <label htmlFor="location" className="text-slate-600">
                      Output Cgst
                    </label>
                    <div className="relative w-full mt-3">
                      <select
                        onChange={handleInputChange}
                        value={inputData.outputCgst}
                        name="outputCgst"
                        className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      >
                        <option value="">Select cgst</option>
                        {allAccounts
                          .filter(
                            (item: any) =>
                              item.accountSubhead === "Current Liability"
                          )
                          .map((item: any) => (
                            <option key={item._id} value={item._id}>
                              {item.accountName}
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <CehvronDown color="gray" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="organizationIndustry"
                      className="text-slate-600 flex items-center gap-1"
                    >
                      <p>Output Sgst</p>
                    </label>
                    <div className="w-full mt-2.5 relative">
                      <select
                        onChange={handleInputChange}
                        value={inputData.outputSgst}
                        name="outputSgst"
                        className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      >
                        <option value="">Select cgst</option>
                        {allAccounts
                          .filter(
                            (item: any) =>
                              item.accountSubhead === "Current Liability"
                          )
                          .map((item: any) => (
                            <option key={item._id} value={item._id}>
                              {item.accountName}
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <CehvronDown color="gray" />
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="location" className="text-slate-600">
                      Output Igst
                    </label>
                    <div className="relative w-full mt-3">
                      <select
                        onChange={handleInputChange}
                        value={inputData.outputIgst}
                        name="outputIgst"
                        className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      >
                        <option value="">Select Igst</option>
                        {allAccounts
                          .filter(
                            (item: any) =>
                              item.accountSubhead === "Current Liability"
                          )
                          .map((item: any) => (
                            <option key={item._id} value={item._id}>
                              {item.accountName}
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <CehvronDown color="gray" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="organizationIndustry"
                      className="text-slate-600 flex items-center gap-1"
                    >
                      <p>Input Cgst</p>
                    </label>
                    <div className="w-full mt-2.5 relative">
                      <select
                        onChange={handleInputChange}
                        value={inputData.inputCgst}
                        name="inputCgst"
                        className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      >
                        <option value="">Select cgst</option>
                        {allAccounts
                          .filter(
                            (item: any) =>
                              item.accountSubhead === "Current Asset"
                          )
                          .map((item: any) => (
                            <option key={item._id} value={item._id}>
                              {item.accountName}
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <CehvronDown color="gray" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="organizationIndustry"
                      className="text-slate-600 flex items-center gap-1"
                    >
                      <p>Input Sgst</p>
                    </label>
                    <div className="w-full mt-2.5 relative">
                      <select
                        onChange={handleInputChange}
                        value={inputData.inputSgst}
                        name="inputSgst"
                        className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      >
                        <option value="">Select Sgst</option>
                        {allAccounts
                          .filter(
                            (item: any) =>
                              item.accountSubhead === "Current Asset"
                          )
                          .map((item: any) => (
                            <option key={item._id} value={item._id}>
                              {item.accountName}
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <CehvronDown color="gray" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="organizationIndustry"
                      className="text-slate-600 flex items-center gap-1"
                    >
                      <p>Input Igst</p>
                    </label>
                    <div className="w-full mt-2.5 relative">
                      <select
                        onChange={handleInputChange}
                        value={inputData.inputIgst}
                        name="inputIgst"
                        className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      >
                        <option value="">Select Igst</option>
                        {allAccounts
                          .filter(
                            (item: any) =>
                              item.accountSubhead === "Current Asset"
                          )
                          .map((item: any) => (
                            <option key={item._id} value={item._id}>
                              {item.accountName}
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <CehvronDown color="gray" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {tax.taxType == "VAT" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="location" className="text-slate-600">
                      Input VAT
                    </label>
                    <div className="relative w-full mt-3">
                      <select
                        onChange={handleInputChange}
                        value={inputData.inputVat}
                        name="inputVat"
                        className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      >
                        <option value="">Select cgst</option>
                        {allAccounts
                          .filter(
                            (item: any) =>
                              item.accountSubhead === "Current Asset"
                          )
                          .map((item: any) => (
                            <option key={item._id} value={item._id}>
                              {item.accountName}
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <CehvronDown color="gray" />
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="location" className="text-slate-600">
                      Output VAT
                    </label>
                    <div className="relative w-full mt-3">
                      <select
                        onChange={handleInputChange}
                        value={inputData.outputVat}
                        name="outputVat"
                        className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      >
                        <option value="">Select cgst</option>
                        {allAccounts
                          .filter(
                            (item: any) =>
                              item.accountSubhead === "Current Liability"
                          )
                          .map((item: any) => (
                            <option key={item._id} value={item._id}>
                              {item.accountName}
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <CehvronDown color="gray" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      <div className="mt-6 flex justify-end mx-5">
        <Button
          // type="submit"
          onClick={handleSave}
          variant="primary"
          className="pl-10 pr-10"
          size="md"
        >
          Save
        </Button>
      </div>
      <Toaster position="top-center" reverseOrder={true} />
    </>
  );
}

export default AccountsSettings;
