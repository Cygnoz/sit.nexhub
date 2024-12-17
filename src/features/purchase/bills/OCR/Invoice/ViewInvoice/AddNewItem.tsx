import { useState } from "react";
import Button from "../../../../../../Components/Button";
import PlusCircle from "../../../../../../assets/icons/PlusCircle";
import Modal from "../../../../../../Components/model/Modal";
import CehvronDown from "../../../../../../assets/icons/CehvronDown";
import bgImage from "../../../../../../assets/Images/14.png";

const AddNewItem = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <div>
      <div className="flex items-center justify-center ">
        <Button
          variant="primary"
          size="sm"
          onClick={openModal}
          className=" px-[80%] "
        >
          <PlusCircle color="white" />{" "}
          <p className="text-sm font-medium">Create</p>
        </Button>
      </div>

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

          <form className="grid grid-cols-12 gap-4">
            <div className="mt-12 col-span-3 justify-items-center ">
              {/* <img src={savings} alt="" /> */}
            </div>
            <div className="col-span-9">
              <div className="mb-4">
                <label className="block text-sm mb-1 text-labelColor">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
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
                  placeholder="Value"
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-labelColor text-sm">
                  Opening Balance
                </label>
                <div className="flex">
                  <div className="relative w-20 ">
                    <select
                      className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder 
                                   text-sm pl-2 pr-2 rounded-l-md leading-tight 
                                   focus:outline-none focus:bg-white focus:border-gray-500"
                      name="openingType"
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
                        className="block appearance-none w-full text-zinc-400 bg-white border border-slate-200 text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      ></select>
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
                  placeholder="Value"
                  className="border-inputBorder w-full text-sm border rounded p-2 pt-5 pl-2"
                />
              </div>
              <br />
              <div className="flex justify-end gap-2 mb-3">
                <Button
                  onClick={closeModal}
                  className="pl-10 pr-10"
                  variant="secondary"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="pl-10 pr-10"
                  size="sm"
                >
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

export default AddNewItem;
