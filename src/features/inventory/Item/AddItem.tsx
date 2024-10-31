import { Link, useLocation, useNavigate } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import Plus from "../../../assets/icons/Plus";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import CehvronDown from "../../../assets/icons/CehvronDown";
import CircleHelp from "../../../assets/icons/CircleHelp";
import Button from "../../../Components/Button";
import SearchBar from "../../../Components/SearchBar";
import BrandModal from "../Brand/BrandModal";
import SettingsIcons from "../../../assets/icons/SettingsIcon";
import RackModal from "../Rack/RackModal";
import NewManufacture from "../Manufature/NewManufacture";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import toast from "react-hot-toast";
import CategoryModal from "../Category/CategoryModal";
import NewUnit from "../Unit/NewUnit";

type Props = {};


interface ItemSettings {
  itemDuplicateName: boolean;
  hsnSac: boolean;
  hsnDigits: string;
}

interface ItemsData {
  bmcrData: {
    brandNames: string[];
    manufacturers: string[];
    categories: string[];
    racks: string[];
  };
  taxRate: TaxRate[];
  unitName: string[];
  organization: Organization;
  itemSettings?: ItemSettings;
}

interface TaxRate {
  taxName: string;
}

interface Organization {
  baseCurrency: string;
  timeZoneExp?: string;
  dateFormatExp?: string;
}

const initialItemDataState = {
  _id: "",
  itemType: "goods",
  itemName: "",
  itemImage: "",
  sku: "",
  unit: "",
  returnableItem: false,
  hsnCode: "",
  sac: "",
  taxPreference: "",
  taxExemptReason: "",
  productUsage: "",
  length: "",
  width: "",
  height: "",
  dimensionUnit: "",
  warranty: "",
  weight: "",
  weightUnit: "",
  manufacturer: "",
  brand: "",
  categories: "",
  rack: "",
  upc: "",
  mpn: "",
  ean: "",
  isbn: "",
  baseCurrency: "",
  sellingPrice: "",
  saleMrp: "",
  salesAccount: " ",
  salesDescription: "",
  costPrice: "",
  purchaseAccount: "",
  purchaseDescription: "",
  preferredVendor: "",
  taxRate: "",
  trackInventory: false,
  inventoryAccount: "",
  openingStock: "",
  openingStockRatePerUnit: "",
  reorderPoint: "",
  currentStock: "",
  status: "",
};

