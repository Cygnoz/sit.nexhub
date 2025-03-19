import  { useState } from "react";
import PurchaseCardsOrder from "./PurchaseCardsOrder";
import UserRounded from "../../../assets/icons/UserRounded";
import IndianRupeeBadge from "../../../assets/icons/IndianRupeeBadge";
import BoxIcon from "../../../assets/icons/BoxIcon";
import DollerSign from "../../../assets/icons/DollerSign";

type Props = {
  data?:any
};

const PurchaseCards = ({data}: Props) => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  console.log("data",data);
  
  const handleCardClick = (index: number) => {
    setActiveCard(index);
  };

  const cards = [
    {
      icon: UserRounded,
      title: "Total Purchase Value",
      count: data?.totalRevenue ||0,
      rating: "12,95%",
      iconBg:"bg-[#f8e9dd]"
    },
    {
      icon: IndianRupeeBadge,
      title: "Total Purchase Orders",
      count: data?.totalPurchaseOrder,
      rating: "8%",
      iconBg:"bg-[#f6e7cf]"

    },
    {
      icon: BoxIcon,
      title: "Total Items Purchased  ",
      count: data?.totalItemPurchased,
      item: "| Asus Laptops",
      rating: "12,95%",
      iconBg:"bg-[#eadadb]"

    },
    {
      icon: DollerSign,
      title: "Total No: of Payment Made",
      count: data?.totalPaymentMade,
      rating: "18,95%",
      iconBg:"bg-[#eaeceb]"

    },
    {
      icon: DollerSign,
      title: "Total Shipments",
      count: data?.totalShipments,
      item: "| Supplier A",
      rating: "10%",
      iconBg:"bg-[#eaeceb]"

    },
  ];

  return (
    <div>
      <div className="flex-row sm:flex space-x-0 sm:space-x-4 justify-center overflow-x-auto">
        {cards.map((card, index) => (
          <PurchaseCardsOrder
            key={index}
            icon={card.icon}
            title={card.title}
            count={card.count}
            item={card.item}
            rating={card.rating}
            active={activeCard === index}
            iconBg={card.iconBg}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default PurchaseCards;
