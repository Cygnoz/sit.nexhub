import  { useState } from "react";
import deliveryBox from "../../../assets/Images/delivery-box_4047598 1.png";
import van from "../../../assets/Images/Group (1).png";
import timeSettings from "../../../assets/Images/Group.png";
import shoppingBag from "../../../assets/Images/shopping-bag_6948334 1.png";
import PurchaseCardsOrder from "./PurchaseCardsOrder"
import productPacking from "../../../assets/Images/packing_4536852 1.png"
type Props = {};

const PurchaseCards = ({}: Props) => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setActiveCard(index);
  };

  const cards = [
    {
      icon: shoppingBag,
      title: "Total Purchase",
      count: "2780",
      rating: "12,95%",
    },
    {
      icon: timeSettings,
      title: "Active Suppliers",
      count: "45",
      rating: "8%",
    },
    {
      icon: productPacking,
      title: "Frequently Ordered Item",
      count: "60",
      item: "| Asus Laptops",
      rating: "12,95%",
    },
    {
      icon: van,
      title: "Average Order Value",
      count: "₹50,0000",
      rating: "18,95%",
    },
    {
      icon: deliveryBox,
      title: "Top Supplier Spend",
      count: "20,000",
      item: "| Supplier A",
      rating: "10%",
    },
  ];

  return (
    <div>
      <div className="flex space-x-4 justify-center">
        {cards.map((card, index) => (
          <PurchaseCardsOrder
            key={index}
            icon={card.icon}
            title={card.title}
            count={card.count}
            item={card.item}
            rating={card.rating}
            active={activeCard === index}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default PurchaseCards;
