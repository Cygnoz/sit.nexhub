import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../../../Components/Button";
import Modal from "../../../../Components/model/Modal";
import bgImage from "../../../../assets/Images/14.png";
import CheveronLeftIcon from "../../../../assets/icons/CheveronLeftIcon";
import PlusCircle from "../../../../assets/icons/PlusCircle";
import Banner from "../../banner/Banner";
import ExchangeTable from "./ExchangeTable";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";

type Props = {};

interface currency{
  currencyCode:string
}

const ExchangeRates = ({}: Props) => {
  const Params = useParams<{ _id: string }>();
  const { _id } = Params;

  const [addExchangeRateModal, setAddExchangeRateModal] = useState(false);
  const [CurrencyDetails, setCurrenyDetails] = useState<currency | any>();
  const { request: getOneCurr } = useApi("get", 7004);

  const getOne = async () => {
    try {
      if (_id) {
        // Ensure _id is defined before using it
        const url = endponits.GET_ONE_CURRENCY(_id);
        const { response, error } = await getOneCurr(url);
        console.log(response);
        if (!error && response) {
          setCurrenyDetails(response.data);
          console.log(response.data);

        }
      } else {
        console.error("Currency ID is not provided");
      }
    } catch (error) {
      console.error("Error fetching currency:", error);
    }
  };

  useEffect(() => {
    getOne();
  }, [_id]); // Run the effect when _id changes

  return (
    <div className="m-4 text-[#303F58]">
      <Banner seeOrgDetails />
      <div className="bg-white rounded-lg flex p-6 flex-col space-y-2 mt-4 ">
        <div className="flex justify-between ">
          <div className="space-x-2 flex items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-[#F3F3F3] rounded-full ">
              <Link to={"/settings/organization/currencies"}>
                <CheveronLeftIcon />
              </Link>
            </div>

            <p className="font-bold text-[#303F58]">
              {CurrencyDetails.currencyCode}-Exchange Rates
            </p>
          </div>
          <Button
            onClick={() => setAddExchangeRateModal(!addExchangeRateModal)}
            variant="primary"
            size="sm"
          >
            <PlusCircle size={16} color={"white"} />
            <p className="text-sm ">Add Exchange Rate</p>
          </Button>
          <Modal
            open={addExchangeRateModal}
            onClose={() => setAddExchangeRateModal(!addExchangeRateModal)}
            className="rounded-lg p-8 w-[657px] text-[#303F58] space-y-8"
          >
            <div className="space-y-6">
              <div className="mb-5 flex p-4 h-[64px] items-center rounded-xl bg-CreamBg relative overflow-hidden">
                <div
                  className="absolute top-0 -right-8 w-[178px] h-[80px]"
                  style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-textColor">
                    Add Exchange Rate - AED
                  </h3>
                </div>
                <div
                  className="ms-auto text-3xl cursor-pointer relative z-10"
                  onClick={() => setAddExchangeRateModal(!addExchangeRateModal)}
                >
                  &times;
                </div>
              </div>
              <form className="space-y-3">
                <div>
                  <label className="block text-sm mb-1 text-labelColor">
                    Date
                  </label>
                  <input
                    type="date"
                    name="accountName"
                    // value={bankAccount.accountName}
                    // onChange={handleChange}
                    placeholder="Value"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-labelColor">
                    Exchange Rate(in INR)
                  </label>
                  <input
                    type="text"
                    name="accountName"
                    // value={bankAccount.accountName}
                    // onChange={handleChange}
                    placeholder="Exchange Rate"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                  />
                </div>
                <div className="flex my-4 gap-2 justify-end pt-3">
                  <Button
                    onClick={() =>
                      setAddExchangeRateModal(!addExchangeRateModal)
                    }
                    variant="secondary"
                    className="h-[35px] w-[120px] flex justify-center"
                  >
                    {" "}
                    <p className="text-sm">Cancel</p>
                  </Button>
                  <Button
                    onClick={() =>
                      setAddExchangeRateModal(!addExchangeRateModal)
                    }
                    variant="primary"
                    className="h-[35px] w-[120px] flex justify-center"
                    // onClick={(e) => handleCreateOrganization(e)}
                  >
                    <p className="text-sm">Save</p>
                  </Button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
        <ExchangeTable />
      </div>
    </div>
  );
};

export default ExchangeRates;
