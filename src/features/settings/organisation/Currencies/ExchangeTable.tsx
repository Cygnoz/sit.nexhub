import { Link } from "react-router-dom";
import Trash2 from "../../../../assets/icons/Trash2";



type Props = {};

const CurrencyTable = ({ }: Props) => {
  const tableHeaders = ["As of Date", "Exchange Rate", "Action"];

  const tableData = [
    {
      current: false,
      aod: "31/07/2024",
      rate: "₹25.00",
    },
    {
      current: true,
      aod: "29/07/2024",
      rate: "₹22.22",
    },

  ];

  return (
    <div className="space-y-4 pt-2 ">
      <div >
        <table className="min-w-full bg-white mb-5 ">
          <thead className="text-[12px] w-full text-center  text-dropdownText sticky bg-red-500">
            <tr style={{ backgroundColor: "#F9F7F0", height: "44px" }}>

              {tableHeaders.map((heading, index) => (
                <th
                  className="py-2 px-4 font-medium border-b border-tableBorder"
                  key={index}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {tableData.map((item, index) => (
              <tr className="relative" key={index}>
                <td className="py-4 px-4 border-y border-tableBorder">
                  <Link to={"/expense/view"}>
                    <p>{item.aod}</p>
                  </Link>
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <p className="flex items-center justify-center relative">
                    {item.rate}
                    {item.current && (
                      <span className="px-2 py-1 ml-2 bg-[#6FC7A2] absolute right-12 text-white text-sm ">
                        Current Rate
                      </span>
                    )}
                  </p>
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder flex justify-center items-center">

                  <div className="border h-[26px] w-[68px] flex items-center space-x-1 justify-center rounded-lg bg-[#FEFDFA]">
                    <Trash2 size={12} color={"black"} />
                    <p className="text-[#565148] text-[12px] mt-[3px]">Delete</p>
                  </div>

                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrencyTable;
