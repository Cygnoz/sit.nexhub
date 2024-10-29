import { useState } from "react";
import CehvronDown from "../../../../assets/icons/CehvronDown";
import Pen from "../../../../assets/icons/Pen";
import TrashCan from "../../../../assets/icons/TrashCan";
import CirclePlus from "../../../../assets/icons/circleplus";

type Props = {};

const tableHeaders=[
    "Start Date",
    "Mileage Rate",
    "Actions"
]

const Preferences = ({}: Props) => {
  const [selected, setSelected] = useState<string | "">("");
  return (
    <div>
      <div className="bg-white rounded-lg p-5 my-4 text-sm">
        <div className="flex text-textColor   items-center gap-4">
          <p className="mt-2">Default Mileage Account</p>{" "}
          <div className="relative w-60 mt-3 ">
            <select
              name=""
              id=""
              className="block appearance-none w-full text-zinc-400 bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
            >
              <option value="">Fuel/Mileage Expenses</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <CehvronDown color="gray" />
            </div>
          </div>
        </div>
        <div className="flex text-textColor  items-center gap-4 mt-4">
          <p className="mt-2">Default Unit</p>{" "}
          <div className="flex items-center space-x-4 text-textColor text-sm">
            <div className="flex gap-2 justify-center items-center ms-24">
              <div
                className="grid place-items-center mt-1"
                onClick={() => {
                  setSelected("km");
                }}
              >
                <input
                  id="km"
                  type="radio"
                  name="distance"
                  className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                    selected === "km"
                      ? "border-8 border-[#97998E]"
                      : "border-1 border-[#97998E]"
                  }`}
                  checked={selected === "km"}
                  onChange={() => setSelected("km")}
                />
                <div
                  id="km-indicator"
                  className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                    selected === "km" ? "bg-neutral-50" : "bg-transparent"
                  }`}
                />
              </div>
              <label htmlFor="km" className="text-start font-medium">
                Km
              </label>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <div
                className="grid place-items-center mt-1"
                onClick={() => {
                  setSelected("mile");
                }}
              >
                <input
                  id="mile"
                  type="radio"
                  name="distance"
                  className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                    selected === "mile"
                      ? "border-8 border-[#97998E]"
                      : "border-1 border-[#97998E]"
                  }`}
                  checked={selected === "mile"}
                  onChange={() => setSelected("mile")}
                />
                <div
                  id="mile-indicator"
                  className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                    selected === "mile" ? "bg-neutral-50" : "bg-transparent"
                  }`}
                />
              </div>
              <label htmlFor="mile" className="text-start font-medium">
                Mile
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 text-textColor rounded-lg">
        <p className="font-bold text-pdftext">
          Mileage Preference
        </p>
        <p className="text-sm font-normal me-10 mt-2">Any mileage expense recorded on or after the start date will have the corresponding mileage rate. You can create a default rate (created without
            specifying a date), which will be applicable for mileage expenses recorded before the initial start date</p>
      </div>

      <div className="bg-white p-5 mt-5 rounded-lg">
      <div className="border rounded-md border-tableBorder pb-4">
            <table className="min-w-full bg-white rounded-md">
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
              <tbody className="text-center text-dropdownText">
                  <tr className="border-b border-tableBorder" >
                  
                    <td className="py-4 whitespace-nowrap text-sm">
                     dd/mm/yyyy
                    </td>
                    
                    <td className="py-4 whitespace-nowrap text-sm">
                     23,0000
                    </td>
                    <td className="py-4 whitespace-nowrap text-sm flex gap-3 items-center justify-center">
                     <Pen color={"#3C7FBC"}/> 
                     <TrashCan color={"red"}/>
                    </td>
                   
                  </tr>
                
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 mt-5">
        <CirclePlus color={"darkRed"} size={"15"}/>
        <p className="text-darkRed font-bold text-sm">Add mileage rate</p>
      </div>
      </div>

     
    </div>
  );
};

export default Preferences;
