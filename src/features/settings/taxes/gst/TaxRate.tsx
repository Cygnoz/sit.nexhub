import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import PlusCircle from "../../../../assets/icons/PlusCircle";
import Button from "../../../../Components/Button";
import Modal from "../../../../Components/model/Modal";
import bgImage from "../../../../assets/Images/14.png";
import TaxImage from "../../../../assets/Images/Tax-bro 1.png";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import { GstResponseContext } from "../../../../context/ContextShare";
import toast from "react-hot-toast";
// import BookIcon from "../../../../assets/icons/BookIcon";
// import OpenedBookIcon from "../../../../assets/icons/OpenedBookIcon";
// import BookXIcon from "../../../../assets/icons/BookXIcon";
// import NewspaperIcon from "../../../../assets/icons/NewspaperIcon";
import SearchBar from "../../../../Components/SearchBar";
// import ListIcon from "../../../../assets/icons/ListIcon";
import ViewTaxDetails from "./ViewTaxDetails";
import PencilIcon from "../../../../assets/icons/PencilIcon";
// import TrashCan from "../../../../assets/icons/TrashCan";

type Props = {}
type TaxGst = {
  _id: string;
  taxName: string;
  taxRate: string;
  cgst: string;
  sgst: string;
  igst: string;
};

function TaxRate({ }: Props) {
  // const TaxFilter = [
  //   {
  //     icon: <BookIcon color="#585953" />,
  //     title: "All",
  //   },
  //   {
  //     icon: <OpenedBookIcon color="#585953" />,
  //     title: "Active",
  //   },
  //   {
  //     icon: <BookXIcon color="#585953" />,
  //     title: "Inactive",
  //   },
  //   {
  //     icon: <NewspaperIcon color="#585953" />,
  //     title: "Expired",
  //   },
  // ];
  // const [selected, setSelected] = useState("All");
  const initialTaxGst = {
    _id: "",
    taxName: "",
    taxRate: "",
    cgst: "",
    sgst: "",
    igst: "",
  };

  const [taxGst, setTaxGst] = useState<TaxGst>(initialTaxGst);
  const { request: createTaxGst } = useApi("post", 7004);
  const { request: updateTaxGst } = useApi("put", 7004);
  const { setGstResponse, gstResponse } = useContext(GstResponseContext)!;

 const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  // Ensuring the taxRate stays between 0 and 100
  if (name === "taxRate") {
    const rate = Math.max(0, Math.min(100, parseFloat(value) || 0)); // Clamp the value between 0 and 100
    setTaxGst((prev) => ({
      ...prev,
      [name]: rate.toString(),
      cgst: (rate / 2).toString(),
      sgst: (rate / 2).toString(),
      igst: rate.toString(),
    }));
  } else {
    setTaxGst((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};


  const [errors, setErrors] = useState({
    taxName: false,
    taxRate: false,
  });


  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = {
      taxName: !taxGst.taxName,
      taxRate: !taxGst.taxRate,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (taxGst._id) {  // Check if we're in edit mode based on the presence of `id`
      const url = `${endponits.UPDATE_TAX_VAT}`;  // Corrected endpoint for updating GST
      const body = {
        taxType: "GST",
        taxRateId: taxGst._id,  // Use `taxGst.id` for the GST rate ID
        updatedRate: {
          taxName: taxGst.taxName,
          taxRate: taxGst.taxRate,
          cgst: taxGst.cgst,
          sgst: taxGst.sgst,
          igst: taxGst.igst,
        },
      };

      const { response, error } = await updateTaxGst(url, body);
      if (!error && response) {
        toast.success(response.data.message);
        setGstResponse((prevGstResponse: any) => ({
          ...prevGstResponse,
          ...response.data,
        }));
        fetchAllTaxGst();
        closeModal();
      } else {
        toast.error(error.response.data.message);
      }
    } else {  // Adding new GST rate
      const url = `${endponits.ADD_NEW_TAX}`;
      const body = {
        taxType: "GST",
        gstTaxRate: {
          taxName: taxGst.taxName,
          taxRate: taxGst.taxRate,
          cgst: taxGst.cgst,
          sgst: taxGst.sgst,
          igst: taxGst.igst,
        },
      };

      const { response, error } = await createTaxGst(url, body);
      if (!error && response) {
        toast.success(response.data.message);
        setGstResponse((prevGstResponse: any) => ({
          ...prevGstResponse,
          ...response.data,
        }));
        fetchAllTaxGst();
        closeModal();
      } else {
        toast.error(error.response.data.message);
      }
    }
  };



  const [isModalOpen, setModalOpen] = useState(false);
  const [taxData, setTaxData] = useState<TaxGst[]>([]);
  const [filteredTaxData, setFilteredTaxData] = useState<TaxGst[]>([]);
  const [selectedTaxRate, setSelectedTaxRate] = useState<TaxGst | null>(null);
  const [search, setSearch] = useState<string>("");

  const { request: AllTaxGst } = useApi("get", 7004);

  const fetchAllTaxGst = async () => {
    try {
      const url = `${endponits.GET_ALL_TAX}`;
      const { response, error } = await AllTaxGst(url);
      if (!error && response) {
        const gstTaxRates = response.data.gstTaxRate;
        setTaxData(gstTaxRates);
        setFilteredTaxData(gstTaxRates);
      }
    } catch (error) {
      console.error("Error fetching tax data:", error);
    }
  };

  useEffect(() => {
    fetchAllTaxGst();
  }, [gstResponse]);

  useEffect(() => {
    setFilteredTaxData(
      taxData.filter((tax) =>
        tax.taxName.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, taxData]);

  const openModal = (taxRate: TaxGst | null = null) => {
    if (taxRate) {
      setTaxGst(taxRate);
    } else {
      setTaxGst(initialTaxGst);
    }
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setTaxGst(initialTaxGst);
    setErrors({
      taxName: false,
      taxRate: false,
    });
  };


  const handleViewClick = (taxRate: TaxGst) => {
    setSelectedTaxRate(taxRate);
  };

  const tableHeaders = ["Tax Name", "Rate", "CGST", "SGST", "IGST", "Action"];

  return (
    <div>
      <div className="flex justify-between">
        <p className="text-textColor font-bold">Tax Rate</p>
        <div className="flex gap-4">
          <Button onClick={() => openModal(null)} className="text-sm font-medium" size="sm">
            <PlusCircle color="white" /> New Tax
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mt-3">
        {/* <div className="flex gap-3 justify-between">
          {TaxFilter.map((customer) => (
            <button
              key={customer.title}
              onClick={() => setSelected(customer.title)}
              className={`flex items-center gap-2 p-2 w-[100%] justify-center rounded ${selected === customer.title ? "bg-WhiteIce" : "bg-white"
                }`}
              style={{ border: "1px solid #DADBDD" }}
            >
              {customer.icon}
              <span
                style={{ color: "#4B5C79", fontSize: "12px", fontWeight: "600" }}
              >
                {customer.title}
              </span>
            </button>
          ))}
        </div> */}
        <div className="mt-3">
          <div className="flex justify-between items-center mt-5">
            <div className="w-full">
              <SearchBar
                placeholder="Search Taxes"
                onSearchChange={setSearch}
                searchValue={search}
              />
            </div>
            {/* <Button variant="secondary" size="sm">
              <ListIcon color="#565148" />{" "}
              <p className="text-sm font-medium text-outlineButton">Sort By</p>
            </Button> */}
          </div>
          <div className="max-h-[25rem] overflow-y-auto mt-3">
            <table className="min-w-full bg-white mb-5">
              <thead className="text-[12px] text-center text-textColor sticky top-0 z-10">
                <tr style={{ backgroundColor: "#F9F7F0" }}>
                  {/* <th className="py-3 px-4 border-b border-tableBorder">
                    <input type="checkbox" className="form-checkbox w-4 h-4" />
                  </th> */}
                  {tableHeaders.map((heading, index) => (
                    <th
                      className="py-2 px-4 font-medium border-b border-tableBorder"
                      key={index}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-dropdownText text-center text-[13px]">
                {filteredTaxData.map((item) => (
                  <tr key={item._id} className="relative">
                    {/* <td className="border-y border-tableBorder">
                      <input type="checkbox" className="form-checkbox w-4 h-4" />
                    </td> */}
                    <td className="py-2.5 border-y border-tableBorder">
                      {item.taxName}
                    </td>
                    <td className="py-2.5 px-4 border-y border-tableBorder">
                      {item.taxRate}
                    </td>
                    <td className="py-2.5 px-4 border-y border-tableBorder">
                      {item.cgst}
                    </td>
                    <td className="py-2.5 px-4 border-y border-tableBorder">
                      {item.sgst}
                    </td>
                    <td className="py-2.5 px-4 border-y border-tableBorder">
                      {item.igst}
                    </td>
                    <td className="py-2.5 px-4 border-y border-tableBorder">
                      <div className="flex justify-center cursor-pointer gap-3">
                        <div onClick={() => handleViewClick(item)}>
                          <ViewTaxDetails taxRate={selectedTaxRate} />
                        </div>
                        <div onClick={() => openModal(item)}>
                          <PencilIcon color="#3C7FBC" />
                        </div>
                        {/* <div>
                          <TrashCan color="red" />
                        </div> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        className="w-[90%] sm:w-[59.4%] px-8 py-6"
      >
        <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden">
          <div
            className="absolute top-0 -right-8 w-[178px] h-[89px]"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-textColor">{taxGst._id ? "Edit Tax" : "Create New Tax"}</h3>
            <p className="text-dropdownText font-semibold text-sm mt-2">
              {taxGst._id ? "Modify the details of the selected GST tax rate." : "Fill in the details to add a new GST tax rate."}
            </p>
          </div>
          <div
            className="ms-auto text-3xl cursor-pointer relative z-10"
            onClick={closeModal}
          >
            &times;
          </div>
        </div>
        <form onSubmit={onSubmit}>
          <div className="flex items-center mt-6">
            <div className="">
              <img src={TaxImage} alt="" />
            </div>
            <div className="ms-6 w-[70%]">
              <div className="text-dropdownText text-sm">
                <label htmlFor="taxName">Tax Name</label>
                <input
                  type="text"
                  name="taxName"
                  value={taxGst.taxName}
                  onChange={handleChange}
                  className={`pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border h-9 p-2
                    ${errors.taxName ? "border-red-500" : "border-slate-300"}
                    `}
                  placeholder="Enter tax name"
                />
                {errors.taxName && (
                  <div className="text-red-800 text-xs mt-1.5 ms-1">Item name is required</div>
                )}
              </div>
              <div className="text-dropdownText text-sm mt-4">
                <label htmlFor="taxRate">Rate</label>
                <input
                 step="0.01"
                  type="number"
                  max={100}
                  min={0}
                  name="taxRate"
                  value={taxGst.taxRate}
                  onChange={handleChange}
                  className={`pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border h-9 p-2
                    ${errors.taxRate ? "border-red-500" : "border-slate-300"}
                    `}
                  placeholder="Enter tax rate"
                />
                {errors.taxRate && (
                  <div className="text-red-800 text-xs mt-1.5 ms-1">Item name is required</div>
                )}
              </div>
              <div className="text-dropdownText text-sm mt-4">
                <label htmlFor="cgst">CGST</label>
                <input
                  type="text"
                  name="cgst"
                  value={taxGst.cgst}
                  onChange={handleChange}
                  className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                  placeholder="CGST"
                  readOnly
                />
              </div>
              <div className="text-dropdownText text-sm mt-4">
                <label htmlFor="sgst">SGST</label>
                <input
                  type="text"
                  name="sgst"
                  value={taxGst.sgst}
                  onChange={handleChange}
                  className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                  placeholder="SGST"
                  readOnly
                />
              </div>
              <div className="text-dropdownText text-sm mt-4">
                <label htmlFor="igst">IGST</label>
                <input
                  type="text"
                  name="igst"
                  value={taxGst.igst}
                  onChange={handleChange}
                  className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                  placeholder="IGST"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center mt-6 gap-2">
            <Button
              variant="secondary"
              onClick={closeModal}
              className="pl-10 pr-10 h-[38px]"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="pl-10 pr-10 h-[38px]"
              size="sm"
              type="submit"
            >
              {taxGst._id ? "Save Changes" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default TaxRate;
