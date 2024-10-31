import  { useState } from "react";
import toatalInvImage from "../../../assets/Images/Group 2513.png";
import totalSalesImage from "../../../assets/Images/Group 2517.png";
import pendingImage from "../../../assets/Images/Group 2514.png";
import pendingSalesImage from "../../../assets/Images/Group 2518.png";
import PurchaseCardsOrder from "./PurchaseCardsOrder";
type Props = {};

const PurchaseCards = ({}: Props) => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setActiveCard(index);
  };

  const cards = [
    {
      icon: toatalInvImage,
      title: "Total Purchase",
      count: "2780",
      rating: "12,95%",
    },
    {
      icon: totalSalesImage,
      title: "Active Suppliers",
      count: "45",
      rating: "8%",
    },
    {
      icon: pendingImage,
      title: "Frequently Ordered Item",
      count: "60",
      item: "| Asus Laptops",
      rating: "12,95%",
    },
    {
      icon: pendingSalesImage,
      title: "Average Order Value",
      count: "₹50,0000",
      rating: "18,95%",
    },
    {
      icon: totalSalesImage,
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
