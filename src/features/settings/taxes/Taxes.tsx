import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgimage from "../../../assets/Images/Organization-banner.png";
import Button from "../../../Components/Button";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import GSTComponent from "./gst/GSTComponent";
import VATComponent from "./vat/VATComponent";
import Banner from "../banner/Banner";

type Props = {};

function Taxes({}: Props) {
  const [selected, setSelected] = useState<string>("GST");
  const [taxType, setTaxType] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const { request: AllTaxGst } = useApi("get", 7004);

  const fetchAllTaxGst = async () => {
    try {
      const url = `${endponits.GET_ALL_TAX}`;
      const { response, error } = await AllTaxGst(url);
      if (!error && response) {
        const gstTaxRates = response.data;
        const taxType = gstTaxRates?.taxType || ""; 
        setTaxType(taxType);
        console.log(taxType);
      }
    } catch (error) {
      console.error("Error fetching tax data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTaxGst();
  }, []);

  const handleProceed = () => {
    if (selected === "GST") {
      navigate("/settings/taxes/GST");
    } else if (selected === "VAT") {
      navigate("/settings/taxes/VAT");
    }
  };

  if (loading) {
    return (
      <div className="p-5">
        <Banner />
        <p className="mt-5">Loading...</p>
      </div>
    );
  }

  if (taxType === "GST") {
    return <GSTComponent />;
  } else if (taxType === "VAT") {
    return <VATComponent />;
  } else {
    return (
      <div className="p-5">
        <div
          className="w-full h-[148px] bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${bgimage})` }}
        />
        <div
          className="mt-3 p-6 rounded-lg flex justify-between gap-4"
          style={{
            background:
              "linear-gradient(89.66deg, #E3E6D5 -0.9%, #F7E7CE 132.22%)",
          }}
        >
          <div>
            <p className="text-textColor text-sm">
              Choose your Tax Type for your business
            </p>
            <div className="flex items-start gap-[22px] text-[#495160] mt-4">
              <div className="flex gap-2 items-center">
                <div className="grid place-items-center">
                  <input
                    id="GST"
                    type="radio"
                    name="taxType"
                    className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                      selected === "GST"
                        ? "border-8 border-neutral-400"
                        : "border-1 border-neutral-400"
                    }`}
                    onChange={() => setSelected("GST")}
                    checked={selected === "GST"}
                  />
                  <div
                    className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                      selected === "GST" ? "bg-neutral-100" : "bg-transparent"
                    }`}
                  />
                </div>
                <label htmlFor="GST" className="text-start font-semibold">
                  GST
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <div className="grid place-items-center">
                  <input
                    id="VAT"
                    type="radio"
                    name="taxType"
                    className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                      selected === "VAT"
                        ? "border-8 border-neutral-400"
                        : "border-1 border-neutral-400"
                    }`}
                    onChange={() => setSelected("VAT")}
                    checked={selected === "VAT"}
                  />
                  <div
                    className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                      selected === "VAT" ? "bg-neutral-100" : "bg-transparent"
                    }`}
                  />
                </div>
                <label htmlFor="VAT" className="text-start font-semibold">
                  VAT
                </label>
              </div>
            </div>
          </div>
          <div>
            <Button
              variant="primary"
              size="sm"
              className="text-sm font-medium"
              onClick={handleProceed}
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Taxes;
