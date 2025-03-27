import React, { FormEvent, useContext, useEffect, useState } from "react";
import Button from "../../../Components/Button";
import Modal from "../../../Components/model/Modal";
import toast from "react-hot-toast";
import Pen from "../../../assets/icons/Pen";
import bgImage from "../../../assets/Images/12.png";
import { UnitEditResponseContext } from "../../../context/ContextShare";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";

type Props = {
  unit: any;
  onUpdate: (updatedUnit: any) => void; // Add a callback for updating the table
};

interface UnitData {
  unitName: string;
  symbol: string;
  quantityCode: string;
  precision: string;
}

const EditUnitMeasurement = ({ unit, onUpdate }: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { setEditUnitResponse } = useContext(UnitEditResponseContext)!;
  const [initialUnitData, setInitialUnitData] = useState<UnitData>({
    unitName: "",
    symbol: "",
    quantityCode: "",
    precision: "",
  });

  const { request: editUnit } = useApi("put", 7003);
  const { request: getOneUnit } = useApi("get", 7003);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setInitialUnitData({ ...initialUnitData, [name]: value });
  };

  const openModal = () => {
    setModalOpen(true);
    fetchUnitData();
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const fetchUnitData = async () => {
    try {
      const url = `${endponits.GET_ONE_UNIT}/${unit._id}`;
      const { response, error } = await getOneUnit(url);
      if (!error && response) {
        setInitialUnitData(response.data);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = `${endponits.UPDATE_UNIT}/${unit._id}`;
      const body = initialUnitData;
      const { response, error } = await editUnit(url, body);
      if (!error && response) {
        toast.success(response.data.message);

        onUpdate(response.data); // Update the table with the new data
        setModalOpen(false);

        setEditUnitResponse((prevUnitResponse: any) => ({
          ...prevUnitResponse,
          ...body,
        }));
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchUnitData();
    }
  }, [isModalOpen]);

  return (
    <div>
      <button onClick={openModal} className="flex items-center">
        <Pen color={"blue"} />
      </button>
      <Modal open={isModalOpen} onClose={closeModal}  className="w-[90%] sm:w-[35%]">
        <div className="p-5 mt-3 text-start">
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
                Edit Unit of Measurement
              </h3>
              <p className="text-dropdownText font-semibold text-sm mt-2">
                Quantify and manage the quantities of products{" "}
              </p>
            </div>
            <div
              className="ms-auto text-3xl cursor-pointer relative z-10"
              onClick={closeModal}
            >
              &times;
            </div>
          </div>

          <form onSubmit={handleSave} className="">
            <div className="mb-4">
              <label className="block text-sm mb-1 text-labelColor">
                Unit Name
              </label>
              <input
                type="text"
                name="unitName"
                value={initialUnitData.unitName}
                placeholder="Name"
                onChange={handleInputChange}
                className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-10"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1 text-labelColor">
                Symbol
              </label>
              <input
                type="text"
                name="symbol"
                value={initialUnitData.symbol}
                placeholder="Symbol"
                onChange={handleInputChange}
                className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-10"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1 text-labelColor">
                Unit Quantity
              </label>
              <input
                type="text"
                name="quantityCode"
                value={initialUnitData.quantityCode}
                placeholder="Unit Quantity"
                onChange={handleInputChange}
                className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-10"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1 text-labelColor">
                Unit Precision
              </label>
              <input
                type="text"
                name="precision"
                value={initialUnitData.precision}
                placeholder="Unit Precision"
                onChange={handleInputChange}
                className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-10"
              />
            </div>

            <div className="flex justify-end gap-2 mb-3">
              <Button type="submit" variant="primary" size="sm">
                Save
              </Button>
              <Button variant="secondary" size="sm" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default EditUnitMeasurement;
