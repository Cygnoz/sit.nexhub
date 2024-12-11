import { useState, useEffect } from "react";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";

type Props = {
    id: string | undefined;
};
function CustomerStatusHistory({ id }: Props) {
    const { request: GetAllHistory } = useApi("get", 5002);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [historyData, setHistoryData] = useState([]);

    const fetchAllAccounts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const url = `${endponits.GET_CUSTOMER_HISTORY}/${id}`;
            const { response, error } = await GetAllHistory(url);
            if (!error && response) {
                console.log(response);

                setHistoryData(response.data);
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
    const formatDateTime = (dateString: string) => {
        const [datePart, timePart] = dateString.split(" ");
        const [hoursString, minutes] = timePart.split(":");
        let period = "AM";

        let hours = parseInt(hoursString);

        if (hours >= 12) {
            period = "PM";
            hours = hours > 12 ? hours - 12 : hours;
        } else if (hours === 0) {
            hours = 12;
        }

        const formattedTime = `${hours}:${minutes} ${period}`;

        return { date: datePart, time: formattedTime };
    };
    return (
        <div>
            <div className=" ">
                <div className="flex justify-between">
                    <h3 className="text-[#303F58]  mt-1.5 text-xl font-bold">Customer Status History</h3>
                    <div>
                        <input
                            type="date"
                            className="text-sm mt-1 w-72 rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                            max={new Date().toISOString().split("T")[0]}
                            value=""
                        />
                    </div>
                </div>
                {isLoading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!isLoading && !error && historyData.length === 0 && (
                    <p>No history available.</p>
                )}
                <div className="flex max-w-full px-2 overflow-x-auto hide-scrollbar mt-3">
                    {historyData.map((item: any, index: number) => {
                        const circleStyle = getCircleStyle(item.title);
                        const { date, time } = formatDateTime(item.date);
                        return (
                            <div key={index} className="min-w-[250px] max-w-[250px] mx-2 flex-shrink-0 py-3">
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
                                    <div className="flex space-x-3 text-[14px]">
                                        <p>{date}</p>
                                        <p>{time}</p>
                                    </div>
                                    <p className="font-bold text-[14px] py-1">{item.title}</p>
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
        </div>
    )
}

export default CustomerStatusHistory