import  { useEffect, useState } from "react";
import useApi from "../../Hooks/useApi";
import { endponits } from "../../Services/apiEndpoints";

type Props = {
  date?: string | Date; 
};

const DateFormat = ({ date }: Props) => {
  const [organization, setOrganization] = useState<any | null>(null);
  const { request: getOneOrganization } = useApi("get", 5004);

  const fetchOrganization = async () => {
    try {
      const url = `${endponits.GET_ONE_ORGANIZATION}`;
      const { response, error } = await getOneOrganization(url);

      if (!error && response) {
        setOrganization(response.data);
      } else {
        console.log("Error fetching organization:", error);
      }
    } catch (error) {
      console.log("Error in fetching organization", error);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, []);

  if (!organization) {
    return null;
  }

  const { dateFormat = "dd/mm/yyyy", dateSplit = "/" } = organization; // Default format if undefined

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (!dateObj || isNaN(dateObj.getTime())) {
    return <span>-</span>;
  }

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    switch (dateFormat) {
      case "mm/dd/yyyy":
        return `${month}${dateSplit}${day}${dateSplit}${year}`;
      case "dd/mm/yyyy":
        return `${day}${dateSplit}${month}${dateSplit}${year}`;
      case "yyyy/mm/dd":
        return `${year}${dateSplit}${month}${dateSplit}${day}`;
      case "mm/dd/yy":
        return `${month}${dateSplit}${day}${dateSplit}${String(year).slice(-2)}`;
      case "dd/mm/yy":
        return `${day}${dateSplit}${month}${dateSplit}${String(year).slice(-2)}`;
      case "yy/mm/dd":
        return `${String(year).slice(-2)}${dateSplit}${month}${dateSplit}${day}`;
      case "dd/mmm/yyyy":
        return `${day}${dateSplit}${date.toLocaleString("default", { month: "short" })}${dateSplit}${year}`;
      case "mmm/dd/yyyy":
        return `${date.toLocaleString("default", { month: "short" })}${dateSplit}${day}${dateSplit}${year}`;
      case "yyyy/mmm/dd":
        return `${year}${dateSplit}${date.toLocaleString("default", { month: "short" })}${dateSplit}${day}`;
      default:
        return date.toLocaleDateString();
    }
  };

  return <span>{formatDate(dateObj)}</span>;
};

export default DateFormat;
