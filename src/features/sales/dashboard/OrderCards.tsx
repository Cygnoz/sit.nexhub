import React from "react";
import { cva } from "class-variance-authority";

type CardProps = {
  icon: React.ReactNode;
  title: string;
  count: string;
  rating: string;
};

const cardVariants = cva("rounded-xl px-4", {
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

const OrderCards: React.FC<CardProps> = ({ icon, title, count }) => {
  return (
    <div className={`${cardVariants({ active: false })} w-full py-4 my-2 px-2`}>
      <div className="flex gap-4 justify-start items-center">
        <div className="">
          {icon}
        </div>
        <div>
          <p className="text-[#303F58] font-extrabold text-2xl">{count}</p>
          <h2 className="text-sm font-semibold text-[#4B5C79]">{title}</h2>
        </div>
      </div>
    </div>
  );
};

export default OrderCards;
