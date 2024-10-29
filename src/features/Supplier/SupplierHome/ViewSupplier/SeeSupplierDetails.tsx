import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowRightLeft from "../../../../assets/icons/ArrowRightLeft";
import CheveronLeftIcon from "../../../../assets/icons/CheveronLeftIcon";
import Info from "../../../../assets/icons/Info";
// import MessageCircle from "../../../../assets/icons/MessageCircle";
// import NewspaperIcon from "../../../../assets/icons/NewspaperIcon";
import { SupplierResponseContext } from "../../../../context/ContextShare";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import { SupplierData } from "../../../../Types/Supplier";
// import Comment from "./Comment";
import Overview from "./Overview";
import Transaction from "./Transaction";
// import Statement from "./Statement";
// import Transaction from "./Transaction";

type Props = {};

interface Status {
  status: string;
}

function SeeSupplierDetails({ }: Props) {
  const { request: getOneSupplier } = useApi("get", 5009);
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [tabSwitch, setTabSwitch] = useState<string>("overview");
  const { supplierResponse } = useContext(SupplierResponseContext)!;
  const [statusData, setStatusData] = useState<Status>({ status: "" });

  const getOneSupplierData = async () => {
    if (!id) return;
    try {
      const url = `${endponits.GET_ONE_SUPPLIER}/${id}`;
      const body = { organizationId: "INDORG0001" };
      const { response, error } = await getOneSupplier(url, body);
      if (!error && response) {
        setSupplier(response.data);
      }
    } catch (error) {
      console.error("Error fetching supplier:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getOneSupplierData();
    }
  }, [id, supplierResponse]);

  useEffect(() => {
    if (supplier) {
      setStatusData({ status: supplier.status });
    }
  }, [supplier]);

  const handleTabSwitch = (tabName: string) => {
    setTabSwitch(tabName);
  };

  return (
    <div className="px-6">
      <div className="flex flex-col bg-white h-auto rounded-md text-textColor p-5 space-y-4">
        {/* Header */}
        <div className="flex w-full justify-between">
          <div className="flex gap-5 items-center">
            <Link to="/supplier/home">
              <div
                style={{ borderRadius: "50%" }}
                className="w-[40px] h-[40px] flex items-center justify-center bg-[#F6F6F6]"
              >
                <CheveronLeftIcon />
              </div>
            </Link>
            <p className="text-textColor text-xl font-bold">Office Vendors</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center w-full gap-2">
          <div
            onClick={() => handleTabSwitch("overview")}
            className={`text-[14px] font-semibold ${tabSwitch === "overview" ? "bg-[#F7E7CE]" : ""} w-[187px] py-2 justify-center flex gap-2 items-center rounded-[8px] cursor-pointer`}
          >
            <Info color="#303F58" size={20} /> Overview
          </div>
          {/* <div
            onClick={() => handleTabSwitch("comment")}
            className={`text-[14px] font-semibold ${tabSwitch === "comment" ? "bg-[#F7E7CE]" : ""} w-[187px] py-2 justify-center flex gap-2 items-center rounded-[8px] cursor-pointer`}
          >
            <MessageCircle size={20} color="#303F58" /> Comments
          </div> */}
          <div
            onClick={() => handleTabSwitch("transaction")}
            className={`text-[14px] font-semibold ${tabSwitch === "transaction" ? "bg-[#F7E7CE]" : ""} w-[187px] py-2 justify-center flex gap-2 items-center rounded-[8px] cursor-pointer`}
          >
            <ArrowRightLeft size={20} color="#303F58" /> Transaction
          </div>
          {/* <div
            onClick={() => handleTabSwitch("statement")}
            className={`text-[14px] font-semibold ${tabSwitch === "statement" ? "bg-[#F7E7CE]" : ""} w-[187px] py-2 justify-center flex gap-2 items-center rounded-[8px] cursor-pointer`}
          >
            <NewspaperIcon color="#303F58" /> Statements
          </div> */}
        </div>

        {tabSwitch === "overview" && (
          <Overview
            supplier={supplier}
            statusData={statusData}
            setStatusData={setStatusData}
          />
        )}
        {tabSwitch === "transaction" && (
          <Transaction
          />
        )}

      </div>
    </div>
  );
}

export default SeeSupplierDetails;