const AddItem = ({ }: Props) => {
  const [initialItemData, setInitialItemData] = useState(initialItemDataState);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isService, setIsService] = useState<boolean>(false);
  const [isRackModalOpen, setIsRackModalOpen] = useState(false);
  const [searchValueManufacturer, setSearchValueManufacturer] =
    useState<string>("");
  const [searchValueBrand, setSearchValueBrand] = useState<string>("");
  const [searchValueCategory, setSearchValueCategory] = useState<string>("");
  const [searchValueRack, setSearchValueRack] = useState<string>("");
  const [searchValueTaxRate, setSearchValueTaxRate] = useState<string>("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isManufatureModalOpen, setIsManufatureModalOpen] = useState(false);

  useEffect(() => {
    fetchAllItems();
    fetchAllItemName();
  }, []);
  // useEffect(() => {
  //   window.scrollTo({
  //     top: 165,
  //     behavior: "smooth",
  //   });
  // }, []);

  const [itemsData, setItemsData] = useState<ItemsData>({
    bmcrData: {
      brandNames: [],
      manufacturers: [],
      categories: [],
      racks: [],
    },
    taxRate: [],
    unitName: [],
    organization: { baseCurrency: "" },
  });

  const { request: AllItems } = useApi("get", 5003);
  const fetchAllItems = async () => {
    try {
      const url = `${endponits.GET_ALL_ITEMS_Dropdown}`;
      const { response, error } = await AllItems(url);
      if (!error && response) {
        setItemsData(response.data);
        console.log(response.data, "As");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const [itemsDataName, setItemsDataName] = useState<string[]>([]);
  const { request: GetAllItemsName } = useApi("get", 5003);

  const fetchAllItemName = async () => {
    try {
      const url = `${endponits.GET_ALL_ITEM}`;
      const { response, error } = await GetAllItemsName(url);
      if (!error && response) {
        const itemNames = response.data
          .map((item: any) => item.itemName)
          .filter(Boolean);
        setItemsDataName(itemNames);
      } else {
        console.error("Error in response:", error);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    if (type === "number" && parseFloat(value) < 0) {
      return;
    }

    setInitialItemData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setInitialItemData((prevDetails: any) => ({
          ...prevDetails,
          itemImage: base64String,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const toggleDropdown = (key: string | null) => {
    setOpenDropdownIndex(key === openDropdownIndex ? null : key);
    fetchAllItems();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdownIndex(null);
      setSearchValueManufacturer("");
      setSearchValueBrand("");
      setSearchValueCategory("");
      setSearchValueRack("");
      setSearchValueTaxRate("");
    }
  };

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

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

  const handleDropdownSelect = (key: string, value: string) => {
    setInitialItemData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setOpenDropdownIndex(null);
  };
  const [errors, setErrors] = useState({
    itemName: false,
    sellingPrice: false,
  });

  const navigate = useNavigate();

  const { request: CreateItem } = useApi("post", 5003);
  const { request: UpdateItem } = useApi("put", 5003); // For editing

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    // Validation checks
    const newErrors = {
      itemName: !initialItemData.itemName,
      sellingPrice: !initialItemData.sellingPrice,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      toast.error("Please fill in all required fields.");
      return;
    }
    // Check for duplicate item names if adding a new item
    if (!selectedItem && itemsData?.itemSettings?.itemDuplicateName === false) {
      if (itemsDataName.includes(initialItemData.itemName)) {
        toast.error("Item with this name already exists.");
        return;
      }
    }
    try {
      const url = selectedItem
        ? `${endponits.UPDATE_ITEM}/${selectedItem._id}`
        : `${endponits.ADD_ITEM}`;
      const body = initialItemData;
      const apiRequest = selectedItem ? UpdateItem : CreateItem;
      const { response, error } = await apiRequest(url, body);
      if (!error && response) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/inventory/Item");
          setInitialItemData(initialItemDataState);
        }, 500);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const location = useLocation();
  const selectedItem = location.state?.item;
  useEffect(() => {
    if (selectedItem) {
      setInitialItemData({
        _id: selectedItem._id,
        itemType: selectedItem.itemType || "",
        itemName: selectedItem.itemName || "",
        itemImage: selectedItem.itemImage || "",
        sku: selectedItem.sku || "",
        unit: selectedItem.unit || "",
        returnableItem: selectedItem.returnableItem || false,
        hsnCode: selectedItem.hsnCode || "",
        sac: selectedItem.sac || "",
        taxPreference: selectedItem.taxPreference || "",
        taxExemptReason: selectedItem.taxExemptReason || "",
        productUsage: selectedItem.productUsage || "",
        length: selectedItem.length || "",
        width: selectedItem.width || "",
        height: selectedItem.height || "",
        dimensionUnit: selectedItem.dimensionUnit || "",
        warranty: selectedItem.warranty || "",
        weight: selectedItem.weight || "",
        weightUnit: selectedItem.weightUnit || "",
        manufacturer: selectedItem.manufacturer || "",
        brand: selectedItem.brand || "",
        categories: selectedItem.categories || "",
        rack: selectedItem.rack || "",
        upc: selectedItem.upc || "",
        mpn: selectedItem.mpn || "",
        ean: selectedItem.ean || "",
        isbn: selectedItem.isbn || "",
        baseCurrency: selectedItem.baseCurrency || "",
        sellingPrice: selectedItem.sellingPrice || "",
        saleMrp: selectedItem.saleMrp || "",
        salesAccount: selectedItem.salesAccount || "",
        salesDescription: selectedItem.salesDescription || "",
        costPrice: selectedItem.costPrice || "",
        purchaseAccount: selectedItem.purchaseAccount || "",
        purchaseDescription: selectedItem.purchaseDescription || "",
        preferredVendor: selectedItem.preferredVendor || "",
        taxRate: selectedItem.taxRate || "",
        trackInventory: selectedItem.trackInventory || false,
        inventoryAccount: selectedItem.inventoryAccount || "",
        openingStock: selectedItem.openingStock || "",
        openingStockRatePerUnit: selectedItem.openingStockRatePerUnit || "",
        reorderPoint: selectedItem.reorderPoint || "",
        currentStock: selectedItem.currentStock || "",
        status: selectedItem.status || "",
      });
      if (selectedItem.itemType === "service") {
        setIsService(true);
      } else {
        setIsService(false);
      }
    }
  }, [selectedItem]);
  const hsnSac = location.state?.hsnSac;

  return (
    <>
      <div className="bg-white mx-5 p-6 rounded-lg overflow-scroll hide-scrollbar">
        <div className="flex gap-5">
          <Link to={"/inventory/Item"}>
            <div className="flex justify-center items-center h-11 w-11 bg-[#F3F3F3] rounded-full">
              <CheveronLeftIcon />
            </div>
          </Link>
          <div className="flex justify-center items-center">
            <h4 className="font-bold text-xl text-textColor ">New Item</h4>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 my-2">
          {/* Add Image */}
          <div className="col-span-2">
            <div className="   h-36 border border-inputBorder border-dashed rounded-lg items-center justify-center flex text-center">

              <label htmlFor="image">
                <div
                  className={`bg-lightPink flex items-center justify-center h-16 w-36 rounded-lg ${initialItemData.itemImage ? "h-[90px] rounded-b-none" : ""
                    }`}
                >
                  {initialItemData.itemImage ? (
                    <img src={initialItemData.itemImage} alt="Item" className="max-h-20 max-w-40" />
                  ) : (
                    <div className="flex gap-4 justify-center items-center">
                      <div className="bg-darkRed rounded-full  flex items-center p-0.5 justify-center">
                        <Plus color={"white"} classname="" />
                      </div>
                      <p className="text-xs">Add Image</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-extrabold text-textColor mt-1 text-sm">
                    Upload Item Image
                  </p>
                  <p className="text-[55%] text-[#818894] mt-1">Support: JPG, PNG</p>
                </div>
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  name="itemImage"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>

            </div>
          </div>



          <div className="col-span-10 -mt-4">
            <div className="flex justify-center items-center">

              <div>
                <label
                  className="block text-sm text-labelColor"
                  htmlFor="itemType"
                >
                  Item Type
                </label>
                <div className="flex items-center space-x-4 text-textColor text-sm">
                  <div className="flex gap-2 justify-center items-center">
                    <div
                      className="grid place-items-center mt-1"
                      onClick={() => {
                        setInitialItemData((prev) => ({
                          ...prev,
                          itemType: "goods",
                        }));
                        setIsService(false);
                      }}
                    >
                      <input
                        id="goods"
                        type="radio"
                        name="itemType"
                        value="goods"
                        className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${initialItemData.itemType === "goods"
                          ? "border-8 border-[#97998E]"
                          : "border-1 border-[#97998E]"
                          }`}
                        checked={initialItemData.itemType === "goods"} // "Goods" will be checked by default
                        onChange={handleInputChange}
                      />
                      <div
                        className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${initialItemData.itemType === "goods"
                          ? "bg-neutral-50"
                          : "bg-transparent"
                          }`}
                      />
                    </div>
                    <label
                      htmlFor="goods"
                      className="text-start font-medium mt-1"
                    >
                      Goods
                    </label>
                  </div>

                  <div className="flex gap-2 justify-center items-center">
                    <div
                      className="grid place-items-center mt-1"
                      onClick={() => {
                        setInitialItemData((prev) => ({
                          ...prev,
                          itemType: "service",
                        }));
                        setIsService(true);
                      }}
                    >
                      <input
                        id="service"
                        type="radio"
                        name="itemType"
                        value="service"
                        className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${initialItemData.itemType === "service"
                          ? "border-8 border-[#97998E]"
                          : "border-1 border-[#97998E]"
                          }`}
                        checked={initialItemData.itemType === "service"}
                        onChange={handleInputChange}
                      />
                      <div
                        className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${initialItemData.itemType === "service"
                          ? "bg-neutral-50"
                          : "bg-transparent"
                          }`}
                      />
                    </div>
                    <label
                      htmlFor="service"
                      className="text-start font-medium mt-1"
                    >
                      Service
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 ms-5">
                <div className="grid grid-cols-2 gap-4 mt-3 col-span-9">
                  <div>
                    <label className="text-slate-600 text-sm" htmlFor="itemName">
                      Name
                      <input
                        className="pl-3 text-sm w-[100%] mt-0.5 rounded-md text-start  bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                        placeholder="Enter Name"
                        name="itemName"
                        value={initialItemData.itemName}
                        onChange={handleInputChange}
                      />
                      {errors.itemName && (
                        <div className="text-red-800 text-xs  ms-1">
                          Item name is required
                        </div>
                      )}
                    </label>
                  </div>

                  <div>
                    <label
                      className="text-slate-600 flex items-center gap-2"
                      htmlFor="sku"
                    >
                      SKU
                      <div
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="relative"
                      >
                        <CircleHelp />
                        {tooltipVisible && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 pl-5  w-60 py-1 bg-gray text-white text-xs rounded-md">
                            The stock keeping unit of the item
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      className="pl-3 text-sm w-[100%] mt-0.5 rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      placeholder="Enter SKU"
                      name="sku"
                      value={initialItemData.sku}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="relative col-span-3 mt-3">
                  <label
                    htmlFor="unit-input"
                    className="text-slate-600 flex items-center gap-2"
                  >
                    Unit
                    {/* <CircleHelp /> */}
                  </label>
                  <div className="relative w-full ">
                    <input
                      id="unit-input"
                      type="text"
                      value={initialItemData.unit}
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
                      {itemsData.unitName &&
                        itemsData.unitName.map((unit: string, index: number) => (
                          <div
                            key={index}
                            onClick={() => handleDropdownSelect("unit", unit)}
                            className="flex p-2 w-[100%] mb-4 hover:bg-gray-100 cursor-pointer border-b border-slate-300 text-sm  text-textColor"
                          >
                            {unit}
                            <div className="ml-auto text-2xl cursor-pointer relative -mt-2 pe-2">
                              &times;
                            </div>
                          </div>
                        ))}
                      <NewUnit page="item" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 ">
              {hsnSac &&
                (isService ? (
                  <div>
                    <label
                      className="text-slate-600 flex text-sm items-center gap-2"
                      htmlFor="sac"
                    >
                      SAC
                    </label>
                    <input
                      className="pl-3 text-sm w-[100%]  rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      placeholder="SAC"
                      name="sac"
                      value={initialItemData.sac}
                      onChange={handleInputChange}
                      maxLength={
                        Number(itemsData?.itemSettings?.hsnDigits) || 6
                      }
                    />
                  </div>
                ) : (
                  <div>
                    <label
                      className="text-slate-600 flex text-sm items-center gap-2"
                      htmlFor="hsnCode"
                    >
                      HSN Code
                    </label>
                    <input
                      className="pl-3 text-sm w-[100%] mt-0.5 rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      placeholder="Enter HSN code"
                      name="hsnCode"
                      value={initialItemData.hsnCode}
                      onChange={handleInputChange}
                      maxLength={
                        Number(itemsData?.itemSettings?.hsnDigits) || 6
                      }
                    />
                  </div>
                ))}

              <div className="relative">
                <label
                  htmlFor="taxPreference"
                  className="text-slate-600 text-sm flex items-center gap-2"
                >
                  Tax Preference
                </label>
                <div className="relative w-full ">
                  <select
                    className="block appearance-none w-full mt-0.5 text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    name="taxPreference"
                    value={initialItemData.taxPreference}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled hidden>
                      Select Tax Preference
                    </option>
                    <option value="Taxable">Taxable</option>
                    <option value="Non-taxable">Non-taxable</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>
              {initialItemData.taxPreference === "Non-taxable" && (
                <div className="">
                  <div className="">
                    <div>
                      <label
                        className="text-slate-600 flex text-sm items-center gap-2"
                        htmlFor="productUsage"
                      >
                        Tax Exempt Reason{" "}
                        <span className="text-red-600 font-semibold">*</span>
                      </label>
                      <input
                        className="pl-3 text-sm w-[100%]  rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                        placeholder="Enter a reason"
                        name="taxExemptReason"
                        value={initialItemData.taxExemptReason}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
              {initialItemData.taxPreference === "Taxable" && (
                <div className="relative">
                  <label
                    htmlFor="taxRate-input"
                    className="text-slate-600 text-sm flex items-center gap-2"
                  >
                    Tax Rate
                  </label>
                  <div className="relative w-full ">
                    <input
                      id="taxRate-input"
                      type="text"
                      value={initialItemData.taxRate}
                      readOnly
                      className="cursor-pointer appearance-none w-full mt-0.5 items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      placeholder="Select State Tax Rate"
                      onClick={() => toggleDropdown("taxRate")}
                    />
                    <div className="cursor-pointer pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>

                  {openDropdownIndex === "taxRate" && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-full space-y-1"
                    >
                      <div className="mb-2.5">
                        <SearchBar
                          searchValue={searchValueTaxRate}
                          onSearchChange={setSearchValueTaxRate}
                          placeholder="Select Tax Rate"
                        />
                      </div>

                      {itemsData.taxRate
                        .filter((tax: TaxRate) =>
                          tax.taxName
                            .toLowerCase()
                            .includes(searchValueTaxRate.toLowerCase())
                        )
                        .map((tax, index) => (
                          <div
                            key={index}
                            onClick={() =>
                              handleDropdownSelect("taxRate", tax.taxName)
                            }
                            className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                          >
                            <div className="col-span-10 flex">
                              <div>
                                <p className="font-bold text-sm">
                                  {tax.taxName}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      <Link to={"/settings/taxes"}>
                        <div className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4 px-4 text-darkRed flex text-sm gap-2 font-bold">
                          <SettingsIcons color="darkRed" bold={2} />
                          <p className="mt-0.5">Manage Tax Rates</p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              )}

            </div>
            {!isService && (
              <div className="flex items-center mt-3  gap-1 text-textColor">
                <input
                  type="checkbox"
                  className="accent-[#97998E] bg-white h-5 w-4 mx-1 my-1"
                  id="checkbox3"
                  name="returnableItem"
                  checked={initialItemData.returnableItem}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="checkbox3"
                  className="text-textColor text-sm font-semibold"
                >
                  Returnable Item
                </label>
              </div>
            )}

          </div>
        </div>


        
        <p className="text-textColor text-base font-semibold mt-2">
        Storage Information
            </p>
        {!isService &&
          <div className="grid grid-cols-12 gap-4 items-center">
       
            <div className="col-span-4">
              <label className="block text-xs text-labelColor">
                Dimensions
              </label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                <input
                  type="number"
                  className="text-sm rounded-md pl-3 bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  placeholder="Length"
                  name="length"
                  value={initialItemData.length}
                  onChange={handleInputChange}
                  min={0}
                />
                <input
                  type="number"
                  min={0}
                  className="text-sm rounded-md pl-3 bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  placeholder="Width"
                  name="width"
                  value={initialItemData.width}
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  min={0}
                  className="text-sm rounded-md pl-3 bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  placeholder="Height"
                  name="height"
                  value={initialItemData.height}
                  onChange={handleInputChange}
                />
                <div className="relative">
                  <select
                    name="dimensionUnit"
                    className="text-sm appearance-none rounded-md w-full pl-3 text-zinc-400 bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    value={initialItemData.dimensionUnit}
                    onChange={handleInputChange}
                  >
                    <option value="CM">CM</option>
                    <option value="MM">MM</option>
                    <option value="Inch">Inch</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label
                className="text-slate-600 flex text-sm items-center gap-2"
                htmlFor="warranty"
              >
                Warranty
              </label>
              <select
                name="warranty"
                className="block w-full text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                value={initialItemData.warranty}
                onChange={handleInputChange}
              >
                <option value="">Select Warranty</option>
                <option value="6 months">6 months</option>
                <option value="1 year">1 year</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-slate-600 text-sm" htmlFor="weight">
                Weight
              </label>
              <div className="flex">
                <input
                  type="number"
                  min={0}
                  className="pl-3 text-sm w-full rounded-l-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  placeholder="Weight"
                  name="weight"
                  value={initialItemData.weight}
                  onChange={handleInputChange}
                />
                <div className="relative w-24">
                  <select
                    name="weightUnit"
                    className="block w-full appearance-none text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-7 rounded-r-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    value={initialItemData.weightUnit}
                    onChange={handleInputChange}
                  >
                    <option value="KG">KG</option>
                    <option value="G">G</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }







        <div className="grid grid-cols-2 gap-4 ">

          <div className="relative">
            <label
              htmlFor="manufacturer-input"
              className="text-slate-600 text-sm flex items-center gap-2"
            >
              Manufacturer
            </label>
            <div className="relative w-full ">
              <input
                id="manufacturer-input"
                type="text"
                value={initialItemData.manufacturer}
                readOnly
                className="cursor-pointer appearance-none w-full items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Select or add Manufacturer"
                onClick={() => toggleDropdown("manufacturer")}
              />
              <div className="cursor-pointer pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
            </div>
            {openDropdownIndex === "manufacturer" && (
              <div
                ref={dropdownRef}
                className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[50%] space-y-1"
              >
                <div className="mb-2.5">
                  <SearchBar
                    searchValue={searchValueManufacturer}
                    onSearchChange={setSearchValueManufacturer}
                    placeholder="Select Manufacturer"
                  />
                </div>
                {itemsData.bmcrData.manufacturers
                  .filter((manufacturer: string) =>
                    manufacturer
                      .toLowerCase()
                      .includes(searchValueManufacturer.toLowerCase())
                  )
                  .map((manufacturer: string, index: number) => (
                    <div
                      key={index}
                      onClick={() =>
                        handleDropdownSelect("manufacturer", manufacturer)
                      }
                      className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                    >
                      <div className="col-span-10 flex">
                        <div>
                          <p className="font-bold text-sm">
                            {manufacturer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                <div
                  onClick={() => setIsManufatureModalOpen(true)}
                  className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4 px-4 text-darkRed flex text-sm gap-2 font-bold"
                >
                  <SettingsIcons color="darkRed" bold={2} />
                  <p className="mt-0.5">Manage Manufacturer</p>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="brand-input"
              className="text-slate-600 text-sm flex items-center gap-2"
            >
              Brand
            </label>
            <div className="relative w-full ">
              <input
                id="brand-input"
                type="text"
                value={initialItemData.brand}
                readOnly
                className="cursor-pointer appearance-none w-full items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Select or add Brand"
                onClick={() => toggleDropdown("brand")}
              />
              <div className="cursor-pointer pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
            </div>
            {openDropdownIndex === "brand" && (
              <div
                ref={dropdownRef}
                className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[50%] space-y-1"
              >
                <div className="mb-2.5">
                  <SearchBar
                    searchValue={searchValueBrand}
                    onSearchChange={setSearchValueBrand}
                    placeholder="Select Brand"
                  />
                </div>
                {itemsData.bmcrData.brandNames
                  .filter((brand: string) =>
                    brand
                      .toLowerCase()
                      .includes(searchValueBrand.toLowerCase())
                  )
                  .map((brand: string, index: number) => (
                    <div
                      key={index}
                      onClick={() => handleDropdownSelect("brand", brand)}
                      className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                    >
                      <div className="col-span-10 flex">
                        <div>
                          <p className="font-bold text-sm">{brand}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                <div
                  onClick={() => setIsBrandModalOpen(true)}
                  className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4 px-4 text-darkRed flex text-sm gap-2 font-bold"
                >
                  <SettingsIcons color="darkRed" bold={2} />
                  <p className="mt-0.5">Manage Brand</p>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="category-input"
              className="text-slate-600 text-sm flex items-center gap-2"
            >
              Category
            </label>
            <div className="relative w-full ">
              <input
                id="category-input"
                type="text"
                value={initialItemData.categories}
                readOnly
                className="cursor-pointer appearance-none w-full items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Select or add Category"
                onClick={() => toggleDropdown("category")}
              />
              <div className="cursor-pointer pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
            </div>
            {openDropdownIndex === "category" && (
              <div
                ref={dropdownRef}
                className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[50%] space-y-1"
              >
                <div className="mb-2.5">
                  <SearchBar
                    searchValue={searchValueCategory}
                    onSearchChange={setSearchValueCategory}
                    placeholder="Select Category"
                  />
                </div>
                {itemsData.bmcrData.categories
                  .filter((category: string) =>
                    category
                      .toLowerCase()
                      .includes(searchValueCategory.toLowerCase())
                  )
                  .map((category: string, index: number) => (
                    <div
                      key={index}
                      onClick={() =>
                        handleDropdownSelect("categories", category)
                      }
                      className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                    >
                      <div className="col-span-10 flex">
                        <div>
                          <p className="font-bold text-sm">{category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                <div
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4 px-4 text-darkRed flex text-sm gap-2 font-bold"
                >
                  <SettingsIcons color="darkRed" bold={2} />
                  <p className="mt-0.5">Manage Category</p>
                </div>
              </div>
            )}
          </div>

          {!isService ? (
            <div className="relative">
              <label
                htmlFor="rack-input"
                className="text-slate-600 text-sm flex items-center gap-2"
              >
                Rack
              </label>
              <div className="relative w-full ">
                <input
                  id="rack-input"
                  type="text"
                  value={initialItemData.rack}
                  readOnly
                  className="cursor-pointer appearance-none w-full items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  placeholder="Select or add Rack"
                  onClick={() => toggleDropdown("rack")}
                />
                <div className="cursor-pointer pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
              {openDropdownIndex === "rack" && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[50%] space-y-1"
                >
                  <div className="mb-2.5">
                    <SearchBar
                      searchValue={searchValueRack}
                      onSearchChange={setSearchValueRack}
                      placeholder="Select Rack"
                    />
                  </div>
                  {itemsData.bmcrData.racks
                    .filter((rack: string) =>
                      rack.toLowerCase().includes(searchValueRack.toLowerCase())
                    )
                    .map((rack: string, index: number) => (
                      <div
                        key={index}
                        onClick={() => handleDropdownSelect("rack", rack)}
                        className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                      >
                        <div className="col-span-10 flex">
                          <div>
                            <p className="font-bold text-sm">{rack}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  <div
                    onClick={() => setIsRackModalOpen(true)}
                    className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4 px-4 text-darkRed flex text-sm gap-2 font-bold"
                  >
                    <SettingsIcons color="darkRed" bold={2} />
                    <p className="mt-0.5">Manage Rack</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div></div>
          )}
        </div>

        <div className="grid grid-flow-col-dense  gap-4">

          <div>
            <label
              className="text-slate-600 flex text-sm items-center gap-2"
              htmlFor="upc"
            >
              UPC
            </label>
            <input
              className="pl-3 text-sm w-[100%]  rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              placeholder="Enter UPC"
              name="upc"
              value={initialItemData.upc}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label
              className="text-slate-600 flex text-sm items-center gap-2"
              htmlFor="mpn"
            >
              MPN
            </label>
            <input
              className="pl-3 text-sm w-[100%]  rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              placeholder="Enter MPN"
              name="mpn"
              value={initialItemData.mpn}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 ">
          <div>
            <label
              className="text-slate-600 flex text-sm items-center gap-2"
              htmlFor="ean"
            >
              EAN
            </label>
            <input
              className="pl-3 text-sm w-[100%]  rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              placeholder="Enter EAN"
              name="ean"
              value={initialItemData.ean}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              className="text-slate-600 flex text-sm items-center gap-2"
              htmlFor="isbn"
            >
              ISBN
            </label>
            <input
              className="pl-3 text-sm w-[100%]  rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
              placeholder="Enter ISBN"
              name="isbn"
              value={initialItemData.isbn}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex gap-5 w-full">
          <div className="w-1/2">
            <p className="text-textColor text-base font-semibold mt-2">
              Purchase Information
            </p>
            <div className="flex gap-4">
              <div className="relative mt-1.5">
                <label
                  className="text-slate-600 flex text-sm items-center gap-2"
                  htmlFor="costPrice"
                >
                  Cost Price
                </label>
                <div className="flex">
                  <div className="w-16 text-sm  mt-0.5 rounded-l-md text-start bg-white text-zinc-400 border border-inputBorder h-10 items-center justify-center flex">
                    {itemsData.organization.baseCurrency.toUpperCase() || "INR"}
                  </div>
                  <input
                    type="number"
                    min={0}
                    className="pl-3 text-sm w-[100%] mt-0.5 rounded-r-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    placeholder="Enter Price"
                    name="costPrice"
                    value={initialItemData.costPrice}
                    onChange={handleInputChange}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </div>
              </div>

              <div className="relative w-1/2">
                <label
                  htmlFor="preferredVendor"
                  className="text-slate-600 text-sm gap-2"
                >
                  Preferred Vendor
                </label>
                <div className="relative w-full">
                  <select
                    className="block appearance-none  w-full mt-0.5 text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    name="preferredVendor"
                    value={initialItemData.preferredVendor}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Vendor</option>
                    {/* Add vendor options dynamically here */}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/2">
            <p className="text-textColor text-base font-semibold mt-2">
              Sales Information
            </p>
            <div className="flex gap-4 my-1">
              <div className="relative w-1/2">
                <label
                  className="text-slate-600 flex text-sm gap-2"
                  htmlFor="sellingPrice"
                >
                  Selling Price
                </label>
                <div className="flex">
                  <div className="w-16 text-sm mt-0.5 rounded-l-md text-start bg-white text-zinc-400 border border-inputBorder h-10 items-center justify-center flex">
                    {itemsData.organization.baseCurrency.toUpperCase() || "INR"}
                  </div>
                  <input
                    type="number"
                    min={0}
                    className="pl-3 text-sm w-[100%] mt-0.5  rounded-r-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    placeholder="Enter Price"
                    name="sellingPrice"
                    value={initialItemData.sellingPrice}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.sellingPrice && (
                  <div className="text-red-800 text-xs  ms-1">
                    Selling price is required
                  </div>
                )}
              </div>
              <div className="w-1/2">
                <label className="text-slate-600 flex text-sm items-center gap-2" htmlFor="saleMrp">
                  MRP
                </label>
                <div className="flex">
                  <div className="w-16 text-sm mt-0.5 rounded-l-md text-start bg-white text-zinc-400 border border-inputBorder h-10 items-center justify-center flex">
                    {itemsData.organization.baseCurrency.toUpperCase() || "INR"}
                  </div>
                  <input
                    type="number"
                    min={0}
                    className="pl-3 text-sm w-full mt-0.5 rounded-r-md text-start bg-white border border-l-0 border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    placeholder="Enter MRP"
                    name="saleMrp"
                    value={initialItemData.saleMrp}
                    onChange={handleInputChange}
                  />
                </div>
              </div>


            </div>
          </div>
        </div>

        <div className="w-full mt-2">
          <div className="flex items-center gap-1 text-textColor">
            <label
              htmlFor="checkboxTrack"
              className="text-textColor text-base font-semibold"
            >
              Track Inventory for this item
            </label>
          </div>
          <div className="flex justify-between gap-3 mt-1">
            <div className="w-1/3 ">
              <label
                className="text-slate-600 flex text-sm gap-2 mb-0.5"
                htmlFor="openingStock"
              >
                Opening Stock
              </label>
              <input
                type="number"
                min={0}
                className="pl-3 text-sm w-[100%] mt-1  rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Value"
                name="openingStock"
                value={initialItemData.openingStock}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-1/3">
              <label
                className="text-slate-600 flex text-sm gap-2 mb-0.5"
                htmlFor="openingStockRatePerUnit"
              >
                Opening Stock Rate Per Unit
              </label>
              <input
                type="number"
                min={0}
                className="pl-3 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Value"
                name="openingStockRatePerUnit"
                value={initialItemData.openingStockRatePerUnit}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-1/3">
              <label
                className="text-slate-600 flex text-sm gap-2 mb-0.5"
                htmlFor="reorderPoint"
              >
                Reorder Point
              </label>
              <input
                type="number"
                min={0}
                className="pl-3 text-sm w-[100%] mt-1  rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Value"
                name="reorderPoint"
                value={initialItemData.reorderPoint}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="justify-end me-5 flex gap-4 sticky bottom-0 bg-white p-2">
        <Link to="/inventory/Item">
          <Button variant="secondary" size="sm" className="text-sm pl-8 pr-8">
            Cancel
          </Button>
        </Link>
        <Button
          onClick={handleSave}
          variant="primary"
          size="sm"
          className="text-sm pl-8 pr-8"
        >
          Save
        </Button>
      </div>
      {isBrandModalOpen && (
        <BrandModal ref={modalRef} onClose={() => setIsBrandModalOpen(false)} />
      )}
      {isCategoryModalOpen && (
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
        />
      )}
      {isRackModalOpen && (
        <RackModal ref={modalRef} onClose={() => setIsRackModalOpen(false)} />
      )}
      {isManufatureModalOpen && (
        <NewManufacture
          ref={modalRef}
          onClose={() => setIsManufatureModalOpen(false)}
        />
      )}
    </>
  );
};

export default AddItem;