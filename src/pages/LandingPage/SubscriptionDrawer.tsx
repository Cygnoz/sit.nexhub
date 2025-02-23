import { useState } from "react";
import SubscriptionIcon from "../../assets/icons/SubscriptionIcon";
import Drawer from "../../Components/drawer/drawer";
import defaultImage from "../../assets/Images/Ellipse 268.png";
import Button from "../../Components/Button";

type Props = { mode?: boolean };

function SubscriptionDrawer({ mode }: Props) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={toggleDrawer}
      >
        <SubscriptionIcon color={mode ? "#4B5C79" : "#DFE1E2"} />
        <p>Subscription</p>
      </div>

      <Drawer
        onClose={toggleDrawer}
        open={isDrawerOpen}
        position="right"
        style={{ backgroundColor: !mode ? "#14181B" : "#FEFDFA", width: "34%" }}
      >
        <div
          className={`${
            !mode
              ? "bg-[#21282C] text-[#FCF8ED]"
              : "bg-[#FDF8F0] text-[#4B5C79]"
          } p-8`}
        >
          <p
            className="text-[#9EA9BB] text-3xl absolute right-4 top-2 cursor-pointer font-light"
            onClick={toggleDrawer}
          >
            &times;
          </p>
          <div className="mt-2 flex justify-between items-center">
            <img
              src={defaultImage}
              className="w-16 h-16 rounded-full object-cover"
              alt=""
            />
            <p className=" font-medium text-xl">360 One Pvt</p>
            <Button
              variant={!mode ? "secondary" : "fourthiary"}
              className="h-8 pl-7 pr-7"
            >
              Trial
            </Button>
          </div>
        </div>

        <div className={`p-12 ${!mode ? "text-white" : "text-[#4B5C79]"}`}>
          <div
            className={`${
              !mode ? "border-[#2C353B]" : "border-[#BEC0C2]"
            } mb-10 flex justify-between items-center border-b  pb-5`}
          >
            <p className=" text-base">Type of subscription</p>
            <p className="text-base font-medium">Trial</p>
          </div>
          <div
            className={`${
              !mode ? "border-[#2C353B]" : "border-[#BEC0C2]"
            } mb-10 flex justify-between items-center border-b  pb-5`}
          >
            <p className=" text-base">Start Date</p>
            <p className="text-base font-medium">20 June 2024</p>
          </div>
          <div
            className={`${
              !mode ? "border-[#2C353B]" : "border-[#BEC0C2]"
            } mb-7 flex justify-between items-center border-b  pb-5`}
          >
            <p className=" text-base">End Date</p>
            <p className="text-base font-medium">28 June 2024</p>
          </div>
        </div>

        <div className="p-6">
          <p className={`${mode ? "text-[#4B5C79]":"text-[#FCF8ED]"}  text-base font-medium mb-4`}>
            Point of Contact
          </p>
          <div className={`${!mode ? "bg-[#21282C]":"bg-[#FDF8F0]"} " p-6 rounded-xl flex items-center gap-5`}>
            <img
              src={defaultImage}
              className="w-14 h-14 rounded-full object-cover"
              alt=""
            />
            <div className={`${mode ? "text-[#4B5C79]":"text-[#FEFDFA]"} `}>
              <p className=" font-medium text-lg mb-2">Ethan Thompson</p>
              <p className="text-base">
                8017987647 &nbsp; | &nbsp; ethanth2@gmail.com
              </p>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default SubscriptionDrawer;
