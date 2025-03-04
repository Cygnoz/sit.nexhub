import ActiveCustomerIcon from "../../../assets/icons/ActiveCustomerIcon";
import CustomerRentationIcon from "../../../assets/icons/CustomerRentationIcon";
import NewCustomerIcon from "../../../assets/icons/NewCustomerIcon";
import TopCustomerIcon from "../../../assets/icons/TopCustomerIcon";
import OrderCards from "./OrderCards"
type Props = {}

const Cards = ({}: Props) => {

  const cards = [
    {
      icon: <TopCustomerIcon/>,
      title: "Total Active Suppliers  ",
      count: "1500",
      rating: "12,95",
    },
    {
      icon: <NewCustomerIcon/>,
      title: "Total Spend on Suppliers",
      count: "120",
      rating: "18,95",
    },
    {
        icon: <ActiveCustomerIcon/>,
        title: "Pending Supplier Payments  ",
        count: "800",
        rating: "12,95",
    },
    {
        icon:<CustomerRentationIcon/> ,
        title: "Total Shipments This Month  ",
        count: "85%",
        rating: "18",
    }
  ];
  return (
    <div>
        <div className="flex justify-between">
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