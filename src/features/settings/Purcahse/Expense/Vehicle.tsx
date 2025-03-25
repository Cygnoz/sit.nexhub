import { useState } from "react";
import SearchBar from "../../../../Components/SearchBar"
import Button from "../../../../Components/Button";
import Pen from "../../../../assets/icons/Pen";
import TrashCan from "../../../../assets/icons/TrashCan";
import Modal from "../../../../Components/model/Modal";
import bgImage from "../../../../assets/Images/14.png"
type Props = {}

const tableHeaders=[
    "Vehicle Name",
    "Hint",
    "Actions"
]

const tableData=[
    {
        vehicleName:"Maglev",
        hint:"Lorem ipsum sid faact is",

    },
    {
        vehicleName:"Maglev",
        hint:"Lorem ipsum sid faact is",
    },
    {
        vehicleName:"Maglev",
        hint:"Lorem ipsum sid faact is",
    }
]

const Vehicle = ({}: Props) => {

    const [isModalOpen, setModalOpen] = useState<boolean>(false);
const [searchValue, setSearchValue] = useState<string >("");

const openModal = () => {
  setModalOpen(true);
};

const closeModal = () => {
  setModalOpen(false);
};


  return (
    <div className="my-3 bg-white p-4">
<div className="flex gap-3 ">
<SearchBar
        placeholder="Search"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      <Button size="sm" className="text-sm min-w-fit" onClick={openModal}>New Vehicle</Button></div>
      <div className="overflow-x-auto">

      <table className="min-w-full bg-white rounded-md mt-3 ">
              <thead className="text-[12px] text-center text-dropdownText">
                <tr style={{ backgroundColor: "#F9F7F0" }}>
                  {tableHeaders.map((heading, index) => (
                    <th
                      className="py-3 px-8 font-medium border-b border-tableBorder"
                      key={index}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-center text-dropdownText text-sm">
                 {tableData.map((item:any,index:number)=>( <tr key={index} className="border-b border-tableBorder" >
                  
                    <td className="py-3 whitespace-nowrap text-xs">
                    {item.vehicleName}
                    </td>
                    <td className="py-3 whitespace-nowrap text-xs">
                    {item.hint}
                    </td>
                 
                    <td className="py-3 whitespace-nowrap text-sm flex gap-3 items-center justify-center">
                     <Pen color={"#3C7FBC"}/> 
                     <TrashCan color={"red"}/>
                    </td>
                   
                  </tr>))}
                
              </tbody>
            </table>
      </div>





            <Modal open={isModalOpen} onClose={closeModal} className="w-[90%] sm:w-[50%]">
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
               New Vehicle
              </h3>
              
            </div>
            <div
              className="ms-auto text-3xl cursor-pointer relative z-10"
              onClick={closeModal}
            >
              &times;
            </div>
          </div>
            <form className="">
              <div className=" gap-4  p-4 rounded-md">
                <div className="">
                  <label className="block text-sm mb-1 text-labelColor">
                    Vehicle Name
                  </label>
                  <input
                    placeholder="Vehicle name"
                    type="text"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-10"
                  />
                </div>

                <div className="">
                  <label className="block text-sm mb-1 mt-4 text-labelColor">
                    Hint <span className="text-slate-400">(Max 50 Chars)</span>
                  </label>
                  <input
                    placeholder="Value"
                    type="text"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-16"
                  />
                </div>

             

               

                <br />
              </div>
              <div className="flex justify-end gap-2 mb-3 ">
              <Button variant="secondary" size="sm">
                    Cancel
                </Button>
                <Button variant="primary" size="sm">
                    Save
                </Button>
              </div>
            </form>
          </div>
        </Modal>
    </div>
  )
}

export default Vehicle