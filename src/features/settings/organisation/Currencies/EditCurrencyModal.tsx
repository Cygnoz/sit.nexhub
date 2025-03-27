import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import Modal from "../../../../Components/model/Modal";
import CehvronDown from "../../../../assets/icons/CehvronDown";
import Button from "../../../../Components/Button";
import Pen from "../../../../assets/icons/Pen";
import CurrencyBro from "../../../../assets/Images/Currency-bro 1.png";
import topImg from "../../../../assets/Images/14.png";
import { endponits } from "../../../../Services/apiEndpoints";
import useApi from "../../../../Hooks/useApi";
import toast from "react-hot-toast";
import { CurrencyResponseContext } from "../../../../context/ContextShare";

interface InputCurrencyData {
  currencyCode: string;
  currencySymbol: string;
  currencyName: string;
  decimalPlaces: string;
  format: string;
  currencyId: string;
}

const EditCurrencyModal = ({ selectedCurrency }: { selectedCurrency: any }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { request: editCurrency } = useApi("put", 7004);
  const { setCurrencyResponse } = useContext(CurrencyResponseContext)!;
  const [errors, setErrors] = useState({
    currencyCode: false,
    currencySymbol: false,
    currencyName: false,
 
  });

  const [newCurrency, setNewCurrency] = useState<InputCurrencyData>({
    currencyCode: "",
    currencySymbol: "",
    currencyName: "",
    decimalPlaces: "",
    format: "",
    currencyId: "",
  });

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewCurrency((prevCurrencyAccount) => ({
      ...prevCurrencyAccount,
      [name]: value,
    }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { currencyCode, currencyName, currencySymbol } = newCurrency;
    let isValid = true;

    // Update error states and check for empty fields
    if (!currencyCode || !currencyName || !currencySymbol) {
      if (!currencyCode) {
        setErrors((prevErrors) => ({ ...prevErrors, currencyCode: true }));
        isValid = false;
      }
      if (!currencyName) {
        setErrors((prevErrors) => ({ ...prevErrors, currencyName: true }));
        isValid = false;
      }
      if (!currencySymbol) {
        setErrors((prevErrors) => ({ ...prevErrors, currencySymbol: true }));
        isValid = false;
      }
    }

    // If there are errors, stop submission
    if (!isValid) return;

    try {
      const url = `${endponits.EDIT_CURRENCIES}`;
      const { response, error } = await editCurrency(url, newCurrency);

      if (error) {
        // Handle error by checking if error response exists
        const errorMessage =
          error?.response?.data?.message || "An error occurred while editing currency.";
        toast.error(errorMessage);
        return;
      }

      if (response) {
        closeModal();
        console.log("Currency edited successfully:", response.data);

        // Show success toast
        toast.success(response.data);

        // Update currency response state
        setCurrencyResponse((prevCurrencyResponse: any) => ({
          ...prevCurrencyResponse,
          ...newCurrency,
        }));
      }
    } catch (error) {
      // Catch any other errors and log them
      console.error("Error occurred while editing currency:", error);
      toast.error("An unexpected error occurred.");
    }
  };


  useEffect(() => {
    if (selectedCurrency) {
      setNewCurrency({
        currencyCode: selectedCurrency.currencyCode,
        currencySymbol: selectedCurrency.currencySymbol,
        currencyName: selectedCurrency.currencyName,
        decimalPlaces: selectedCurrency.decimalPlaces,
        format: selectedCurrency.format,
        currencyId: selectedCurrency._id,
      });
    }
  }, [selectedCurrency]);

  return (
    <>
      <div onClick={openModal}>
        <Pen color={"blue"} />
      </div>

      <Modal open={isModalOpen} onClose={closeModal}  className="w-[90%] sm:w-[68%] h-auto">
        <div className="p-5 mt-3 text-start">
          <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden">
            <div
              className="absolute top-0 -right-8 w-[178px] h-[89px]"
              style={{
                backgroundImage: `url(${topImg})`,
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="relative">
              <h3 className="text-xl font-bold text-textColor">
                Edit Currency
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
              <img alt="" src={CurrencyBro} />
            </div>
            <div className="col-span-9 space-y-2">
              <div className="relative w-full mt-3">
                <label
                  className="block text-sm mb-1 text-labelColor"
                  htmlFor="currencyCode"
                >
                  Currency Code
                </label>
                <div className="relative w-full mt-1">
                   <input
                required
                  type="text"
                  name="currencyCode"
                  value={newCurrency.currencyCode}
                  onChange={handleChange}
                  placeholder="Value"
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                  onFocus={() =>
                    setErrors({ ...errors, currencyCode: false })
                  }
                  onBlur={() => {
                    if (newCurrency.currencyCode === "") {
                      setErrors({ ...errors, currencyCode: true });
                    }
                  }}
                />
                {errors.currencyCode && (
                  <div className="text-red-800 text-xs mt-1">
                    Enter Currency Code
                  </div>
                )}
            </div>
            </div>
                  
               
            
              <div className="mb-4">
                <label
                  className="block text-sm mb-1 text-labelColor"
                  htmlFor="currencySymbol"
                >
                  Currency Symbol
                </label>
                <input
                  required
                    type="text"
                    name="currencySymbol"
                    value={newCurrency.currencySymbol}
                    onChange={handleChange}
                    placeholder="Value"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                    onFocus={() =>
                      setErrors({ ...errors, currencySymbol: false })
                    }
                    onBlur={() => {
                      if (newCurrency.currencySymbol === "") {
                        setErrors({ ...errors, currencySymbol: true });
                      }
                    }}
                  />
                  {errors.currencySymbol && (
                    <div className="text-red-800 text-xs mt-1">
                      Enter Currency Symbol
                    </div>
                  )}
              </div>

              <div className="mb-2 mt-4">
                <label className="block text-sm mb-1 text-labelColor">
                  Currency Name
                </label>
                <input
                  required
                    type="text"
                    name="currencyName"
                    value={newCurrency.currencyName}
                    onChange={handleChange}
                    placeholder="Value"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                    onFocus={() =>
                      setErrors({ ...errors,currencyName: false })
                    }
                    onBlur={() => {
                      if (newCurrency.currencyName === "") {
                        setErrors({ ...errors,currencyName: true });
                      }
                    }}
                  />
                  {errors.currencyName&& (
                    <div className="text-red-800 text-xs mt-1">
                      Enter Currency Name
                    </div>
                  )}
                </div>
              

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="col-span-1">
            <div className="relative w-full ">
              <label className="block text-sm mb-1 text-labelColor">
                Decimal Places
              </label>
              <div className="relative w-full mt-1">
                <select
                  name="decimalPlaces"
                  id="decimalPlaces"
                  onChange={handleChange}
                  value={newCurrency.decimalPlaces}
                  className="block appearance-none w-full text-zinc-400 bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                >
                  <option value="">Select Decimal Places</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="relative w-full">
              <label className="block text-sm mb-1 text-labelColor">
                Format
              </label>
              <div className="relative w-full mt-1">
                <select
                  name="format"
                  id="format"
                  onChange={handleChange}
                  value={newCurrency.format}
                  className="block appearance-none w-full text-zinc-400 bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                >
                  <option value="">Select Format Value</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
            </div>
          </div>
        </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  onClick={closeModal}
                  variant="secondary"
                  className="h-[38px] w-[120px] flex justify-center"
                >
                  <p className="text-sm">Cancel</p>
                </Button>
                <Button
                  onClick={onSubmit}
                  variant="primary"
                  className="h-[38px] w-[120px] flex justify-center"
                >
                  <p className="text-sm">Save</p>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default EditCurrencyModal;
