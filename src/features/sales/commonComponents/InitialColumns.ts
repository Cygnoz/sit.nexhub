export const getInitialColumns = (page: string | undefined) => {
    if (!page) return [];
    return page === "invoice"
      ? [
          { id: "createdDate", label: "Date", visible: true },
          { id: "", label: "Due Date", visible: false },
          { id: "salesInvoice", label: "Invoice#", visible: true },
          { id: "reference", label: "Reference", visible: true },
          { id: "paidStatus", label: "Status", visible: true },
          { id: "customerDisplayName", label: "Customer Name", visible: true },
          { id: "totalAmount", label: "Amount", visible: true },
          { id: "", label: "Balance Due", visible: false },
        ]
      : page === "salesOrder"
      ? [
          { id: "salesOrder", label: "Order Number", visible: true },
          { id: "createdDate", label: "Order Date", visible: true },
          { id: "customerDisplayName", label: "Customer Name", visible: true },
          { id: "totalAmount", label: "Total", visible: true },
          { id: "status", label: "Status", visible: true },
        ]
      : page === "quote"
      ? [
          { id: "customerName", label: "Customer Name", visible: true },
          { id: "createdDate", label: "Date", visible: true },
          { id: "reference", label: "Reference", visible: true },
          { id: "salesQuotes", label: "Quote Number", visible: true },
          { id: "status", label: "Status", visible: true },
          { id: "totalAmount", label: "Amount", visible: true },
        ]
      : page === "salesReturn"
      ? [
          { id: "createdDate", label: "Date", visible: true },
          { id: "customerRMA", label: "RMA#", visible: true },
          { id: "salesOrder", label: "SalesOrder", visible: true },
          { id: "status", label: "Status", visible: true },
          { id: "customerName", label: "Customer Name", visible: true },
          { id: "totalAmount", label: "Amount", visible: true },
          { id: "returned", label: "Returned", visible: true },
        ]
      : page === "reciept"
      ? [
          { id: "paymentDate", label: "Date", visible: true },
          { id: "receipt", label: "Reciept", visible: true },
          { id: "customerDisplayName", label: "Customer Name", visible: true },
          { id: "paymentMode", label: "Mode", visible: true },
          { id: "amountReceived", label: "Amount Received", visible: true },
        ]
      : page === "credit-Note"
      ? [
          { id: "creditNote", label: "Credit Note", visible: true },
          { id: "customerDisplayName", label: "Customer Name", visible: true },
          { id: "customerCreditDate", label: "Date", visible: true },
          { id: "orderNumber", label: "orderNumber", visible: true },
          { id: "totalAmount", label: "Balance", visible: true },
        ]
      : [];
  };
  