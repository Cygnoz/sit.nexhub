import ActiveCustomerIcon from "../../assets/icons/ActiveCustomerIcon";
import CustomerRentationIcon from "../../assets/icons/CustomerRentationIcon";
import NewCustomerIcon from "../../assets/icons/NewCustomerIcon";
import TopCustomerIcon from "../../assets/icons/TopCustomerIcon";
import TotalSalesIcon from "../../assets/icons/TotalSalesIcon";
import OrderCards from "./OrderCards";

type Props = {}

const Cards = ({}: Props) => {

  const cards = [
    {
      icon: <TopCustomerIcon/>,
      title: "Total Revenue",
      count: "1500",
      rating: "12,95",
    },
    {
      icon: <NewCustomerIcon/>,
      title: "Total Inventory Value",
      count: "120",
      rating: "18,95",
    },
    {
        icon: <ActiveCustomerIcon/>,
        title: "Total Expenses",
        count: "800",
        rating: "12,95",
    },
    {
        icon:<CustomerRentationIcon/> ,
        title: "New Customer",
        count: "85%",
        rating: "18",
    },
    {
        icon: <TotalSalesIcon/>,
        title: "Total Sales",
        count: "15%",
        rating: "10",
    },
  ];
  return (
    <div>
        <div className="flex justify-between gap-4">
      {cards.map((card, index) => (
        <OrderCards
          key={index}
          icon={card.icon}
          title={card.title}
          count={card.count}
          rating={card.rating}
        />
      ))}
    </div>
    </div>
  )
}

export default Cards