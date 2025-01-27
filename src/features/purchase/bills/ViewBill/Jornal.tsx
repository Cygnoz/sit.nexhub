import { useEffect, useState } from "react";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import { useParams } from "react-router-dom";

interface Props {
  page?: string;
}

interface BillJournal {
  _id: string;
  accountName: string;
  debitAmount: number;
  creditAmount: number;
}

const Journal = ({ page }: Props) => {
  const [billJournal, setBillJournal] = useState<BillJournal[]>([]);
  const { request: getOneInvoiceDetails } = useApi("get", 5005);
  const { id } = useParams<{ id: string }>();

  const fetchOneInvoice = async () => {
    try {
      const url =
        page === "Bills"
          ? `${endponits.GET_BILL_JOURNAL}/${id}`
          : `${endponits.GET_PAYMENT_JOURNAL}/${id}`;

      const { response, error } = await getOneInvoiceDetails(url);

      if (!error && response) {
        setBillJournal(response.data);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  useEffect(() => {
    fetchOneInvoice();
  }, [page, id]);

  return (
    <div>
      <div className="p-4 rounded-lg bg-[#F6F6F6] mt-6">
        <h2 className="font-semibold text-base mb-4 text-textColor">{page==="Bills"?"Bills":"Payment Made"}</h2>

        <div className="grid grid-cols-3 font-bold gap-x-4 text-base text-dropdownText mb-2">
          <div>Account</div>
          <div className="text-right">Debit</div>
          <div className="text-right">Credit</div>
        </div>

        {billJournal.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-3 text-dropdownText gap-x-4 text-base mb-2"
          >
            <div className="text-sm">{item.accountName}</div>
            <div className="text-right">{item.debitAmount?.toFixed(2) || "0.00"}</div>
            <div className="text-right">{item.creditAmount?.toFixed(2) || "0.00"}</div>
          </div>
        ))}

        <div className="grid grid-cols-3 gap-x-4 text-lg font-bold text-[#0B1320] mt-5">
          <div className="text-base">Total</div>
          <div className="text-right">
            {billJournal
              .reduce((total, item) => total + (item.debitAmount || 0), 0)
              .toFixed(2)}
          </div>
          <div className="text-right">
            {billJournal
              .reduce((total, item) => total + (item.creditAmount || 0), 0)
              .toFixed(2)}
          </div>
        </div>
      </div>

      <hr className="mt-6 border-t border-inputBorder" />
    </div>
  );
};

export default Journal;
