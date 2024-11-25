import { useState, useEffect, ChangeEvent } from "react";
import toast from "react-hot-toast";
import Button from "../../../Components/Button";
import Modal from "../../../Components/model/Modal";
import bgImage from "../../../assets/Images/Frame 6.png";
import PencilEdit from "../../../assets/icons/PencilEdit";
import PlusCircle from "../../../assets/icons/PlusCircle";
import TrashCan from "../../../assets/icons/TrashCan";
import SearchBar from "../../../Components/SearchBar";
import CehvronDown from "../../../assets/icons/CehvronDown";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";

type CategoryData = {
  _id?: string;
  name: string;
  description: string;
  type?: string;
  createdDate?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  page?: string;
};

function Category({ isOpen, onClose, page }: Props) {
  const { request: fetchAllCategories } = useApi("put", 5003);
  const { request: deleteCategoryRequest } = useApi("delete", 5003);
  const { request: updateCategoryRequest } = useApi("put", 5003);
  const { request: addCategoryRequest } = useApi("post", 5003);

  const [categories, setCategories] = useState<CategoryData>({
    name: "",
    description: "",
    type: "category",
  });

  const [allCategoryData, setAllcategoryData] = useState<CategoryData[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState(false);


  const [searchValue, setSearchValue] = useState<string>("");

  const closeModal = () => {
    setModalOpen(false);
  };

  const loadCategories = async () => {
    try {
      const url = `${endponits.GET_ALL_BRMC}`;
      const body = { type: "category" };
      const { response, error } = await fetchAllCategories(url, body);
      if (!error && response) {
        setAllcategoryData(response.data);
      } else {
        console.error("Failed to fetch Category data.");
      }
    } catch (error) {
      toast.error("Error in fetching Category data.");
      console.error("Error in fetching Category data", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openModal = (category?: any) => {
    console.log(category, "item");

    if (category) {
      setIsEdit(true);
      setCategories({
        _id: category.id,
        name: category.categoriesName,
        description: category.description,
        type: category.type || "category",
      });
    } else {
      setIsEdit(false);
      setCategories({
        name: "",
        description: "",
        type: "category",
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const url = isEdit ? `${endponits.UPDATE_BRMC}` : `${endponits.ADD_BRMC}`;
      const apiCall = isEdit ? updateCategoryRequest : addCategoryRequest;
      const { response, error } = await apiCall(url, categories);

      if (error) {
        toast.error(error.response.data.message);
        console.error(`Error saving category: ${error.message}`);
      } else if (response) {
        toast.success(`Category ${isEdit ? "updated" : "added"} successfully.`);
        closeModal();
        loadCategories();
      }
    } catch (error) {
      toast.error("Error in save operation.");
      console.error("Error in save operation", error);
    }
  };

  const handleDelete = async (item: any) => {
    try {
      const url = `${endponits.DELETE_BRMC}/${item.id}`;
      const { response, error } = await deleteCategoryRequest(url);
      if (!error && response) {
        toast.success("Category deleted successfully!");
        if(allCategoryData.length==1){
          setAllcategoryData((prevData) => prevData.filter((m:any) => m._id !== item._id));
        }
        loadCategories();
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error occurred while deleting Category.");
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategories((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Modal open={isOpen} onClose={onClose} className="w-[65%]">
      <div className="p-5 mt-3">
        <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden h-24">
          <div
            className="absolute top-0 right-12 h-24 w-[200px] bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${bgImage})` }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-textColor">
              Manage Category
            </h3>
            <p className="text-dropdownText font-semibold text-sm mt-2">
              Have an insight on the profit or loss incurred due to the change
              in exchange rates
            </p>
          </div>
          <div
            className="ms-auto text-3xl cursor-pointer relative z-10"
            onClick={onClose}
          >
            &times;
          </div>
        </div>

        <div className="flex">
          {page === "expense" && (
            <div className="grid grid-flow-col items-center gap-3 ">
              <div className="w-96">
                <SearchBar
                  placeholder="Search Name or Mobile"
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                />
              </div>
              <div>
                <div className="relative w-full items-center justify-center flex">
                  <select className="block appearance-none w-full h-10 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                    <option value="" className="text-gray">
                      All Category
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex ml-auto me-2 my-4">
            <Button variant="primary" size="xl" onClick={() => openModal()}>
              <PlusCircle color="white" />
              <p className="text-sm">Add Category</p>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {allCategoryData.length === 0 ? (
            <p className="text-center col-span-3 text-red-500 font-semibold">
              No categories found !
            </p>
          ) : (
            allCategoryData.map((category: any) => (
              <div key={category.id} className="flex p-2">
                <div className="border border-slate-200 text-textColor rounded-xl w-96 h-auto p-3 flex justify-between">
                  <div>
                    <h3 className="text-sm font-bold">
                      {category.categoriesName}
                    </h3>
                    <p className="text-xs text-textColor">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <p
                      className="cursor-pointer"
                      onClick={() => openModal(category)}
                    >
                      <PencilEdit color="currentColor" />
                    </p>
                    <p
                      className="cursor-pointer"
                      onClick={() => handleDelete(category)}
                    >
                      <TrashCan color="currentColor" />
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>


        {page !== "expense" && (
          <div className="flex justify-end gap-2 my-3">
            <Button
              className="flex justify-center px-8"
              variant="primary"
              size="sm"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        )}

        <Modal open={isModalOpen} onClose={closeModal} style={{ width: "35%" }}>
          <div className="p-5">
            <div className="flex p-4 rounded-xlrelative overflow-hidden h-24">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-textColor">
                  {isEdit ? "Edit" : "Add"} Category
                </h3>
              </div>
              <div
                className="ms-auto text-3xl cursor-pointer relative z-10"
                onClick={closeModal}
              >
                &times;
              </div>
            </div>

            <form className="grid gap-5">
              <div className="w-full">
                <label className="block text-sm mb-1 text-labelColor">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  name="name"
                  value={categories.name}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 mt-1 text-sm bg-white border border-inputBorder rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm mb-1 text-labelColor">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter description"
                  name="description"
                  value={categories.description}
                  onChange={handleInputChange}
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 "
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" className="text-sm pl-6 pr-6" onClick={closeModal}>
                  Cancel
                </Button>{" "}
                <Button variant="primary" size="sm" className="text-sm pl-8 pr-8" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </Modal>
  );
}

export default Category;
