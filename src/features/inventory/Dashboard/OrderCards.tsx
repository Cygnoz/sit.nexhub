import React from "react";
import { cva } from "class-variance-authority";
import ArrowIconNoUnderline from "../../../assets/icons/ArrowIconNoUnderline";
import ArrowDownIcon from "../../../assets/icons/ArrowDownIcon";

type CardProps = {
  icon: string;
  title: string;
  count: string;
  rating: number; // Ensure this is a number
  active?: boolean;
  onClick?: () => void;
};

const cardVariants = cva("rounded-xl px-4 cursor-pointer", {
  variants: {
    active: {
      true: "bg-cardBg border-cardBorder border-2",
      false: "bg-white border-gray-300",
    },
  },
  defaultVariants: {
    active: false,
  },
});

const OrderCards: React.FC<CardProps> = ({ icon, title, count, rating, active = false, onClick }) => {
  const isRatingNegative = rating < 0;
  const ratingStyle = isRatingNegative ? "bg-red-300" : "bg-[#D8F2EE]";
  const ratingIcon = isRatingNegative ? (
    <ArrowDownIcon size={16} color="#FF0000" />
  ) : (
    <ArrowIconNoUnderline size={16} color="#32A38E" />
  );

  return (
    <div className={`${cardVariants({ active })} py-4 px-5 w-full`} onClick={onClick}>
      <div className="rounded-full w-8 h-8 mb-2">
        <img src={icon} alt={`${title} icon`} />
      </div>

      <>
        <h2 className="text-[14px] font-bold text-[#303F58]">{title}</h2>
        <p className="text-[#303F58] font-extrabold text-2xl" style={{ color: active ? "#820000" : "" }}>{count}</p>
        <div className="flex justify-between items-center">
          <div className={`text-[12px] p-[4px] font-bold flex items-center ${ratingStyle} rounded-md`}>
            {rating}%{ratingIcon}
          </div>
          <div className="flex items-center px-2 w-full">
            <p className="text-xs text-end">Compared to last month</p>
          </div>
        </div>
      </>
    </div>
  );
};

export default OrderCards;
