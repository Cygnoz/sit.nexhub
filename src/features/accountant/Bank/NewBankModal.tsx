import { useState, ChangeEvent, FormEvent, useContext,} from "react";
import Button from "../../../Components/Button";
import Modal from "../../../Components/model/Modal";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import bgImage from "../../../assets/Images/14.png";
import savings from "../../../assets/Images/Savings.png";
import CehvronDown from "../../../assets/icons/CehvronDown";
import PlusCircle from "../../../assets/icons/PlusCircle";
// import BankHome from "./BankHome";
import { BankResponseContext } from "../../../context/ContextShare";
import toast from "react-hot-toast";
// import { useOrganization } from "../../../context/OrganizationContext";

type Props = {};

const initialBankAccount = {
  accountName: "",
  accountCode: "",
  accountSubhead: "Bank",
  accountHead: "Asset",
  accountGroup: "Asset",
  openingBalance: "",
  openingBalanceDate: "",
  description: "",
  bankAccNum: "",
  bankIfsc: "",
  bankCurrency: "",
  debitOpeningBalance: "",
  creditOpeningBalance: "",
};

const NewBankModal = ({ }: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [bankAccount, setBankAccount] = useState(initialBankAccount);
  const [openingType, setOpeningType] = useState("Debit");
  const { setBankResponse } = useContext(BankResponseContext)!;
  const { request: CreateAccount } = useApi("post", 5001);
  // const {organization}=nization()
  const openModal = () => {
    setModalOpen(true);
    getcurrencyData()
  };
  const [currencyData, setcurrencyData] = useState<any | []>([]);
  const { request: getCurrencyData } = useApi("get", 5004);
  const getcurrencyData = async () => {
    try {
      const url = `${endponits.GET_CURRENCY_LIST}`;
      const { response, error } = await getCurrencyData(url);
      if (!error && response) {
        setcurrencyData(response.data);
        setBankAccount({ ...bankAccount, bankCurrency: response.data.find((item: any) => item.baseCurrency).currencyCode })
      }
    } catch (error) {
      console.log("Error in fetching currency data", error);
    }
  };



  const closeModal = () => {
    setModalOpen(false);
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let processedValue = value;

    // If the value is negative, reset it to 0
    if (name === "openingBalance" && parseFloat(value) < 0) {
      processedValue = "0";
    }

    // Update openingType and related balances accordingly
    if (name === "openingType") {
      setOpeningType(processedValue);
      setBankAccount((prevFormValues) => ({
        ...prevFormValues,
        debitOpeningBalance: processedValue === "Debit" ? prevFormValues.openingBalance : "",
        creditOpeningBalance: processedValue === "Credit" ? prevFormValues.openingBalance : "",
      }));
    } else if (name === "openingBalance") {
      setBankAccount((prevFormValues) => ({
        ...prevFormValues,
        debitOpeningBalance: openingType === "Debit" ? processedValue : prevFormValues.debitOpeningBalance,
        creditOpeningBalance: openingType === "Credit" ? processedValue : prevFormValues.creditOpeningBalance,
      }));
    } else {
      setBankAccount((prevBankAccount) => ({
        ...prevBankAccount,
        [name]: processedValue,
      }));
    }
  };


  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = `${endponits.Add_NEW_ACCOUNT}`;
      const body = bankAccount;
      const { response, error } = await CreateAccount(url, body);
      if (!error && response) {
        toast.success(response.data.message);
        setBankResponse((prevBankResponse: any) => ({
          ...prevBankResponse,
          ...body,
        }));
        closeModal()
        setBankAccount(initialBankAccount);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };




  return (
    <div>
      <Button onClick={openModal} variant="primary" size="xl">
        <PlusCircle color="white" />{" "}
        <p className="text-sm font-medium">Create Account</p>
      </Button>

      <Modal open={isModalOpen} onClose={closeModal} className="w-[68%]">
        <div className="p-5 mt-3">
          <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden">
            <div
              className="absolute top-0 -right-8 w-[178px] h-[89px]"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-textColor">
                Create Bank Account
              </h3>
              <p className="text-dropdownText font-semibold text-sm mt-2">
                Open a new bank account swiftly and securely.
              </p>
            </div>
            <div
              className="ms-auto text-3xl cursor-pointer relative z-10"
              onClick={closeModal}
            >
              &times;
            </div>
          </div>

          <form className="grid grid-cols-12 gap-4" onSubmit={onSubmit}>
            <div className="mt-12 col-span-3 justify-items-center ">
              <img src={savings} alt="" />
            </div>
            <div className="col-span-9">
              <div className="mb-4">
                <label className="block text-sm mb-1 text-labelColor">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={bankAccount.accountName}
                  onChange={handleChange}
                  placeholder="Value"
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-labelColor">
                  Account Code
                </label>
                <input
                  type="text"
                  name="accountCode"
                  value={bankAccount.accountCode}
                  onChange={handleChange}
                  placeholder="Value"
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-labelColor text-sm">Opening Balance</label>
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
                    type="number"
                    min={0}
                    className="text-sm w-[100%] rounded-r-md text-start bg-white border border-slate-300 h-9 p-2"
                    placeholder="Enter Opening Balance"
                    name="openingBalance"
                    value={
                      openingType === "Debit"
                        ? bankAccount.debitOpeningBalance
                        : bankAccount.creditOpeningBalance
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-labelColor">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="bankAccNum"
                    value={bankAccount.bankAccNum}
                    onChange={handleChange}
                    placeholder="Value"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-labelColor">
                    IFSC
                  </label>
                  <input
                    type="text"
                    name="bankIfsc"
                    value={bankAccount.bankIfsc}
                    onChange={handleChange}
                    placeholder="Value"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-labelColor">
                    Currency
                  </label>
                  <div className="relative">
                    <div className="relative w-full">
                      <select
                        name="bankCurrency"
                        value={bankAccount.bankCurrency}
                        onChange={handleChange}
                        className="block appearance-none w-full text-zinc-400 bg-white border border-slate-200 text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      >
                        {currencyData?.map((data: any) => (
                          <option
                            key={data._id}
                            value={data.currencyCode}
                            selected={data.currencyName} // Set as selected if baseCurrency is true
                            className="text-slate-300"
                          >
                            {`${data.currencyName} (${data.currencySymbol})`}
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
              <div className="mb-4">
                <label className="block text-sm mb-1 text-labelColor">
                  Description
                </label>
                <textarea
                  name="description"
                  value={bankAccount.description}
                  onChange={handleChange}
                  placeholder="Value"
                  className="border-inputBorder w-full text-sm border rounded p-2 pt-5 pl-2"
                />
              </div>
              <br />
              <div className="flex justify-end gap-2 mb-3">
                <Button onClick={closeModal} className="pl-10 pr-10" variant="secondary" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="pl-10 pr-10" size="sm">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default NewBankModal;
