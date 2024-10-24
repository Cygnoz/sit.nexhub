import { ChangeEvent, useContext, useEffect, useState } from "react";
import Banner from "../banner/Banner";
import toast from "react-hot-toast";
import useApi from "../../../Hooks/useApi";
import { settingsdataResponseContext } from "../../../context/ContextShare";
import Button from "../../../Components/Button";
import { endponits } from "../../../Services/apiEndpoints";

interface CustomerSupplierSettings {
  duplicateSupplierDisplayName: boolean;
  duplicateSupplierEmail: boolean;
  duplicateSupplierMobile: boolean;
  duplicateCustomerDisplayName: boolean;
  duplicateCustomerEmail: boolean;
  duplicateCustomerMobile: boolean;
}

const CustomerAndSupplier = () => {
  const { settingsResponse, getSettingsData } = useContext(
    settingsdataResponseContext
  )!;
  const { request: saveSettings } = useApi("put", 5009);
  const [inputData, setInputData] = useState<CustomerSupplierSettings>({
    duplicateSupplierDisplayName: false,
    duplicateSupplierEmail: false,
    duplicateSupplierMobile: false,
    duplicateCustomerDisplayName: false,
    duplicateCustomerEmail: false,
    duplicateCustomerMobile: false,
  });

  useEffect(() => {
    getSettingsData();
  }, []);

  useEffect(() => {
    if (settingsResponse) {
      setInputData((prevData) => ({
        ...prevData,
        ...settingsResponse?.data?.customerSupplierSettings,
      }));
    }
  }, [settingsResponse]);
  console.log(settingsResponse.data);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleSave = async () => {
    try {
      const url = `${endponits.Customer_Supplier_prefreance}`;
      const { response, error } = await saveSettings(url, inputData);
      if (!error && response) {
        toast.success(response?.data);
      } else {
        toast.error(error?.response?.data?.message);
      }
    } catch (error) {
      console.error("Something went wrong", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="m-4 text-[#303F58]">
      <Banner />
      <p className="text-[20px] font-bold mt-3">Customer and Supplier</p>
      <div className="bg-white w-full p-6 mt-6 text-[14px] rounded-lg space-y-3">
        <p className="font-bold">Duplicate Supplier Settings</p>
        <div className="flex items-center space-x-2 mt-3">
          <input
            type="checkbox"
            name="duplicateSupplierDisplayName"
            checked={inputData.duplicateSupplierDisplayName}
            onChange={handleInputChange}
          />
          <label className="font-medium">
            Don't allow duplicate supplier display names
          </label>
        </div>
        <div className="flex items-center space-x-2 mt-3">
          <input
            type="checkbox"
            name="duplicateSupplierEmail"
            checked={inputData.duplicateSupplierEmail}
            onChange={handleInputChange}
          />
          <label className="font-medium">
            Don't allow duplicate supplier emails
          </label>
        </div>
        <div className="flex items-center space-x-2 mt-3">
          <input
            type="checkbox"
            name="duplicateSupplierMobile"
            checked={inputData.duplicateSupplierMobile}
            onChange={handleInputChange}
          />
          <label className="font-medium">
            Don't allow duplicate supplier mobile numbers
          </label>
        </div>
      </div>
      <div className="bg-white w-full p-6 mt-5 text-[14px] rounded-lg space-y-3">
        <p className="font-bold">Duplicate Customer Settings</p>
        <div className="flex items-center space-x-2 mt-3">
          <input
            type="checkbox"
            name="duplicateCustomerDisplayName"
            checked={inputData.duplicateCustomerDisplayName}
            onChange={handleInputChange}
          />
          <label className="font-medium">
            Don't allow duplicate customer display names
          </label>
        </div>
        <div className="flex items-center space-x-2 mt-3">
          <input
            type="checkbox"
            name="duplicateCustomerEmail"
            checked={inputData.duplicateCustomerEmail}
            onChange={handleInputChange}
          />
          <label className="font-medium">
            Don't allow duplicate customer emails
          </label>
        </div>
        <div className="flex items-center space-x-2 mt-3">
          <input
            type="checkbox"
            name="duplicateCustomerMobile"
            checked={inputData.duplicateCustomerMobile}
            onChange={handleInputChange}
          />
          <label className="font-medium">
            Don't allow duplicate customer mobile numbers
          </label>
        </div>
      </div>
      <Button
        onClick={handleSave}
        variant="primary"
        className="h-[38px] w-[120px] mt-4 flex justify-center float-end"
      >
        <p className="text-sm">Save</p>
      </Button>
    </div>
  );
};

export default CustomerAndSupplier;
