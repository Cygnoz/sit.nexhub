import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Button from "../../../../Components/Button";
import CalenderIcon from "../../../../assets/icons/CalenderIcon";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import toast from "react-hot-toast";
type Props = {};
 
function VatSettings({}: Props) {
  const initialVatSettings = {
    taxType: "VAT",  
    vatNumber: "",
    vatBusinessLegalName: "",
    vatBusinessTradeName: "",
    vatRegisteredDate: "",
    tinNumber: "",
  };
 
  const [vatSettings, setVatSettings] = useState(initialVatSettings);
  const { request: fetchVatSettings } = useApi("get", 5004);
  const { request: createVatSettings } = useApi("post", 5004);

  // Fetch VAT settings
  const getVatSettings = async () => {
    try {
      const url = `${endponits.GET_ALL_TAX}`;
      const { response, error } = await fetchVatSettings(url);

      if (!error && response?.data) {
        setVatSettings((prevData) => ({
          ...prevData,
          vatNumber: response.data.vatNumber || "",
          vatBusinessLegalName: response.data.vatBusinessLegalName || "",
          vatBusinessTradeName: response.data.vatBusinessTradeName || "",
          vatRegisteredDate: response.data.vatRegisteredDate || "",
          tinNumber: response.data.tinNumber || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching VAT data:", error);
    }
  };

  useEffect(() => {
    getVatSettings();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVatSettings((prevVatSettings) => ({
      ...prevVatSettings,
      [name]: value,
    }));
  };
 
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = `${endponits.ADD_NEW_TAX}`;
      const body = vatSettings;
      const { response, error } = await createVatSettings(url, body);
      if (!error && response) {
        toast.success(response.data.message);
        setVatSettings(response.data);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
 
  const [isVatRegistered, setIsVatRegistered] = useState(true);
  const handleToggle = () => {
    setIsVatRegistered(!isVatRegistered);
  };
 
  return (
    <div>
      <p className="text-textColor font-bold">VAT Settings</p>
      <div
        className="p-6 mt-4 rounded-lg"
        style={{
          background: "linear-gradient(89.66deg, #E3E6D5 -0.9%, #F7E7CE 132.22%)",
        }}
      >
        <div className="flex justify-between items-center">
          <p className="text-base text-dropdownText">Is your business registered for VAT?</p>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={isVatRegistered}
                onChange={handleToggle}
              />
              <div
                className={`w-11 h-6 rounded-full shadow-inner transition-colors ${
                  isVatRegistered ? "bg-checkBox" : "bg-dropdownBorder"
                }`}
              ></div>
              <div
                className={`dot absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                  isVatRegistered ? "transform translate-x-full left-2" : "left-1"
                }`}
              ></div>
            </div>
            <div className="ml-3 text-textColor text-sm">
              {isVatRegistered ? "Yes" : "No"}
            </div>
          </label>
        </div>
      </div>
 
      <div>
        {isVatRegistered && (
          <div className="p-6 rounded-lg bg-white mt-4">
            <form onSubmit={onSubmit} className="flex justify-between gap-4">
              <div className="text-[#495160] text-sm w-[50%]">
                <div>
                  <label htmlFor="vatNumber">VAT Number</label>
                  <input
                    type="text"
                    name="vatNumber"
                    value={vatSettings.vatNumber}
                    onChange={handleChange}
                    className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                    placeholder="Enter VAT Number"
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="vatBusinessTradeName">Business Trade Name</label>
                  <input
                    type="text"
                    name="vatBusinessTradeName"
                    value={vatSettings.vatBusinessTradeName}
                    onChange={handleChange}
                    className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                    placeholder="Enter Business Trade Name"
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="tinNumber">TIN Number</label>
                  <input
                    type="text"
                    name="tinNumber"
                    value={vatSettings.tinNumber}
                    onChange={handleChange}
                    className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                    placeholder="Enter TIN Number"
                  />
                </div>
              </div>
 
              <div className="text-[#495160] text-sm w-[50%]">
                <div>
                  <label htmlFor="vatBusinessLegalName">Business Legal Name</label>
                  <input
                    type="text"
                    name="vatBusinessLegalName"
                    value={vatSettings.vatBusinessLegalName}
                    onChange={handleChange}
                    className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                    placeholder="Enter Business Legal Name"
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="vatRegisteredDate" className="block mb-1">
                    VAT Registered On
                  </label>
                  <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 flex items-center px-3 text-gray-700 w-[100%]">
                      <CalenderIcon color="#818894" />
                    </div>
                    <input
                      type="date"
                      name="vatRegisteredDate"
                      value={vatSettings.vatRegisteredDate}
                      onChange={handleChange}
                      className="text-sm w-[100%] ps-9 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                      placeholder="Select Date"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button size="sm" className="text-sm pl-10 pr-10" type="submit">
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
 
export default VatSettings;