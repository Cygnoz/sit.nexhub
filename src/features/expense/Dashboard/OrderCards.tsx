import React from "react";

type CardProps = {
  icon: React.ElementType; // Corrected prop type
  title: string;
  count: string;
  rating?: string;
  active?: boolean;
  onClick?: () => void;
};



const OrderCards: React.FC<CardProps> = ({
  icon: Icon,
  title,
  count,
  onClick,
}) => {
  return (
    <div
      className={`bg-[white] rounded-lg px-3 py-2 w-[100%] flex  items-center gap-4`}
      onClick={onClick}
    >
      <div className="rounded-full w-[55px] h-[55px] flex items-center justify-center bg-[#f8e9da]">
        <Icon className="w-6 h-6" />
      </div>

      <div>
        {" "}
        <p
          className="text-[#303F58] font-extrabold text-2xl"
        >
          {count}
        </p>
        <h2 className="text-[14px] font-bold text-[#4B5C79]">{title}</h2>
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-center"></div>
        </div>
      </div>
    </div>
  );
};

export default OrderCards;
