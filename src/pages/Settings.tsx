import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import organizationImg from "../assets/Images/Rectangle 5415.png";
import taximg from "../assets/Images/Rectangle 5415 (1).png";
import usersImg from "../assets/Images/Rectangle 5415 (2).png";
import preferencesImg from "../assets/Images/Rectangle 5415 (3).png";
import salesImg from "../assets/Images/Rectangle 5415 (4).png";
import purchaseImg from "../assets/Images/Rectangle 5415 (5).png";
import itemsImg from "../assets/Images/Rectangle 5415 (6).png";
import paymentImg from "../assets/Images/Rectangle 5415 (7).png";
import CustomizationImg from "../assets/Images/Rectangle 5415 (8).png";
import reminderImg from "../assets/Images/Rectangle 5415 (9).png";
import rewardImg from "../assets/Images/Rectangle 5415 (10).png";
import Button from "../Components/Button";
import SearchBar from "../Components/SearchBar";
import ArrowrightUp from "../assets/icons/ArrowrightUp";

interface Setting {
  title: string;
  description: string;
  imageUrl: any;
  route: string;
}

const settingsData: Setting[] = [
  {
    title: "Organization",
    description: "Manage organization settings",
    imageUrl: organizationImg,
    route: "/settings/organization/profile",
  },
 
  {
    title: "Taxes & Compliance",
    description: "Manage taxes and compliance settings",
    imageUrl: taximg,
    route: "/settings/taxes",
  },
  {
    title: "Users & Roles",
    description: "Manage users and roles settings",
    imageUrl: usersImg,
    route: "/settings/users-roles",
  },
  {
    title: "Preferences",
    description: "Manage system preferences",
    imageUrl: preferencesImg,
    route: "/settings/preferences",
  },
  {
    title: "Sales",
    description: "Manage sales settings",
    imageUrl: salesImg,
    route: "/settings/sales",
  },
  {
    title: "Purchases",
    description: "Manage purchases settings",
    imageUrl: purchaseImg,
    route: "/settings/purchases",
  },
  {
    title: "Items",
    description: "Manage item settings",
    imageUrl: itemsImg,
    route: "/settings/items/item",
  },
  {
    title: "Online Payments",
    description: "Manage online payment settings",
    imageUrl: paymentImg,
    route: "/settings/online-payments",
  },
  {
    title: "Customization",
    description: "Manage customization settings",
    imageUrl: CustomizationImg,
    route: "/settings/customization",
  },
  {
    title: "Reminder & Notification",
    description: "Manage reminder and notification settings",
    imageUrl: reminderImg,
    route: "/settings/reminder-notification",
  },
  {
    title: "Reward Settings",
    description: "Manage reward settings",
    imageUrl: rewardImg,
    route: "settings/rewards",
  },
];

const SettingCard: React.FC<Setting> = ({
  title,
  description,
  imageUrl,
  route,
}) => (
  <div className="bg-white rounded-[4px] shadow-md  text-center">
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-24 object-cover rounded-t-[4px]"
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

const Settings: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate(); 

  const handleGoBack = () => {
    navigate(-1); 
  };

  const filteredSettings = settingsData.filter((setting) =>
    setting.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-bold min-w-fit">All Settings</h1>
        <div className="ml-auto flex gap-4 w-full">
          <div className="w-[50%] ml-auto">
            <SearchBar
              placeholder="Search"
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>
          <button
            onClick={handleGoBack}
            className="bg-white  px-4 py-1   rounded-lg border-textColor border text-sm"
          >
            Close <span className="text-lg ms-1 -mt-1"> &times;</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14">
        {filteredSettings.map((setting) => (
          <SettingCard key={setting.title} {...setting} />
        ))}
      </div>
    </div>
  );
};

export default Settings;
