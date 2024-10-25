import { useContext, useEffect, useRef, useState } from "react";
import { unitTableHead } from "../../../assets/constants/inventory";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import toast from "react-hot-toast";
import { UnitResponseContext,UnitEditResponseContext} from "../../../context/ContextShare";
import TrashCan from "../../../assets/icons/TrashCan";
import EditUnitMeasurement from "./EditUnitMeasurement";

type Props = {};

const UnitTable = ({}: Props) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [store, setStore] = useState<[] | any>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { unitResponse, } = useContext(UnitResponseContext)!;
  const { unitEditResponse, } = useContext(UnitEditResponseContext)!;

  const { request: addgetunit } = useApi("get", 5003);
  
  const { request: deleteunit } = useApi("delete", 5003);

  const toggleDropdown = (index: number | null) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      toggleDropdown(null);
    }
  };

  useEffect(() => {
    if (openDropdownIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownIndex]);

  const getTables = async () => {
    try {
      const url = `${endponits.GET_ALL_UNIT}`;
      const { response, error } = await addgetunit(url);
      if (!error && response) {
        setStore(response.data);
        console.log(response);
      } else {
        console.log(error);
        // toast.error(error.response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (item: any) => {
    console.log(item);
    try {
      const url = `${endponits.DELETE_UNIT}/${item._id}`;
      const { response, error } = await deleteunit(url);
      if (!error && response) {
        toast.success("Category deleted successfully!");
        getTables();
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error occurred while deleting Category.");
    }
  };

  const handleUpdate = (updatedUnit: any) => {
    setStore((prevStore: any) =>
      prevStore.map((unit: any) =>
        unit._id === updatedUnit._id ? updatedUnit : unit
      )
    );
  };

  useEffect(() => {
    getTables();
  }, [unitResponse,unitEditResponse]);

  return (
    <div className="bg-white p-5 mt-7 rounded-lg relative">
      <div className="rounded-lg border-2 border-tableBorder">
        <table className="min-w-full bg-white relative pb-4">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr className="bg-lightPink">
              {unitTableHead.map((item, index) => (
                <th
                  className="py-2 px-4 font-medium border-b border-tableBorder relative"
                  key={index}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px] relative">
            {store && store.length>0?store.map((item: any, index: number) => (
              <tr className="relative" key={index}>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {index + 1}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.unitName}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.symbol}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.quantityCode}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.precision}
                </td>

                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <div className="flex justify-center items-center gap-2">
                    <EditUnitMeasurement unit={item} onUpdate={handleUpdate} />

                    <button onClick={() => handleDelete(item)}>
                      <TrashCan color={"red"} />
                    </button>
                  </div>
                </td>

                {openDropdownIndex === index && (
                  <div
                    ref={dropdownRef}
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                  >
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    ></div>
                  </div>
                )}
              </tr>
            )):( <tr>
              <td
                colSpan={5} 
                className="text-center py-4 border-y border-tableBorder"
              >
                <p className="text-red-500">No Data Found!</p>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnitTable;
