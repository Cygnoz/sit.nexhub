import { useState } from "react";
import OrderCards from "./OrderCards"
import toatalInvImage from "../../../assets/Images/Group 2513.png";
import totalSalesImage from "../../../assets/Images/Group 2517.png";
import pendingImage from "../../../assets/Images/Group 2514.png";
import pendingSalesImage from "../../../assets/Images/Group 2518.png";
type Props = {}

const Cards = ({}: Props) => {
  const [activeCard, setActiveCard] = useState<number | null>();

  const handleCardClick = (index: number) => {
    setActiveCard(index);
  };

  const cards = [
    {
      icon: toatalInvImage,
      title: "Order placed",
      count: "Lorem ipsum dolor sit amet",
      rating: 100,
    },
    {
      icon: totalSalesImage,
      title: "Processing",
      count: "Lorem ipsum dolor sit amet",
      rating: 100,
    },
    {
      icon: pendingImage,
      title: "Packing",
      count: "Lorem ipsum dolor sit amet",
      rating: 10,
    },
    {
      icon: toatalInvImage,
      title: "Dispatch",
      count: "Lorem ipsum dolor sit amet",
      rating: 8,
    },
    {
      icon: pendingSalesImage,
      title: "Delivered",
      count: "Lorem ipsum dolor sit amet",
      rating: 10,
    },
  ];

  return (
    <div>
      <div className="flex space-x-4 justify-center">
        {cards.map((card, index) => (
          <OrderCards
            key={index}
            icon={card.icon}
            title={card.title}
            count={card.count}
            rating={card.rating}
            active={activeCard === index}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Cards;
