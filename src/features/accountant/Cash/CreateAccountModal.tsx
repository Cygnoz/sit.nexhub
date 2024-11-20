import { useState, ChangeEvent, FormEvent } from "react";
import CashImage from "../../../assets/Images/Group 11.png";
import bgImage from "../../../assets/Images/14.png";
import Button from "../../../Components/Button";
import PlusCircle from "../../../assets/icons/PlusCircle";
import Modal from "../../../Components/model/Modal";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import toast from "react-hot-toast";
import { useContext } from "react";
import { cashResponseContext } from "../../../context/ContextShare"; 
import CehvronDown from "../../../assets/icons/CehvronDown";
type Props = {};

const CreateAccountModal = ({}: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const initialAccounts = {
    accountName: "",
    accountCode: "",
    accountSubhead: "Cash",
    accountHead: "Asset",
    accountGroup: "Asset",
    openingBalance: "",
    openingBalanceDate: "",
    description: "",
    debitOpeningBalance: "",
    creditOpeningBalance: "",
  };

  const [accounts, setAccounts] = useState(initialAccounts);
  const [openingType, setOpeningType] = useState("Debit");
  const { request: CreateAccount } = useApi("post", 5001);
  const { setCashResponse } = useContext(cashResponseContext)!;

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setAccounts(initialAccounts);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let processedValue = value;
  
    // If the value is negative and the field is openingBalance, reset it to 0
    if (name === "openingBalance" && parseFloat(value) < 0) {
      processedValue = "0";
    }
  
    // Update openingType and related balances accordingly
    if (name === "openingType") {
      setOpeningType(processedValue);
      setAccounts((prevFormValues) => ({
        ...prevFormValues,
        debitOpeningBalance: processedValue === "Debit" ? prevFormValues.openingBalance : "",
        creditOpeningBalance: processedValue === "Credit" ? prevFormValues.openingBalance : "",
      }));
    } else if (name === "openingBalance") {
      setAccounts((prevFormValues) => ({
        ...prevFormValues,
        debitOpeningBalance: openingType === "Debit" ? processedValue : prevFormValues.debitOpeningBalance,
        creditOpeningBalance: openingType === "Credit" ? processedValue : prevFormValues.creditOpeningBalance,
      }));
    } else {
      // Update any other fields normally
      setAccounts((prevBankAccount) => ({
        ...prevBankAccount,
        [name]: processedValue,
      }));
    }
  };
  

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = `${endponits.Add_NEW_ACCOUNT}`;
      const body = accounts;
      const { response, error } = await CreateAccount(url, body);
      
      if (!error && response) {
        toast.success(response.data.message);
        setCashResponse((prevCashResponse: any) => ({
          ...prevCashResponse,
          ...body,
        }));
        closeModal();
        setAccounts(initialAccounts);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button
        onClick={openModal}
        variant="primary"
        className="flex items-center justify-center"
        size="sm"
      >
        <span className="flex items-center ">
          <PlusCircle color="" /> &nbsp;&nbsp;<p className="text-sm">Create Account</p>
        </span>
      </Button>

      <Modal open={isModalOpen} onClose={closeModal} className="">
        <div className="p-5 mt-3">
          <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden">
            <div
              className="absolute top-0 -right-8 w-[px] h-[89px]"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-textColor">
                Create Cash Account
              </h3>
              <p className="text-dropdownText font-semibold text-sm mt-2">
                Set up your cash account effortlessly!
              </p>
            </div>
            <div
              className="ms-auto text-3xl cursor-pointer relative z-10"
              onClick={closeModal}
            >
              &times;
            </div>
          </div>

          <form className="flex justify-between" onSubmit={onSubmit}>
            <div className="mt-16 ms-3 ">
              <img width={250} height={130} src={CashImage} alt="Cash" />
            </div>
            <div className="w-[65%]">
              <div className="mb-4">
                <label className="block text-sm mb-1 text-labelColor">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={accounts.accountName}
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
                  value={accounts.accountCode}
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
                    className="text-sm w-[100%] rounded-r-md text-start bg-white border border-slate-300 h-9 p-2"
                    placeholder="Enter Opening Balance"
                    name="openingBalance"
                    value={
                      openingType === "Debit"
                        ? accounts.debitOpeningBalance
                        : accounts.creditOpeningBalance
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1 text-labelColor">
                  Description
                </label>
                <textarea
                  name="description"
                  value={accounts.description}
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

export default CreateAccountModal;
