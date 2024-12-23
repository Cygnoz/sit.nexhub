import { useState, useEffect, useRef } from "react";
import Button from "../../../../../../Components/Button";
import PlusCircle from "../../../../../../assets/icons/PlusCircle";
import Modal from "../../../../../../Components/model/Modal";
import CehvronDown from "../../../../../../assets/icons/CehvronDown";
import { endponits } from "../../../../../../Services/apiEndpoints";
import useApi from "../../../../../../Hooks/useApi";
import NewUnit from "../../../../../inventory/Unit/NewUnit";
import toast from "react-hot-toast";

const initialItemDataState = {
  _id: "",
  itemType: "goods",
  itemName: "",
  unit: "",
  taxPreference: "",
  taxExemptReason: "",
  sellingPrice: "",
  taxRate: "",
  purchaseDescription:""
};

const AddNewItem = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isService, setIsService] = useState<boolean>(false);
  const [itemsData, setItemsData] = useState<[] | any>(initialItemDataState);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [unitList, setUnitList] = useState<[] | any>([]);
  const [taxRate, setTaxRate] = useState<[] | any>([]);
  const { request: getUnit } = useApi("get", 5003);
  const { request: getTaxRate } = useApi("get", 5004);
  const { request: addItem } = useApi("post", 5003);


  const toggleDropdown = (key: string | null) => {
    setOpenDropdownIndex(key === openDropdownIndex ? null : key);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpenDropdownIndex(null);
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
      } else {
        console.error(`Error fetching from ${url}:`, error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDropdownSelect = (key: string, value: string) => {
  setItemsData((prev:any) => ({
      ...prev,
      [key]: value,
    }));
    setOpenDropdownIndex(null);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    if (type === "number" && parseFloat(value) < 0) {
      return;
    }

    setItemsData((prev: any) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave= async()=>{
    try {
      const url = `${endponits.ADD_ITEM}`
      const {response,error}= await addItem(url,itemsData)
      if(!error && response){
        toast.success(response.data.message)
        closeModal()
      }
      else{
        toast.error(error.response.data.message)

      }
    } catch (error) {
      toast.success(`Something went wong ${error}`)

    }
  }

  const handleClose=()=>{
    setItemsData(initialItemDataState)
    closeModal()
  }

  useEffect(() => {
    const unitURl = `${endponits.GET_ALL_UNIT}`;
    const taxUrl = `${endponits.GET_ALL_TAX}`;

    fetchData(taxUrl, setTaxRate, getTaxRate);
    fetchData(unitURl, setUnitList, getUnit);
  }, []);

  useEffect(() => {
    if (openDropdownIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownIndex]);

console.log(itemsData,"itemsdata")



  return (
    <div>
      <div className="flex items-center justify-center">
        <Button
          variant="primary"
          size="sm"
          onClick={openModal}
          className="px-[80%]"
        >
          <PlusCircle color="white" />
          <p className="text-sm font-medium">Create</p>
        </Button>
      </div>

      <Modal open={isModalOpen} onClose={closeModal} className="w-[40%] ">
        <div className="p-5 mt-3">
          <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative  ">
            <div className="absolute top-0 -right-8 w-[178px] h-[89px]"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-textColor">Add New Item</h3>
            </div>
            <div
              className="ms-auto text-3xl cursor-pointer relative z-10"
              onClick={closeModal}
            >
              &times;
            </div>
          </div>

          <form className="text-start space-y-3 overflow-y-scroll hide-scrollbar">
            <div>
              <label className="block text-sm text-labelColor" htmlFor="itemType">
                Item Type
              </label>
              <div className="flex items-center space-x-4 text-textColor text-sm">
                <div className="flex gap-2 justify-center items-center">
                  <input
                    id="goods"
                    type="radio"
                    name="itemType"
                    value="goods"
                    checked={!isService}
                    onChange={() => setIsService(false)}
                    className="w-5 h-5 rounded-full border border-1 border-[#97998E]"
                  />
                  <label htmlFor="goods" className="text-start font-medium mt-1">
                    Goods
                  </label>
                </div>

                <div className="flex gap-2 justify-center items-center">
                  <input
                    id="service"
                    type="radio"
                    name="itemType"
                    value="service"
                    checked={isService}
                    onChange={() => setIsService(true)}
                    className="w-5 h-5 rounded-full border border-1 border-[#97998E]"
                  />
                  <label htmlFor="service" className="text-start font-medium mt-1">
                    Service
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 text-sm mb-0.5" htmlFor="itemName">
                Name
              </label>
              <input
                className="pl-3 text-sm w-[100%] mt-0.5 rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Enter Name"
                name="itemName"
                value={itemsData.itemName}
                onChange={handleInputChange}
              />
            </div>

            <div className="relative col-span-3 mt-3">
              <label htmlFor="unit-input" className="text-slate-600 flex items-center gap-2">
                Unit
              </label>
              <div className="relative w-full ">
                <input
                  id="unit-input"
                  type="text"
                  value={itemsData.unit}
                  readOnly
                  className="cursor-pointer appearance-none mt-0.5 w-full items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  placeholder="Select Unit"
                  onClick={() => toggleDropdown("unit")}
                />
                <div className="cursor-pointer pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
              {openDropdownIndex === "unit" && (
                <div
                  ref={dropdownRef}
                  className="absolute w-[100%] z-10 bg-white rounded-md mt-1 p-2 space-y-1 border border-inputBorder"
                >

                  {unitList &&
                    unitList.map((unit: any, index: number) => (
                      <div
                        key={index}
                        onClick={() => handleDropdownSelect("unit", unit)}
                        className="flex p-2 w-[100%]  hover:bg-gray-100 cursor-pointer border rounded-lg bg-lightPink border-slate-300 text-sm text-textColor"
                      >
                        {unit.unitName}
                      </div>
                    ))}
                  <NewUnit page="item" />
                </div>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="taxPreference"
                className="text-slate-600 text-sm flex items-center gap-2"
              >
                Tax Preference
              </label>
              <select
                className="block appearance-none w-full mt-0.5 text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                name="taxPreference"
                value={itemsData.taxPreference}
                onChange={handleInputChange}
              >
                <option value="" disabled hidden>
                  Select Tax Preference
                </option>
                <option value="Taxable">Taxable</option>
                <option value="Non-taxable">Non-Taxable</option>
              </select>
              <div className="cursor-pointer pointer-events-none absolute inset-y-0 mt-5 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
            </div>

          { itemsData.taxPreference==="Taxable" && 
           <div className="relative mt-4">
              <label
                htmlFor="taxRate"
                className="text-slate-600 text-sm flex items-center gap-2"
              >
                Tax Rate
              </label>
              <div className="relative w-full ">
                <input
                  id="taxRate-input"
                  type="text"
                  value={itemsData.taxRate}
                  readOnly
                  className="cursor-pointer appearance-none w-full items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  placeholder="Select Tax Rate"
                  onClick={() => toggleDropdown("taxRate")}
                />
                <div className="cursor-pointer pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
              {openDropdownIndex === "taxRate" && (
                <div
                  ref={dropdownRef}
                  className="absolute w-[100%] z-10 bg-white rounded-md mt-1 p-2 space-y-1 border border-inputBorder"
                >
                  {taxRate.gstTaxRate &&
                    taxRate.gstTaxRate.map((rate: any, index: number) => (
                      <div
                        key={index}
                        onClick={() => handleDropdownSelect("taxRate", rate.taxName)}
                        className="flex p-2 w-[100%] mb-4 hover:bg-gray-100 cursor-pointer border-b border-slate-300 text-sm text-textColor hover:bg-lightPink"
                      >
                        {rate.taxName}
                      </div>
                    ))}
                </div>
              )}
            </div>}

          {  itemsData.taxPreference==="Non-Taxable" && <div>
              <label className="block text-slate-600 text-sm mb-0.5" htmlFor="itemName">
                Exemption Reason
              </label>
              <input
                className="pl-3 text-sm w-[100%] mt-0.5 rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Exemption Reason"
                name="taxExemptReason"
                value={itemsData.taxExemptReason}
                onChange={handleInputChange}
              />
            </div>}

            <div>
              <label className="block text-slate-600 text-sm mb-0.5" htmlFor="itemName">
           Selling Price
              </label>
              <input
  className="pl-3 text-sm w-[100%] mt-0.5 rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
  placeholder="Enter selling price"
  name="sellingPrice"
  value={itemsData.sellingPrice}
  type="number"
  min="0" 
  step="0.01" 
  onChange={(e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setItemsData((prevData:any) => ({
        ...prevData,
        [e.target.name]: value,
      }));
    }
  }}
/>

            </div>
            <div>
              <label className="block text-slate-600 text-sm mb-0.5" htmlFor="itemName">
             Description
              </label>
              <input
                className="pl-3 text-sm w-[100%] mt-0.5 rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Enter Description"
                name="purchaseDescription"
                value={itemsData.purchaseDescription}
                onChange={handleInputChange}
              />
            </div>
          </form>
          <div className="justify-end me-5 flex gap-4 p-2">
                    <Button variant="secondary" size="sm" className="text-sm pl-8 pr-8" onClick={handleClose}>
                      Cancel
                    </Button>
                  <Button
                    onClick={handleSave}
                    variant="primary"
                    size="sm"
                    className="text-sm pl-8 pr-8"
                  >
                    Save
                  </Button>
                </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddNewItem;
