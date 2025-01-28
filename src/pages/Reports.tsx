import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../Components/SearchBar";
import ArrowrightUp from "../assets/icons/ArrowrightUp";
import dayBook from "../assets/Images/DayBook.png"
import profitAndLoss from "../assets/Images/ProfitAndLoss.png"
import balanceSheet from "../assets/Images/BalanceSheet.png"
import Button from "../Components/Button";

interface reports {
  title: string;
  description: string;
  imageUrl: any;
  route: string;
}

const settingsData: reports[] = [
  {
    title: "Day Book",
    description: "Manage Day Book",
    imageUrl: dayBook,
    route: "/reports/daybook",
  },
 
  {
    title: "Profit and Loss",
    description: "Manage Profit and Loss",
    imageUrl: profitAndLoss,
    route: "/reports/profitandloss",
  },
  {
    title: "Balance Sheet",
    description: "ManageBalance Sheet",
    imageUrl: balanceSheet,
    route: "/reports/balancesheet",
  }
];

const ReportsCard: React.FC<reports> = ({
  title,
  description,
  imageUrl,
  route,
}) => (
  <div className="bg-white rounded-[4px] shadow-md  text-center">
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-24 object-  rounded-t-[4px]"
    />
    <div className="my-5 mx-8 items-center text-sm text-textColor h-28 flex flex-col justify-between">
      <div>
        <h3 className=" text-base font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
      <div className="flex items-center justify-center mt-1">
        <Link to={route}>
          <Button
            variant="secondary"
            size="sm"
            className="bg-blue-500 rounded hover:bg-blue-600 text-sm"
          >
            See Details <ArrowrightUp />
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

const Reports: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const filteredSettings = settingsData.filter((setting) =>
    setting.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-bold min-w-fit">Reports</h1>
        <div className="ml-auto flex gap-4 w-full">
          <div className="w-[50%] ml-auto">
            <SearchBar
              placeholder="Search Reports"
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14">
        {filteredSettings.map((setting) => (
          <ReportsCard key={setting.title} {...setting} />
        ))}
      </div>
    </div>
  );
};

export default Reports;
