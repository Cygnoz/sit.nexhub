import ActiveCustomerIcon from "../../../assets/icons/ActiveCustomerIcon";
import CustomerRentationIcon from "../../../assets/icons/CustomerRentationIcon";
import NewCustomerIcon from "../../../assets/icons/NewCustomerIcon";
import TopCustomerIcon from "../../../assets/icons/TopCustomerIcon";
import OrderCards from "./OrderCards";
type Props = {}

const Cards = ({}: Props) => {

  const cards = [
    {
      icon: <TopCustomerIcon/>,
      title: "Total Revenue",
      count: "₹155,000",
      rating: "12,95",
    },
    {
      icon: <NewCustomerIcon/>,
      title: "Accounts Payable",
      count: "456",
      rating: "18,95",
    },
    {
        icon: <ActiveCustomerIcon/>,
        title: "Accounts Receivable",
        count: "500",
        rating: "12,95",
    },
    {
        icon:<CustomerRentationIcon/> ,
        title: "Pending Bills",
        count: "500",
        rating: "18",
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