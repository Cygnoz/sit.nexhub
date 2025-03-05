import React from "react";
import { cva } from "class-variance-authority";

type CardProps = {
  icon: any;
  item?: string;
  title: string;
  count: string;
  rating: string;
  active?: boolean;
  onClick?: () => void;
  iconBg?:any

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

const Card: React.FC<CardProps> = ({ icon: Icon, title, iconBg, count, active = false, onClick }) => {
  return (
    <div className={`${cardVariants({ active })} p-2.5 rounded-lg w-[100%] flex items-center gap-2`} onClick={onClick}>
      <div className={`rounded-full w-[52px] h-[52px] flex items-center justify-center ${iconBg}`}>
      <Icon />
      </div>
      <div >
      <p className="font-bold text-xl ">  {count}</p>
      <p className="text-sm font-semibold whitespace-nowrap">{title}</p>
      </div>
     
    </div>
  );
};

export default Card;
