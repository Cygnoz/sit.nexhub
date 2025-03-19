import { useState } from "react";
import SettingsIcons from "../../../../assets/icons/SettingsIcon";
import Banner from "../../banner/Banner";
import Preferences from "./Preferences";
import Vehicle from "./Vehicle";
import Categories from "./Categories";

type Props = {};

const ExpensesHome = ({}: Props) => {
  const [selectedTab, setSelectedTab] = useState("Preference");

  return (
    <div className="my-2 mx-5">
      <Banner />
      <p className="text-textColor font-semibold text-lg my-3">Expenses</p>
      <div>
        <div className="bg-white rounded-lg w-full h-[52px] flex py-2 px-4 overflow-x-auto gap-2">
          <div
            className={`flex items-center w-full rounded-md text-textColor gap-2 justify-center cursor-pointer font-bold ${
              selectedTab === "Preference" ? "bg-[#E3E6D5]" : ""
            }`}
            onClick={() => setSelectedTab("Preference")}
          >
            <SettingsIcons color="#303F58" bold={2} /> Preference
          </div>
          <div
            className={`flex items-center w-full rounded-md text-textColor gap-2 justify-center cursor-pointer  font-bold ${
              selectedTab === "Vehicle" ? "bg-[#E3E6D5]" : ""
            }`}
            onClick={() => setSelectedTab("Vehicle")}
          >
            <SettingsIcons color="#303F58" bold={2} /> Vehicle
          </div>
          <div
            className={`flex items-center w-full rounded-md text-textColor gap-2 justify-center cursor-pointer font-bold ${
              selectedTab === "Categories" ? "bg-[#E3E6D5]" : ""
            }`}
            onClick={() => setSelectedTab("Categories")}
          >
            <SettingsIcons color="#303F58" bold={2} /> Categories
          </div>
          <div
            className={`flex items-center w-full rounded-md text-textColor gap-2 justify-center cursor-pointer font-bold ${
              selectedTab === "Field Customization" ? "bg-[#E3E6D5]" : ""
            }`}
            onClick={() => setSelectedTab("Field Customization")}
          >
            <SettingsIcons color="#303F58" bold={2} /> Field Customization
          </div>
        </div>

        {selectedTab== "Preference"&& <Preferences /> }


        {selectedTab == "Vehicle" && <Vehicle/>}

        {selectedTab =="Categories" && <Categories/>}
      </div>
    </div>
  );
};

export default ExpensesHome;
