import { FormEvent, useContext, useState } from "react";
import Button from "../../../Components/Button";
import CirclePlus from "../../../assets/icons/circleplus";
import bgImage from "../../../assets/Images/12.png";

import Modal from "../../../Components/model/Modal";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import toast from "react-hot-toast";
import { UnitResponseContext } from "../../../context/ContextShare";
import SettingsIcons from "../../../assets/icons/SettingsIcon";

type Props = { page?: string };

interface UnitData {
  unitName: string;
  symbol: string;
  quantityCode: string;
  precision: string;
}


const NewUnit = ({ page }: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);


  const { setUnitResponse } = useContext(UnitResponseContext)!;
  const { request: addnewunit } = useApi("post", 5003);


  const [initialUnitData, setInitialUnitData] = useState<UnitData>(
    {
      unitName: "",
      symbol: "",
      quantityCode: "",
      precision: "",

    });

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setInitialUnitData({
      unitName: "",
      symbol: "",
      quantityCode: "",
      precision: "",

    })
  };


  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, } = event.target;

    setInitialUnitData({ ...initialUnitData, [name]: value })
  };



  const handleSave = async (e: FormEvent) => {
    e.preventDefault();


    try {
      const url = `${endponits.ADD_UNIT}`;
      const body = initialUnitData;

      const { response, error } = await addnewunit(url, body);
      if (!error && response) {
        toast.success(response.data.message);
        console.log(response);
        setModalOpen(false);

        setUnitResponse((prevUnitResponse: any) => ({
          ...prevUnitResponse,
          ...body,
        }));
        setInitialUnitData({
          unitName: "",
          symbol: "",
          quantityCode: "",
          precision: "",
        })



      } else {
        console.log(error);
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <div>
        {
          page == "item" ? <div onClick={openModal} className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4 px-4 text-darkRed flex text-sm gap-2 font-bold">
            <SettingsIcons color="darkRed" bold={2} />
            <p className="mt-0.5">Manage Unit</p>
          </div>
            :
            <Button
              onClick={openModal}
              variant="primary"
              className="flex items-center"
              size="sm"
            >
              <CirclePlus color="white" size="14" />{" "}
              <p className="text-md">New Unit</p>
            </Button>}

        <Modal open={isModalOpen} onClose={closeModal} style={{ width: "39%" }}>
          <div className="p-5 mt-3">
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
                  Create Unit
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
              <div className="">
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-labelColor">
                    Name
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
                <div>
                  <label className="block text-sm mb-1 text-labelColor">
                    Unit Quantity
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      name="quantityCode"
                      value={initialUnitData.quantityCode}
                      placeholder="Unit Quantity"
                      onChange={handleInputChange}
                      className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-10">

                    </input>

                  </div>
                </div>

                <div>
                  <label className="block text-sm my-3 text-labelColor">
                    Unit Precision
                  </label>
                  <div className="relative w-full">
                    <input

                      type="text"
                      name="precision"
                      value={initialUnitData.precision}
                      placeholder="Unit Precision"
                      onChange={handleInputChange}
                      className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-10"></input>


                  </div>
                </div>


                <br />
                <div className="flex justify-end gap-2 mb-3">


                  <Button type="submit" variant="primary" size="sm">
                    Save
                  </Button>
                  <Button variant="secondary" size="sm" onClick={closeModal}>

                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default NewUnit;
