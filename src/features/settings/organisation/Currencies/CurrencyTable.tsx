import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import TrashCan from "../../../../assets/icons/TrashCan";
import { CurrencyResponseContext } from "../../../../context/ContextShare";
import EditCurrencyModal from "./EditCurrencyModal";

const CurrencyTable = () => {
  const { request: get_currencies } = useApi("get", 5004);
  const tableHeaders = ["Name", "Symbol", "Actions"];
  const [currenciesData, setCurrenciesData] = useState<any[]>([]);

  const [selectedCurrency, setSelectedCurrency] = useState<any | null>(null);
  const { currencyResponse } = useContext(CurrencyResponseContext)!;
  const { request: deleteCurrencyRequest } = useApi("delete", 5004);

  const getHandleCurrencies = async () => {
    try {
      const url = `${endponits.GET_CURRENCIES}`;
      const { response, error } = await get_currencies(url);
      if (!error && response) {
        setCurrenciesData(response.data);
        console.log(response, "currencyData");
      }
    } catch (error) {
      console.log("Error in fetching currency data", error);
    }
  };

  const handleDelete = async (currencyId: string) => {
    try {
      const url = `${endponits.DELETE_CURRENCIES(currencyId)}`;
      const { response, error } = await deleteCurrencyRequest(url);

      if (!error && response) {
        toast.success(response.data.message);
        getHandleCurrencies();
      } else {
        console.error(`Error deleting currency: ${error.message}`);
      }
    } catch (error) {
      console.error("Error in delete operation", error);
    }
  };

  useEffect(() => {
    getHandleCurrencies();
  }, [currencyResponse]);

  return (
    <div className="space-y-4 pt-2">
      <div>
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] w-full text-center text-dropdownText sticky bg-red-500">
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
            {currenciesData.map((item: any, index: number) => (
              <tr className="relative" key={index}>
                <td className="py-4 px-4 border-y border-tableBorder">
                  <p>
                    {item.currencyCode}-{item.currencyName}{" "}
                    {item.baseCurrency && (
                      <span className="px-2 py-1 bg-[#6FC7A2] text-white">
                        Base Currency
                      </span>
                    )}
                  </p>
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.currencySymbol}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <div className="flex justify-center gap-2 items-center">
                    <div className="h-[26px] justify-start items-start inline-flex">
                      <div className="#fefdfa">
                        <div className="#565148 border px-[10px] py-1 rounded-lg">
                          <p
                            // to={`/settings/currencies/exchange-rates/${item._id}`}
                          >
                            View Exchange Rate
                          </p>
                        </div>
                      </div>
                    </div>
                    <div onClick={() => setSelectedCurrency(item)}>
                      <EditCurrencyModal selectedCurrency={selectedCurrency} />
                    </div>
                    {item.baseCurrency == false && (
                      <div onClick={() => handleDelete(item._id)}>
                        <TrashCan color={"red"} />
                      </div>
                    )}
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
