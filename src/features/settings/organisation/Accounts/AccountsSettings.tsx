import CehvronDown from "../../../../assets/icons/CehvronDown";

import Button from "../../../../Components/Button";
import Banner from "../../banner/Banner";

// Define types for the props
interface InputData {
  organizationCountry: string;
  organizationIndustry: string;
}

interface AdditionalData {
  countryData: { name: string }[];
  industry: string[];
}

interface AccountsSettingsProps {
  inputData: InputData;
  additionalData: AdditionalData;
  handleInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const AccountsSettings: React.FC<AccountsSettingsProps> = ({
  inputData,
  additionalData,
  handleInputChange,
}) => {
  return (
    <div className="m-4 overflow-y-scroll hide-scrollbar h-auto">
      <Banner seeOrgDetails />
      <p className="mt-4 text-textColor">
        <b>Accounts</b>
      </p>

      <div className="bg-white border-slate-200 border-2 rounded-md mt-4 p-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Organization Location */}
          <div className="relative">
            <label htmlFor="location" className="text-slate-600">
              Default Sales Account
            </label>
            <div className="relative w-full mt-3">
              <select
                value={inputData.organizationCountry}
                onChange={handleInputChange}
                name="defaultsales"
                id="sales"
                className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              >
                <option value="">Select Account</option>
                {additionalData.countryData && additionalData.countryData.length > 0 ? (
                  additionalData.countryData.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No accounts available</option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
            </div>
          </div>

          {/* Industry */}
          <div>
            <label
              htmlFor="organizationIndustry"
              className="text-slate-600 flex items-center gap-1"
            >
              <p>Default Purchase Account</p>
            
            </label>
            <div className="w-full mt-2.5 relative">
              <select
                value={inputData.organizationIndustry}
                onChange={handleInputChange}
                name="organizationIndustry"
                id="organizationIndustry"
                className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              >
                <option value="">Select Account</option>
                {additionalData.industry && additionalData.industry.length > 0 ? (
                  additionalData.industry.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))
                ) : (
                  <option disabled>No accounts available</option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
            </div>
          </div>
          <div className="relative">
            <label htmlFor="location" className="text-slate-600">
              Default Discount Account
            </label>
            <div className="relative w-full mt-3">
              <select
                value={inputData.organizationCountry}
                onChange={handleInputChange}
                name="defaultdiscount"
                id="discount"
                className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              >
                <option value="">Select Account</option>
                {additionalData.countryData && additionalData.countryData.length > 0 ? (
                  additionalData.countryData.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No accounts available</option>
                )}
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
              <p>Purchase Discount Account</p>
            
            </label>
            <div className="w-full mt-2.5 relative">
              <select
                value={inputData.organizationIndustry}
                onChange={handleInputChange}
                name="organizationIndustry"
                id="organizationIndustry"
                className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              >
                <option value="">Select Account</option>
                {additionalData.industry && additionalData.industry.length > 0 ? (
                  additionalData.industry.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))
                ) : (
                  <option disabled>No accounts available</option>
                )}
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
              <p>Account Recievable</p>
            
            </label>
            <div className="w-full mt-2.5 relative">
              <select
                value={inputData.organizationIndustry}
                onChange={handleInputChange}
                name="organizationIndustry"
                id="organizationIndustry"
                className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              >
                <option value="">Select Account</option>
                {additionalData.industry && additionalData.industry.length > 0 ? (
                  additionalData.industry.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))
                ) : (
                  <option disabled>No accounts available</option>
                )}
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
              <p>Account Payable</p>
            
            </label>
            <div className="w-full mt-2.5 relative">
              <select
                value={inputData.organizationIndustry}
                onChange={handleInputChange}
                name="organizationIndustry"
                id="organizationIndustry"
                className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              >
                <option value="">Select Account</option>
                {additionalData.industry && additionalData.industry.length > 0 ? (
                  additionalData.industry.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))
                ) : (
                  <option disabled>No accounts available</option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
            </div>
          </div>
        </div>


        {/* Save Button */}
        {/* <div className="mt-6 flex justify-end">
        <Button
  type="submit"
  variant="primary"
  className="pl-10 pr-10"
  style={{ borderRadius: '12px' }} // Inline style for 10px border radius
  size="md"
>
  

    Save
  </Button>
</div> */}

      </div>
      <p className="mt-4 text-textColor">
        <b>Tax Selection</b>
      </p>
      <div className="bg-white border-slate-200 border-2 rounded-md mt-4 p-5">
        <div className="grid grid-cols-3 gap-4">
          {/* Organization Location */}
          <div className="relative">
            <label htmlFor="location" className="text-slate-600">
             Output Cgst
            </label>
            <div className="relative w-full mt-3">
              <select
                value={inputData.organizationCountry}
                onChange={handleInputChange}
                name="defaultsales"
                id="sales"
                className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              >
                <option value="">Select cgst</option>
                {additionalData.countryData && additionalData.countryData.length > 0 ? (
                  additionalData.countryData.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No accounts available</option>
                )}
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
                value={inputData.organizationIndustry}
                onChange={handleInputChange}
                name="organizationIndustry"
                id="organizationIndustry"
                className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              >
                <option value="">Select cgst</option>
                {additionalData.industry && additionalData.industry.length > 0 ? (
                  additionalData.industry.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))
                ) : (
                  <option disabled>No accounts available</option>
                )}
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
                value={inputData.organizationCountry}
                onChange={handleInputChange}
                name="defaultdiscount"
                id="discount"
                className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              >
                <option value="">Select Igst</option>
                {additionalData.countryData && additionalData.countryData.length > 0 ? (
                  additionalData.countryData.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No accounts available</option>
                )}
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
                value={inputData.organizationIndustry}
                onChange={handleInputChange}
                name="organizationIndustry"
                id="organizationIndustry"
                className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              >
                <option value="">Select cgst</option>
                {additionalData.industry && additionalData.industry.length > 0 ? (
                  additionalData.industry.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))
                ) : (
                  <option disabled>No accounts available</option>
                )}
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
                value={inputData.organizationIndustry}
                onChange={handleInputChange}
                name="organizationIndustry"
                id="organizationIndustry"
                className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              >
                <option value="">Select Sgst</option>
                {additionalData.industry && additionalData.industry.length > 0 ? (
                  additionalData.industry.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))
                ) : (
                  <option disabled>No accounts available</option>
                )}
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
                value={inputData.organizationIndustry}
                onChange={handleInputChange}
                name="organizationIndustry"
                id="organizationIndustry"
                className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              >
                <option value="">Select Igst</option>
                {additionalData.industry && additionalData.industry.length > 0 ? (
                  additionalData.industry.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))
                ) : (
                  <option disabled>No accounts available</option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
            </div>
          </div>
        </div>


        {/* Save Button */}
        <div className="mt-6 flex justify-end">
        <Button
  type="submit"
  variant="primary"
  className="pl-10 pr-10"
  style={{ borderRadius: '12px' }} // Inline style for 10px border radius
  size="md"
>
  

    Save
  </Button>
</div>

      </div>

    </div>
  );
};

export default AccountsSettings;
