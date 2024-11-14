import { forwardRef, useState, useEffect, ChangeEvent } from "react";
import toast from "react-hot-toast";
import Button from "../../../Components/Button";
import Modal from "../../../Components/model/Modal";
import PencilEdit from "../../../assets/icons/PencilEdit";
import TrashCan from "../../../assets/icons/TrashCan";
import PlusCircle from "../../../assets/icons/PlusCircle";
import bgImage from "../../../assets/Images/6.png";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";

type Manufacturer = {
  _id?: string;
  name: string;
  description: string;
  type?: string;
  createdDate?: string;
};

type Props = {
  onClose: () => void;
};

const NewManufacture = forwardRef<HTMLDivElement, Props>(({ onClose }, ref) => {
  const { request: fetchAllManufacturers } = useApi("put", 5003);
  const { request: deleteManufacturerRequest } = useApi("delete", 5003);
  const { request: updateManufacturerRequest } = useApi("put", 5003);
  const { request: addManufacturerRequest } = useApi("post", 5003);
  const [allManufactures, setAllManufatures] = useState([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer>({
    name: "",
    description: "",
    type: "manufacturer",
  });
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (item?: any) => {
    if (item) {
      setIsEdit(true);
      setManufacturers({
        _id: item.id,
        name: item.manufacturerName,
        description: item.description,
        type: item.type || "manufacturer",
      });
    } else {
      setIsEdit(false);
      setManufacturers({
        name: "",
        description: "",
        type: "manufacturer",
      });
    }
    setModalOpen(true);
  };

  const loadManufacturers = async () => {
    try {
      const url = `${endponits.GET_ALL_BRMC}`;
      const body = { type: "manufacturer" };
      const { response, error } = await fetchAllManufacturers(url, body);
      if (!error && response) {
        setAllManufatures(response.data);
      } else {
        console.error("Failed to fetch manufacturers.");
      }
    } catch (error) {
      toast.error("Error fetching manufacturers data");
      console.error("Error fetching manufacturers data", error);
    }
  };
  
  useEffect(() => {
    loadManufacturers();
  }, []);

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSave = async () => {
    try {
      const url = isEdit ? `${endponits.UPDATE_BRMC}` : `${endponits.ADD_BRMC}`;
      const apiCall = isEdit
        ? updateManufacturerRequest
        : addManufacturerRequest;

      const { response, error } = await apiCall(url, manufacturers);

      if (!error && response) {
        toast.success(`Manufacturer ${isEdit ? "updated" : "added"} successfully!`);
        loadManufacturers();
        closeModal();
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error in save operation.");
    }
  };

  const handleDelete = async (item: any) => {
    try {
      const url = `${endponits.DELETE_BRMC}/${item.id}`;
      const { response, error } = await deleteManufacturerRequest(url);
      
      if (!error && response) {
        toast.success("Manufacturer deleted successfully!");
        loadManufacturers();
        if(allManufactures.length==1){
          setAllManufatures((prevData) => prevData.filter((m:any) => m._id !== item._id));
        }
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error occurred while deleting Manufacturer.");
    }
  };
  

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setManufacturers((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div ref={ref}>
      <Modal open={true} onClose={onClose} className="">
        <div className="p-5 mt-3">
          <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden h-24">
            <div
              className="absolute top-0 right-12 h-24 w-[200px] bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-textColor">
                Manage Manufacturer
              </h3>
              <p className="text-dropdownText font-semibold text-sm mt-2">
              Have an insight on the profit or loss incurred due to the change in exchange rates
              </p>
            </div>
            <div
              className="ms-auto text-3xl cursor-pointer relative z-10"
              onClick={onClose}
            >
              &times;
            </div>
          </div>

          <div className="flex justify-end me-2 my-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => openModal()}
              className="text-sm"
            >
              <PlusCircle color="white" />
              New Manufacturer
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {allManufactures?.length > 0 ? (
              allManufactures.map((item: any) => (
                <div key={item._id} className="flex p-2">
                  <div className="border border-slate-200 text-textColor rounded-xl w-96 h-auto p-3 flex justify-between">
                    <div>
                      <h3 className="text-sm font-bold">{item.manufacturerName}</h3>
                      <p className="text-xs text-textColor">{item.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      {/* Edit Button */}
                      <button className="cursor-pointer" onClick={() => openModal(item)}>
                        <PencilEdit color="currentColor" />
                      </button>

                      {/* Delete Button */}
                      <button className="cursor-pointer" onClick={() => handleDelete(item)}>
                        <TrashCan color="currentColor" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) :(
              <p className="text-center col-span-3 text-red-500 font-semibold">No manufacturers found !</p>
            )}
          </div>

          <div className="flex justify-end my-3">
            <Button variant="primary" onClick={onClose} size="sm" className="text-sm">
              Done
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={isModalOpen} onClose={closeModal} style={{ width: "35%" }}>
        <div className="p-5 mt-3">
          <div className="flex p-4 rounded-xl relative overflow-hidden">
            <h3 className="text-xl font-bold text-textColor">
              {isEdit ? "Edit Manufacturer" : "Add Manufacturer"}
            </h3>
            <div
              className="ms-auto text-3xl cursor-pointer relative z-10"
              onClick={closeModal}
            >
              &times;
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="mb-4">
              <label className="block text-sm mb-1 text-labelColor">Name</label>
              <input
                placeholder="Sony Corporation"
                type="text"
                value={manufacturers.name}
                name="name"
                onChange={handleInputChange}
                className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 text-zinc-700 h-10"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1 text-labelColor">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Description"
                name="description"
                value={manufacturers.description}
                onChange={handleInputChange}
                className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
              />
            </div>

            <div className="flex justify-end gap-2 mb-3">
              <Button onClick={closeModal} variant="tertiary" className="text-sm pl-6 pr-6" size="sm">
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                variant="primary"
                size="sm"
                className="pl-8 pr-8"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
});

export default NewManufacture;
