import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import CalenderIcon from "../../../../assets/icons/CalenderIcon";
import Button from "../../../../Components/Button";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import toast from "react-hot-toast";

type GstSettingsProps = {};

function GstSettings({ }: GstSettingsProps) {

  const initialGstSettings = {
    taxType: "GST",
    gstIn: "",
    gstBusinesLegalName: "",
    gstBusinessTradeName: "",
    gstRegisteredDate: "",
    compositionSchema: "",
    reverseCharge:"",
    importExport:"",
    digitalServices:""
  };

  const [gstSettings, setGstSettings] = useState(initialGstSettings);
  const { request: fetchGstSettings } = useApi("get", 5004);
  const { request: createGstSettings } = useApi("post", 5004);

  // Fetch GST settings
  const getGstSettings = async () => {
    try {
      const url = `${endponits.GET_ALL_TAX}`;
      const { response, error } = await fetchGstSettings(url);

      if (!error && response?.data) {
        setGstSettings((prevData) => ({
          ...prevData,
          gstIn: response.data.gstIn || "",
          gstBusinesLegalName: response.data.gstBusinesLegalName || "",
          gstBusinessTradeName: response.data.gstBusinessTradeName || "",
          gstRegisteredDate: response.data.gstRegisteredDate || "",
          compositionSchema: response.data.compositionSchema || "",
          reverseCharge:response.data.reverseCharge || "",
          importExport: response.data.importExport || "",
          digitalServices: response.data.digitalServices || ""
        }));
      }
    } catch (error) {
      console.error("Error fetching GST data:", error);
    }
  };

  useEffect(() => {
    getGstSettings();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGstSettings((prevGstSettings) => ({
      ...prevGstSettings,
      [name]: value,
    }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = `${endponits.ADD_NEW_TAX}`;
      const body = gstSettings;
      const { response, error } = await createGstSettings(url, body);
      if (!error && response) {
        toast.success(response.data.message);
        setGstSettings((prev) => ({
          ...prev,
          gstIn: response.data.gstIn || prev.gstIn,
          gstBusinesLegalName: response.data.gstBusinesLegalName || prev.gstBusinesLegalName,
          gstBusinessTradeName: response.data.gstBusinessTradeName || prev.gstBusinessTradeName,
          gstRegisteredDate: response.data.gstRegisteredDate || prev.gstRegisteredDate,
          compositionSchema: response.data.compositionSchema || prev.compositionSchema,
          reverseCharge:response.data.reverseCharge || prev.reverseCharge,
          importExport: response.data.importExport || prev.importExport,
          digitalServices: response.data.digitalServices || prev.digitalServices
        }));
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const [isGstRegistered, setIsGstRegistered] = useState(true);
  const handleToggle = () => {
    setIsGstRegistered(!isGstRegistered);
  };

  return (
    <div>
      <p className="text-textColor font-bold">GST Settings</p>
      <div className="p-6 mt-4 rounded-lg" style={{
        background: 'linear-gradient(89.66deg, #E3E6D5 -0.9%, #F7E7CE 132.22%)',
      }}>
        <div className="flex justify-between items-center">
          <p className="text-base text-dropdownText">Is your business registered for GST?</p>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={isGstRegistered} onChange={handleToggle} />
              <div className={`w-11 h-6 rounded-full shadow-inner transition-colors ${isGstRegistered ? 'bg-checkBox' : 'bg-dropdownBorder'}`}></div>
              <div className={`dot absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${isGstRegistered ? 'transform translate-x-full left-2' : 'left-1'}`}></div>
            </div>
            <div className="ml-3 text-textColor  text-sm">{isGstRegistered ? 'Yes' : 'No'}</div>
          </label>
        </div>
      </div>
      <div>
        {isGstRegistered && (
          <div className="p-6 rounded-lg bg-white mt-4">
            <form onSubmit={onSubmit} className="flex justify-between gap-4">
              <div className="text-[#495160] text-sm w-[50%]">
                <div>
                  <label htmlFor="gstIn">GSTIN <span className="text-xs">(Maximum 15 Digits)</span></label>
                  <input
                    type="text"
                    name="gstIn"
                    value={gstSettings.gstIn}
                    onChange={handleChange}
                    className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                    placeholder="Enter GSTIN"
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="gstBusinessTradeName">Business Trade Name</label>
                  <input
                    type="text"
                    name="gstBusinessTradeName"
                    value={gstSettings.gstBusinessTradeName}
                    onChange={handleChange}
                    className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                    placeholder="Enter Business Trade Name"
                  />
                </div>
                <div className="mt-5">
                  <label className="block mb-1.5 text-dropdownText font-semibold">
                    Composite Scheme
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="accent-[#97998E] bg-white h-5 w-5"
                      id="compositionSchema"
                      name="compositionSchema"
                      value={gstSettings.compositionSchema}
                      checked={gstSettings.compositionSchema === "1"}
                      onChange={() =>
                        setGstSettings((prev) => ({
                          ...prev,
                          compositionSchema: prev.compositionSchema === "1" ? "0" : "1",
                        }))
                      }
                    />
                    <label htmlFor="compositionSchema" className="mt-0.5">
                      My business is registered for Composition Scheme.
                    </label>
                  </div>
                </div>
                <div className="mt-5">
                  <label className="block mb-1.5 text-dropdownText font-semibold">Import / Export</label>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="accent-[#97998E] bg-white h-5 w-5 " id="import/export"
                    name="import/export"
                    value={gstSettings.importExport}
                    checked={gstSettings.importExport === "1"}
                    onChange={() =>
                      setGstSettings((prev) => ({
                        ...prev,
                        importExport: prev.importExport === "1" ? "0" : "1",
                      }))
                    }
                    />
                    <label htmlFor="import/export" className="mt-0.5">
                      My business is involved in SEZ / Overseas Trading
                    </label>
                  </div>
                </div>
              </div>
              <div className="text-[#495160] text-sm w-[50%]">
                <div>
                  <label htmlFor="gstBusinesLegalName">Business Legal Name</label>
                  <input
                    type="text"
                    name="gstBusinesLegalName"
                    value={gstSettings.gstBusinesLegalName}
                    onChange={handleChange}
                    className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                    placeholder="Enter Business Legal Name"
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="gstRegisteredDate" className="block mb-1">
                    GST Registered On
                  </label>
                  <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0  flex items-center px-3 text-gray-700 w-[100%]">
                      <CalenderIcon color="#818894" />
                    </div>
                    <input
                      type="date"
                      name="gstRegisteredDate"
                      value={gstSettings.gstRegisteredDate}
                      onChange={handleChange}
                      className="text-sm w-[100%] ps-9 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                      placeholder="Select Date"
                    />
                  </div>
                  <div className="mt-5">
                    <label className="block mb-1.5 text-dropdownText font-semibold">Reverse Charge</label>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="accent-[#97998E] bg-white h-5 w-5 " id="reverseCharge" 
                        name="reverseCharge"
                        value={gstSettings.reverseCharge}
                        checked={gstSettings.reverseCharge === "1"}
                        onChange={() =>
                          setGstSettings((prev) => ({
                            ...prev,
                            reverseCharge: prev.reverseCharge === "1" ? "0" : "1",
                          }))
                        }
                      />
                      <label htmlFor="reverseCharge" className="mt-0.5">
                        My business is registered for Composition Scheme.
                      </label>
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="block mb-1.5 text-dropdownText font-semibold">Digital Services</label>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="accent-[#97998E] bg-white h-5 w-5 " id="digitalServices"
                         name="digitalServices"
                         value={gstSettings.digitalServices}
                         checked={gstSettings.digitalServices === "1"}
                         onChange={() =>
                           setGstSettings((prev) => ({
                             ...prev,
                             digitalServices: prev.digitalServices === "1" ? "0" : "1",
                           }))
                         } />
                      <label htmlFor="digitalServices" className="mt-0.5">
                        Track sale of digital services to overseas customers
                      </label>
                    </div>
                    <p className="w-[95%] mt-3 text-xs">Enabling this option will let you record and track export of digital services to individuals</p>
                    <div className="flex justify-end mt-6">
                      <Button size="sm" className="text-sm pl-10 pr-10" type="submit">Save</Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default GstSettings;
