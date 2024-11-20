import { forwardRef, useState, useEffect, ChangeEvent } from "react";
import toast from "react-hot-toast";
import bgImage from "../../../assets/Images/Frame 6.png";
import Button from "../../../Components/Button";
import PlusCircle from "../../../assets/icons/PlusCircle";
import OutlineTrashIcon from "../../../assets/icons/OutlineTrashIcon";
import PencilIcon from "../../../assets/icons/PencilIcon";
import Modal from "../../../Components/model/Modal";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";

type BrandData = {
  _id?: string;
  name: string;
  description: string;
  type?: string;
  createdDate?: string;
  updatedDate?: string;
  __v?: number;
};

type Props = {
  onClose: () => void;
};

const BrandManager = forwardRef<HTMLDivElement, Props>(({ onClose }, ref) => {
  const { request: fetchAllBrands } = useApi("put", 5003);
  const { request: deleteBrandRequest } = useApi("delete", 5003);
  const { request: updateBrandRequest } = useApi("put", 5003);
  const { request: addBrandRequest } = useApi("post", 5003);

  const [brandData, setBrandData] = useState<BrandData>({
    name: "",
    description: "",
    type: "brand",
  });

  const [allBrandData, setAllBrandData] = useState<BrandData[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
    setIsEdit(false);
  };

  const openModal = (brand?: any) => {
    if (brand) {
      setIsEdit(true);
      setBrandData({
        _id: brand.id,
        name: brand.brandName,
        description: brand.description,
        type: brand.type || "brand",
      });
    } else {
      setIsEdit(false);
      setBrandData({
        name: "",
        description: "",
        type: "brand",
      });
    }
    setModalOpen(true);
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBrandData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const loadBrands = async () => {
    try {
      const url = `${endponits.GET_ALL_BRMC}`;
      const body = { type: "brand" };
      const { response, error } = await fetchAllBrands(url, body);
      if (!error && response) {
        setAllBrandData(response.data);
      } else {
        console.error("Failed to fetch brand data.");
      }
    } catch (error) {
      toast.error("Error in fetching brand data.");
      console.error("Error in fetching brand data", error);
    }
  };




  const handleDelete = async (brand: any) => {
    try {
      const url = `${endponits.DELETE_BRMC}/${brand.id}`;
      const { response, error } = await deleteBrandRequest(url);
      if (!error && response) {
        toast.success("Brand deleted successfully!");
        loadBrands();
        if (allBrandData.length == 1) {
          setAllBrandData((prevData) => prevData.filter((m: any) => m._id !== brand._id));
        }
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error occurred while deleting brand.");
    }
  };

  const handleSave = async () => {
    try {
      const url = isEdit ? `${endponits.UPDATE_BRMC}` : `${endponits.ADD_BRMC}`;
      const apiCall = isEdit ? updateBrandRequest : addBrandRequest;

      const { response, error } = await apiCall(url, brandData);

      if (!error && response) {
        toast.success(`Brand ${isEdit ? "updated" : "added"} successfully!`);
        loadBrands();
        closeModal();
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error in save operation.");
    }
  };

  return (
    <div ref={ref}>
      <Modal open={true} onClose={onClose}>
        <div className="p-5 mt-3">
          <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden h-24">
            <div
              className="absolute top-0 right-12 h-24 w-[200px] bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-textColor">Manage Brand</h3>
              <p className="text-dropdownText font-semibold text-sm mt-2">
                Have an insight on the profit or loss incurred due to the change in exchange rates
              </p>
            </div>
            <div className="ms-auto text-3xl cursor-pointer relative z-10" onClick={onClose}>
              &times;
            </div>
          </div>

          <div className="flex justify-end me-2 my-4">
            <Button variant="primary" size="sm" onClick={() => openModal()} className="text-sm">
              <PlusCircle color="white" />
              Add Brand
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {allBrandData.length === 0 ? (
              <div className="flex justify-center items-center p-2 ms-[100%] w-full">
                <div className="border border-slate-200 text-textColor rounded-xl w-full h-auto p-3 flex justify-center items-center">
                  <div className="text-center">
                    <p className="text-xs text-red-600 text-center">No Brand Data !</p>
                  </div>

                </div>
              </div>
            ) : (
              allBrandData.map((brand: any) => (
                <div key={brand._id} className="flex p-2">
                  <div className="border border-slate-200 text-textColor rounded-xl w-96 h-auto p-3 flex justify-between">
                    <div>
                      <h3 className="text-sm font-bold">{brand.brandName}</h3>
                      <p className="text-xs text-textColor">{brand.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <p className="cursor-pointer" onClick={() => openModal(brand)}>
                        <PencilIcon color="currentColor" />
                      </p>
                      <p className="cursor-pointer" onClick={() => handleDelete(brand)}>
                        <OutlineTrashIcon color="currentColor" />
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end gap-2 my-3">
            <Button onClick={onClose} className="flex justify-center px-8" variant="primary" size="sm" >
              Done
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={isModalOpen} onClose={closeModal} style={{ width: "35%" }}>
        <div className="p-5 mt-3">
          <div className="flex p-4 rounded-xl relative overflow-hidden">
            <h3 className="text-xl font-bold text-textColor">{isEdit ? "Edit Brand" : "Add Brand"}</h3>
            <div className="ms-auto text-3xl cursor-pointer relative z-10" onClick={closeModal}>
              &times;
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="">
              <div className="mb-4">
                <label className="block text-sm mb-1 text-labelColor">Name</label>
                <input
                  placeholder="Brand Name"
                  type="text"
                  name="name"
                  value={brandData.name}
                  onChange={handleInputChange}
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 text-zinc-700 h-10"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-labelColor">Description</label>
                <textarea
                  rows={4}
                  placeholder="Description"
                  name="description"
                  value={brandData.description}
                  onChange={handleInputChange}
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 text-zinc-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" className="text-sm pl-6 pr-6" size="sm" onClick={closeModal}>
                Cancel
              </Button>{" "}
              <Button size="sm" variant="primary" className="text-sm pl-8 pr-8" type="submit">
                Save
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
});

export default BrandManager;
