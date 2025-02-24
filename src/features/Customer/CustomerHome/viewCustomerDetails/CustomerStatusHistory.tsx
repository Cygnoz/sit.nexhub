import { useState, useEffect, useRef } from "react";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import Calender from "../../../../assets/icons/Calender";
import CehvronDown from "../../../../assets/icons/CehvronDown";

type Props = {
    id: string | undefined;
};

function CustomerStatusHistory({ id }: Props) {
    const { request: GetAllHistory } = useApi("get", 5002);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const dateInputRef = useRef<HTMLInputElement>(null);
    const fetchAllAccounts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const url = `${endponits.GET_CUSTOMER_HISTORY}/${id}`;
            const { response, error } = await GetAllHistory(url);
            if (!error && response) {
                setHistoryData(response.data);
                setFilteredData(response.data);
            } else {
                setError("Failed to fetch customer history.");
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllAccounts();
    }, []);

   
      
      const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const date = event.target.value;
          setSelectedDate(date);
      
          if (date) {
              const filtered = historyData.filter((item: any) => {
                  const formattedDate = new Date(item.createdDate).toISOString().split("T")[0]; 
                  return formattedDate === date;
              });
              setFilteredData(filtered);
          } else {
              setFilteredData(historyData);
          }
      };
    

    const getCircleStyle = (title: string) => {
        switch (title) {
            case "Contact Added":
                return { bgColor: "bg-[#97998E]", text: "tg" };
            case "Invoice Created":
                return { bgColor: "bg-[#B9AD9B]", text: "rss" };
            default:
                return { bgColor: "bg-[#820000]", text: "" };
        }
    };

    return (
        <div>
            <div className="">
                <div className="flex justify-between">
                    <h3 className="text-[#303F58] mt-1.5 text-xl font-bold">Customer Status History</h3>
                    <div
      className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center cursor-pointer bg-white"
      onClick={() => dateInputRef.current?.showPicker()} 
    >
      <div className="pointer-events-none flex items-center px-2 text-gray-700">
        <Calender color="gray" height={18} width={18} />
      </div>

      <span className={`${selectedDate ? "text-textColor" : "text-textColor"}`}>
        {selectedDate ? selectedDate : "Select Date"}
      </span>

      <div className="pointer-events-none flex items-center px-2 text-gray-700">
        <CehvronDown color="gray" />
      </div>

      {/* Hidden but accessible input */}
      <input
        ref={dateInputRef}
        type="date"
        className="absolute inset-0 opacity-0 cursor-pointer"
        max={new Date().toISOString().split("T")[0]}
        value={selectedDate}
        onChange={handleDateChange}
      />
    </div>
</div>



                </div>
                {isLoading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!isLoading && !error && filteredData.length === 0 && (
                   <div className="flex items-center justify-center my-10 text-[red]"> <p>No History available.</p></div>
                )}
                <div className="flex max-w-full px-2 overflow-x-auto hide-scrollbar mt-3">
                    {filteredData.map((item: any, index: number) => {
                        const circleStyle = getCircleStyle(item?.title);
                        return (
                            <div key={index} className="min-w-[250px] max-w-[250px] mx-2 flex-shrink-0 py-3 text-textColor">
                                <div>
                                    <div className="flex items-center w-full">
                                        <div
                                            className={`w-8 h-8 z-10 ${circleStyle.bgColor} flex items-center pt-4 justify-center rounded-full text-white`}
                                        >
                                            {item.initials}
                                        </div>
                                        <div className="flex-1 h-px bg-[#DADBDD] ml-1"></div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-start mt-2">
                                    <div className="flex space-x-3 text-[12px] py-1">
                                        <p>{item.createdDate}</p> <p>{item.createdTime}</p>
                                    </div>
                                    <p className="font-bold text-[14px]">{item.title}</p>
                                    <p className="text-[12px] px-1">{item.description}</p>
                                    <div className="flex space-x-4 font-bold text-[14px]">
                                        <p>{item.author}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
    );
}

export default CustomerStatusHistory;
