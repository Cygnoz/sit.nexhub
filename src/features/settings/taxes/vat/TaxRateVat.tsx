import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import BookIcon from "../../../../assets/icons/BookIcon";
import PlusCircle from "../../../../assets/icons/PlusCircle";
import PencilIcon from "../../../../assets/icons/PencilIcon";
import Button from "../../../../Components/Button";
import Modal from "../../../../Components/model/Modal";
import bgImage from "../../../../assets/Images/14.png";
import TaxImage from "../../../../assets/Images/Tax-bro 1.png";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import { VatResponseContext } from "../../../../context/ContextShare";
import toast from "react-hot-toast";
import SearchBar from "../../../../Components/SearchBar";
import ViewTaxDetailsVat from "./ViewTaxDetailsVat";
import ListIcon from "../../../../assets/icons/ListIcon";

type TaxRate = {
  _id: string;
  taxName: string;
  taxRate: string;
  taxType: string;
};

type Props = {};

function TaxRateVat({}: Props) {
  const TaxFilter = [
    {
      icon: <BookIcon color="#585953" />,
      title: "All",
    },
  ];

  const [selected, setSelected] = useState("All");
  const [vatData, setVatData] = useState<TaxRate[]>([]);
  const [filteredVatRates, setFilteredVatRates] = useState<TaxRate[]>([]);
  const [selectedVatRate, setSelectedVatRate] = useState<TaxRate | null>(null);
  const [search, setSearch] = useState<string>("");

  const { request: createVatRate } = useApi("post", 5004);
  const { request: updateVatRate } = useApi("put", 5004);
  const { request: AllTaxVat } = useApi("get", 5004);
  const { vatResponse, setVatResponse } = useContext(VatResponseContext)!;

  const initialTaxVat = {
    _id: "",
    taxName: "",
    taxRate: "",
    taxType: "VAT",
  };

  const [taxVat, setTaxVat] = useState<TaxRate>(initialTaxVat);
  console.log(taxVat);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchAllVatRates = async () => {
    try {
      const url = `${endponits.GET_ALL_TAX}`;
      const { response, error } = await AllTaxVat(url);
      if (!error && response) {
        const vatTaxRates = response.data.vatTaxRate;
        setVatData(vatTaxRates);
        setFilteredVatRates(vatTaxRates);
      }
    } catch (error) {
      console.error("Error fetching VAT tax data:", error);
    }
  };

  useEffect(() => {
    fetchAllVatRates();
  }, [vatResponse]);

  useEffect(() => {
    setFilteredVatRates(
      vatData.filter((vatRate) =>
        vatRate.taxName.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, vatData]);

  const openModal = (vatRate: TaxRate | null = null) => {
    if (vatRate) {
      setIsEditMode(true);
      setTaxVat(vatRate);
    } else {
      setIsEditMode(false);
      setTaxVat(initialTaxVat);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTaxVat(initialTaxVat);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTaxVat((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewClick = (vatRate: TaxRate) => {
    setSelectedVatRate(vatRate);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      const url = `${endponits.UPDATE_TAX_VAT}`;
      const body = {
        taxType: "VAT",
        taxRateId: taxVat._id,
        updatedRate: {
          taxName: taxVat.taxName,
          taxRate: taxVat.taxRate,
        },
      };
      const { response, error } = await updateVatRate(url, body);
      if (!error && response) {
        toast.success(response.data.message);
        setVatResponse((prevVatResponse: any) => ({
          ...prevVatResponse,
          ...response.data,
        }));
        fetchAllVatRates();
        closeModal();
      } else {
        toast.error(error.response.data.message);
      }
    } else {
      const url = `${endponits.ADD_NEW_TAX}`;
      const body = {
        taxType: "VAT",
        vatTaxRate: {
          taxName: taxVat.taxName,
          taxRate: taxVat.taxRate,
        },
      };

      const { response, error } = await createVatRate(url, body);
      if (!error && response) {
        toast.success(response.data.message);
        setVatResponse((prevVatResponse: any) => ({
          ...prevVatResponse,
          ...response.data,
        }));
        fetchAllVatRates();
        closeModal();
      } else {
        toast.error(error.response.data.message);
      }
    }
  };

  const tableHeaders = ["", "Tax Name", "Rate(%)", "Actions"];
  return (
    <div>
      <div className="flex justify-between">
        <p className="text-textColor font-bold">Tax Rate</p>
        <div className="flex gap-4">
          <Button onClick={() => openModal(null)} className="text-sm font-medium" size="sm">
            <PlusCircle color="white" /> New Vat
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mt-3">
        <div className="flex gap-3 justify-start">
          {TaxFilter.map((customer) => (
            <button
              key={customer.title}
              onClick={() => setSelected(customer.title)}
              className={`flex items-center gap-2 p-2 w-[19%] justify-center rounded ${
                selected === customer.title ? "bg-WhiteIce" : "bg-white"
              }`}
              style={{ border: "1px solid #DADBDD" }}
            >
              {customer.icon}
              <span style={{ color: "#4B5C79", fontSize: "12px", fontWeight: "600" }}>
                {customer.title}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-3">
          <div className="flex justify-between items-center mt-5">
            <div className="w-[89%]">
              <SearchBar placeholder="Search Taxes" onSearchChange={setSearch} searchValue={search} />
            </div>
            <Button variant="secondary" size="sm">
              <ListIcon color="#565148" />{" "}
              <p className="text-sm font-medium text-outlineButton">Sort By</p>
            </Button>
          </div>
          <div className="max-h-[25rem] overflow-y-auto mt-3">
            <table className="min-w-full bg-white mb-5">
              <thead className="text-[12px] text-center text-textColor sticky top-0 z-10">
                <tr style={{ backgroundColor: "#F9F7F0" }}>
                  {tableHeaders.map((heading, index) => (
                    <th className="py-2 px-4 font-medium border-b border-tableBorder" key={index}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-dropdownText text-center text-[13px]">
                {filteredVatRates.map((item) => (
                  <tr key={item._id} className="relative">
                    <td className="py-2.5 px-4 border-y border-tableBorder">
                      <input type="checkbox" className="form-checkbox w-4 h-4" />
                    </td>
                    <td className="py-2.5 px-4 border-y border-tableBorder">{item.taxName}</td>
                    <td className="py-2.5 px-4 border-y border-tableBorder">{item.taxRate} %</td>
                    <td className="py-2.5 px-4 border-y border-tableBorder">
                      <div className="flex gap-5 justify-center cursor-pointer" onClick={() => handleViewClick(item)}>
                        <ViewTaxDetailsVat vatRate={selectedVatRate} />
                        <div onClick={() => openModal(item)}>
                          <PencilIcon color="#3C7FBC" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal open={isModalOpen} onClose={closeModal} className="w-[60.4%] p-8">
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
              {isEditMode ? "Edit VAT" : "Create New VAT"}
            </h3>
            <p className="text-dropdownText font-semibold text-sm mt-2">
              {isEditMode
                ? "Modify the details of the selected VAT tax rate."
                : "Fill in the details to add a new VAT tax rate."}
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
            <div>
              <img src={TaxImage} alt="Tax" />
            </div>
            <div className="ms-6 w-[70%]">
              <div className="text-dropdownText text-sm">
                <label htmlFor="taxName">Tax Name</label>
                <input
                  type="text"
                  name="taxName"
                  value={taxVat.taxName}
                  onChange={handleChange}
                  className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                  placeholder="Enter tax name"
                  required
                />
              </div>
              <div className="text-dropdownText text-sm mt-4">
                <label htmlFor="taxRate">Rate</label>
                <input
                  type="text"
                  name="taxRate"
                  value={taxVat.taxRate}
                  onChange={handleChange}
                  className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2"
                  placeholder="Enter tax rate"
                  required
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
              {isEditMode ? "Save Changes" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default TaxRateVat;
