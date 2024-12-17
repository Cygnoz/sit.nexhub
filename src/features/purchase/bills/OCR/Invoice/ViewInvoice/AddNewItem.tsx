import { useState } from "react";
import Button from "../../../../../../Components/Button";
import PlusCircle from "../../../../../../assets/icons/PlusCircle";
import Modal from "../../../../../../Components/model/Modal";
import CehvronDown from "../../../../../../assets/icons/CehvronDown";
import { Link } from "react-router-dom";

const AddNewItem = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isService, setIsService] = useState<boolean>(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <div>
      <div className="flex items-center justify-center ">
        <Button
          variant="primary"
          size="sm"
          onClick={openModal}
          className=" px-[80%] "
        >
          <PlusCircle color="white" />{" "}
          <p className="text-sm font-medium">Create</p>
        </Button>
      </div>

      <Modal open={isModalOpen} onClose={closeModal} className="w-[40%]">
        <div className="p-5 mt-3">
          <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden">
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

          <form className="text-start space-y-3">
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
                      setIsService(false);
                    }}
                  >
                    <input
                      id="goods"
                      type="radio"
                      name="itemType"
                      value="goods"
                      className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                        isService
                          ? "border-8 border-[#97998E]"
                          : "border-1 border-[#97998E]"
                      }`}
                    />
                    <div
                      className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                        !isService ? "bg-neutral-50" : "bg-transparent"
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
                      setIsService(true);
                    }}
                  >
                    <input
                      id="service"
                      type="radio"
                      name="itemType"
                      value="service"
                      className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                        isService
                          ? "border-8 border-[#97998E]"
                          : "border-1 border-[#97998E]"
                      }`}
                      // checked={initialItemData.itemType === "service"}
                      // onChange={handleInputChange}
                    />
                    <div
                      className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                        isService ? "bg-neutral-50" : "bg-transparent"
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

            <div className="">
              <label
                className=" block text-slate-600 text-sm mb-0.5"
                htmlFor="itemName"
              >
                Name
              </label>

              <input
                className="pl-3 text-sm w-[100%] mt-0.5 rounded-md text-start  bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Enter Name"
                name="itemName"
              />
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
                  // value={initialItemData.unit}
                  readOnly
                  className="cursor-pointer appearance-none mt-0.5 w-full items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  placeholder="Select Unit"
                  // onClick={() => toggleDropdown("unit")}
                />
                <div className="cursor-pointer pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
              {/* {openDropdownIndex === "unit" && (
                    <div
                      ref={dropdownRef}
                      className="absolute w-[100%] z-10 bg-white rounded-md mt-1 p-2 space-y-1 border border-inputBorder"
                    >
                      {itemsData.unitName &&
                        itemsData.unitName.map(
                          (unit: string, index: number) => (
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
                          )
                        )}
                      <NewUnit page="item" />
                    </div>
                  )} */}
            </div>

            <div className="">
              <label
                className=" block text-slate-600 text-sm mb-0.5"
                htmlFor="itemName"
              >
                Selling Price
              </label>

              <input
                className="pl-3 text-sm w-[100%] mt-0.5 rounded-md text-start  bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Enter Name"
                name="itemName"
              />
            </div>

            <div className="">
              <label
                className=" block text-slate-600 text-sm mb-0.5"
                htmlFor="itemName"
              >
                Description
              </label>

              <input
                className="pl-3 text-sm w-[100%] mt-0.5 rounded-md text-start  bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Enter Name"
                name="itemName"
              />
            </div>

            <div className="justify-end me-5 flex gap-4 p-2">
              <Link to="">
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-sm pl-8 pr-8"
                >
                  Cancel
                </Button>
              </Link>
              <Button variant="primary" size="sm" className="text-sm pl-8 pr-8">
                Save
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddNewItem;
