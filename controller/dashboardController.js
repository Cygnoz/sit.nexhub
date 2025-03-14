const SalesInvoice = require("../database/model/salesInvoice");
const CreditNote = require("../database/model/creditNote");
const Organization = require("../database/model/organization");
const Item = require("../database/model/item");
const ItemTrack = require("../database/model/itemTrack");
const moment = require("moment-timezone");
const mongoose = require('mongoose');


const dataExist = async ( organizationId ) => {    
    const [organizationExists, allInvoice, allCreditNote, allItem ] = await Promise.all([
      Organization.findOne({ organizationId },{ timeZoneExp: 1, dateFormatExp: 1, dateSplit: 1, organizationCountry: 1 })
      .lean(),
      SalesInvoice.find({ organizationId }, {_id: 1, items: 1, totalAmount: 1, saleAmount: 1, createdDateTime: 1 })
      .populate('items.itemId', 'itemName')    
      .lean(),
      CreditNote.find({ organizationId }, {_id: 1, items: 1, totalAmount: 1, totalTax: 1, createdDateTime: 1 })
      .populate('items.itemId', 'itemName')    
      .lean(),
      Item.find({ organizationId }, {_id: 1, itemName: 1, categories: 1, createdDateTime: 1 })
      .lean(),
    ]);
    return { organizationExists, allInvoice, allCreditNote, allItem };
};



//Xs Item Exist
const xsItemDataExists = async (organizationId) => {
  const [newItems] = await Promise.all([
    Item.find( { organizationId }, { _id: 1, itemName: 1, itemImage: 1, costPrice:1, categories: 1, createdDateTime: 1 } )
    .lean(),                  
  ]);        

  // Extract itemIds from newItems
  const itemIds = newItems.map(item => new mongoose.Types.ObjectId(item._id));

  // Aggregate data from ItemTrack
  const itemTracks = await ItemTrack.aggregate([
    { $match: { itemId: { $in: itemIds } } },
    { $sort: { itemId: 1, createdDateTime: 1 } }, // Sort by itemId and createdDateTime
    {
        $group: {
            _id: "$itemId",
            totalCredit: { $sum: "$creditQuantity" },
            totalDebit: { $sum: "$debitQuantity" },
            lastEntry: { $max: "$createdDateTime" }, // Identify the last date explicitly
            data: { $push: "$$ROOT" }, // Push all records to process individually if needed
        },
    },
  ]);
  
  const itemTrackMap = itemTracks.reduce((acc, itemTrack) => {
    const sortedEntries = itemTrack.data.sort((a, b) =>
        new Date(a.createdDateTime) - new Date(b.createdDateTime)
    );

    acc[itemTrack._id.toString()] = {
        currentStock: itemTrack.totalDebit - itemTrack.totalCredit,
        lastEntry: sortedEntries[sortedEntries.length - 1], // Explicitly take the last entry based on sorted data
    };
    return acc;
  }, {});

  // Enrich items with currentStock and other data
  const enrichedItems = newItems.map(item => {
    const itemIdStr = item._id.toString();
    const itemTrackData = itemTrackMap[itemIdStr];
  
    if (!itemTrackData) {
        console.warn(`No ItemTrack data found for itemId: ${itemIdStr}`);
    }
  
    return {
        ...item,
        currentStock: itemTrackData?.currentStock ?? 0, 
    };
  });

  return { enrichedItems };
};


// Main Dashboard overview function
exports.getOverviewData = async (req, res) => {
  try {
      const organizationId = req.user.organizationId;
      const { date } = req.query; // Get date in YYYY/MM or YYYY-MM format

      // Validate date format (YYYY/MM or YYYY-MM)
      if (!date || !/^\d{4}[-/]\d{2}$/.test(date)) {
        return res.status(400).json({ message: "Invalid date format. Use YYYY/MM or YYYY-MM." });
      }

      // Fetch Organization Data
      const { organizationExists, allItem } = await dataExist(organizationId);
      if (!organizationExists) return res.status(404).json({ message: "Organization not found!" });

      // Get organization's time zone
      const orgTimeZone = organizationExists.timeZoneExp || "UTC";

      // Extract Year and Month
      let [year, month] = date.split(/[-/]/).map(Number); // Split date on "-" or "/"
      month = String(month).padStart(2, '0'); // Ensure month is always two digits

      // Ensure valid year and month
      if (!year || !month || month < 1 || month > 12) {
          return res.status(400).json({ message: "Invalid year or month in date." });
      }

      // Set start and end date for the month
      const startDate = moment.tz(`${year}-${month}-01`, orgTimeZone).startOf("month");
      const endDate = moment(startDate).endOf("month");

      console.log("Requested Date Range:", startDate.format(), endDate.format());

      const { enrichedItems } = await xsItemDataExists(organizationId);

      // Total Inventory Value: Sum of (currentStock * costPrice)
      const filteredInventoryValue = enrichedItems.filter(item =>
          moment.tz(item.createdDateTime, orgTimeZone).isBetween(startDate, endDate, null, "[]")
      );

      console.log("Filtered Inventory Values:", filteredInventoryValue);

      // Corrected Total Inventory Value Calculation
      const totalInventoryValue = Math.abs(filteredInventoryValue.reduce(
          (sum, item) => sum + ((parseFloat(item.currentStock) || 0) * (parseFloat(item.costPrice) || 0)), 0
      ));

      // Corrected Total Item Count Calculation
      const totalItemCount = Math.abs(filteredInventoryValue.reduce(
          (sum, item) => sum + (parseFloat(item.currentStock) || 0), 0
      ));

      // Corrected Out-of-Stock Count Calculation
      const totalOutOfStock = filteredInventoryValue.filter(item => item.currentStock < 1).length;

      // Corrected New Item Count Calculation
      const newItemCount = allItem.filter(item =>
          moment.tz(item.createdDateTime, orgTimeZone).isBetween(startDate, endDate, null, "[]")
      ).length;

      console.log("Final Calculations:", { 
        totalInventoryValue,
        totalItemCount,
        totalOutOfStock,
        newItemCount,
        enrichedItems
      });

      // Response JSON
      res.json({
          totalInventoryValue,
          totalItemCount,
          totalOutOfStock,
          newItems: newItemCount,
      });

  } catch (error) {
      console.error("Error fetching overview data:", error);
      res.status(500).json({ message: "Internal server error." });
  }
};




// Top Selling Product
exports.getTopSellingProducts = async (req, res) => {
  try {
      const organizationId = req.user.organizationId;
      const { date } = req.query; // Get date in YYYY/MM or YYYY-MM format

        // Validate date format (YYYY/MM or YYYY-MM)
        if (!date || !/^\d{4}[-/]\d{2}$/.test(date)) {
            return res.status(400).json({ message: "Invalid date format. Use YYYY/MM or YYYY-MM." });
        }

      // Fetch Organization Data
      const { organizationExists, allInvoice } = await dataExist(organizationId);
      if (!organizationExists) return res.status(404).json({ message: "Organization not found!" });

      // Get organization's time zone
      const orgTimeZone = organizationExists.timeZoneExp || "UTC";

      // Extract Year and Month
      let [year, month] = date.split(/[-/]/).map(Number); // Split date on "-" or "/"
      month = String(month).padStart(2, '0'); // Ensure month is always two digits

      // Ensure valid year and month
      if (!year || !month || month < 1 || month > 12) {
          return res.status(400).json({ message: "Invalid year or month in date." });
      }

      // Set start and end date for the month
      const startDate = moment.tz(`${year}-${month}-01`, orgTimeZone).startOf("month");
      const endDate = moment(startDate).endOf("month");

      console.log("Requested Date Range:", startDate.format(), endDate.format());

      // Fetch enriched item data (includes itemImage and currentStock)
      const { enrichedItems } = await xsItemDataExists(organizationId);

      // Convert enrichedItems array to a Map for quick lookup
      const itemMap = new Map(enrichedItems.map(item => [item._id.toString(), item]));

      // Filter invoices within the date range
      const filteredInvoices = allInvoice.filter(inv => {
          const invoiceDate = moment.tz(inv.createdDateTime, orgTimeZone);
          return invoiceDate.isBetween(startDate, endDate, null, "[]");
      });

      console.log("Filtered Invoices Count:", filteredInvoices.length);

      // Track top-selling products
      let topProducts = {};

      filteredInvoices.forEach(inv => {
          inv.items.forEach(item => {
              if (item.itemId) {
                  const itemId = item.itemId._id.toString();
                  const itemName = item.itemId.itemName || "Undefined";
                  const itemQuantity = item.quantity || 0; 
                  const totalAmount = inv.saleAmount || 0; 

                  // Get item details from enrichedItems
                  const enrichedItem = itemMap.get(itemId);

                  // Check if enriched item exists
                  const itemImage = enrichedItem?.itemImage || null;
                  const currentStock = enrichedItem 
                      ? (enrichedItem.currentStock < 1 ? "Out of Stock" : "In Stock")
                      : "undefined";

                  if (!topProducts[itemId]) {
                      topProducts[itemId] = {
                          itemId,
                          itemName,
                          totalSold: 0,
                          totalAmount: 0,
                          itemImage, 
                          currentStock 
                      };
                  }

                  // Accumulate quantity and total amount
                  topProducts[itemId].totalSold += itemQuantity;
                  topProducts[itemId].totalAmount += totalAmount;
              }
          });
      });

      // Convert object to an array & sort by total quantity sold
      const sortedTopProducts = Object.values(topProducts)
          .sort((a, b) => b.totalSold - a.totalSold) // Sort by most sold items
          .slice(0, 5); // Get top 5 products

      console.log("Top 5 Products:", sortedTopProducts);

      // Response JSON
      res.json({
          topProducts: sortedTopProducts
      });

  } catch (error) {
      console.error("Error fetching top-selling products:", error);
      res.status(500).json({ message: "Internal server error." });
  }
};



// Top 5 Selling Products By Categories
exports.getTopSellingProductsByCategories = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;
        const { date } = req.query;

        if (!date || !/^\d{4}[-/]\d{2}$/.test(date)) {
            return res.status(400).json({ message: "Invalid date format. Use YYYY/MM or YYYY-MM." });
        }

        const { organizationExists, allInvoice, allItem } = await dataExist(organizationId);
        if (!organizationExists) return res.status(404).json({ message: "Organization not found!" });

        const orgTimeZone = organizationExists.timeZoneExp || "UTC";

        let [year, month] = date.split(/[-/]/).map(Number);
        month = String(month).padStart(2, '0');

        const startDate = moment.tz(`${year}-${month}-01`, orgTimeZone).startOf("month");
        const endDate = moment(startDate).endOf("month");

        console.log("Requested Date Range:", startDate.format(), endDate.format());

        // Convert items to Map for fast lookup
        const itemMap = new Map(allItem.map(item => [item._id.toString(), item]));
        console.log("Item Map Loaded:", itemMap.size, "items");

        // Filter invoices
        const filteredInvoices = allInvoice.filter(inv => {
            const invoiceDate = moment.tz(inv.createdDateTime, orgTimeZone);
            return invoiceDate.isBetween(startDate, endDate, null, "[]");
        });

        console.log("Filtered Invoices Count:", filteredInvoices.length);

        const categorySales = {};

        filteredInvoices.forEach(invoice => {
            invoice.items.forEach(({ itemId, quantity, sellingPrice }) => {
                const itemKey = itemId?._id?.toString();  // Ensure itemId is properly extracted
                if (!itemKey) {
                    console.log("Skipping item - Invalid itemId:", itemId);
                    return;
                }
        
                const item = itemMap.get(itemKey);
                
                console.log("Checking Item:", itemKey, "->", item ? item.itemName : "Not Found");
        
                if (!item) return;
        
                const category = item.categories || "Uncategorized";
                categorySales[category] = (categorySales[category] || 0) + (quantity * sellingPrice);
            });
        });

        const topSellingProductsByCategories = Object.entries(categorySales)
            .map(([category, totalAmount]) => ({ category, totalAmount }))
            .sort((a, b) => b.totalAmount - a.totalAmount)
            .slice(0, 5);

        console.log("Top Selling Categories:", topSellingProductsByCategories);

        res.json({ topSellingProductsByCategories });

    } catch (error) {
        console.error("Error fetching top selling products by category:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};




// stock level over category
exports.getStockLevelOverCategory = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;
        const { date, category } = req.query; // Get date in YYYY/MM or YYYY-MM format

        // Validate date format (YYYY/MM or YYYY-MM)
        if (!date || !/^\d{4}[-/]\d{2}$/.test(date)) {
            return res.status(400).json({ message: "Invalid date format. Use YYYY/MM or YYYY-MM." });
        }

        // Fetch Organization Data
        const { organizationExists } = await dataExist(organizationId);
        if (!organizationExists) return res.status(404).json({ message: "Organization not found!" });

        // Get organization's time zone
        const orgTimeZone = organizationExists.timeZoneExp || "UTC";

        // Extract Year and Month
        let [year, month] = date.split(/[-/]/).map(Number); // Split date on "-" or "/"
        month = String(month).padStart(2, '0'); // Ensure month is always two digits

        // Ensure valid year and month
        if (!year || !month || month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid year or month in date." });
        }

        // Set start and end date for the month
        const startDate = moment.tz(`${year}-${month}-01`, orgTimeZone).startOf("month");
        const endDate = moment(startDate).endOf("month");

        console.log("Requested Date Range:", startDate.format(), endDate.format());

        // Fetch enriched item data (includes itemImage and currentStock)
        const { enrichedItems } = await xsItemDataExists(organizationId);

        console.log("enrichedItems:", enrichedItems);

        // **Filter enrichedItems based on query category**
        const filteredItems = enrichedItems.filter(item => item.categories === category);

        console.log(`Filtered Items for category ${category}:`, filteredItems);

        // **Sort by currentStock in descending order and take top 5**
        const topItems = filteredItems
            .sort((a, b) => b.currentStock - a.currentStock)
            .slice(0, 5)
            .map(({ _id, itemName, categories, currentStock }) => ({
                _id,
                itemName,
                categories,
                currentStock
            }));

        console.log("Top 5 items in category:", topItems);

        // Response JSON
        res.json({
            topItems
        });

    } catch (error) {
        console.error("Error fetching stock level over category:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};




// most frequently reordered items
exports.getFrequentlyReorderedItems = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;
        const { date } = req.query; // Get date in YYYY/MM or YYYY-MM format

        // Validate date format (YYYY/MM or YYYY-MM)
        if (!date || !/^\d{4}[-/]\d{2}$/.test(date)) {
            return res.status(400).json({ message: "Invalid date format. Use YYYY/MM or YYYY-MM." });
        }

        // Fetch Organization Data
        const { organizationExists, allInvoice } = await dataExist(organizationId);
        if (!organizationExists) return res.status(404).json({ message: "Organization not found!" });

        // Get organization's time zone
        const orgTimeZone = organizationExists.timeZoneExp || "UTC";

        // Extract Year and Month
        let [year, month] = date.split(/[-/]/).map(Number);
        month = String(month).padStart(2, '0');

        if (!year || !month || month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid year or month in date." });
        }

        // Set start and end date for the month
        const startDate = moment.tz(`${year}-${month}-01`, orgTimeZone).startOf("month");
        const endDate = moment(startDate).endOf("month");

        console.log("Requested Date Range:", startDate.format(), endDate.format());

        // Filter invoices within the selected month
        const filteredInvoices = allInvoice.filter(inv => {
            const invoiceDate = moment.tz(inv.createdDateTime, orgTimeZone);
            return invoiceDate.isBetween(startDate, endDate, null, "[]");
        });

        console.log("Filtered Invoices Count:", filteredInvoices.length);

        // Count occurrences of each item in filteredInvoices
        const itemFrequency = {};

        filteredInvoices.forEach(invoice => {
            invoice.items.forEach(item => {
                const itemId = item.itemId?._id?.toString(); // Convert ObjectId to string if needed
                if (itemId) {
                    if (!itemFrequency[itemId]) {
                        itemFrequency[itemId] = {
                            _id: itemId,
                            itemName: item.itemId?.itemName || "Unknown",
                            reorderCount: 0
                        };
                    }
                    itemFrequency[itemId].reorderCount += 1; // Increase count for the item
                }
            });
        });

        console.log("Item Frequency Map:", itemFrequency);

        // Convert object to sorted array by reorder count (highest first)
        const frequentlyReorderedItems = Object.values(itemFrequency)
            .sort((a, b) => b.reorderCount - a.reorderCount)
            .slice(0, 5); // Get top 10 most reordered items

        console.log("Final Most Frequently Reordered Items:", frequentlyReorderedItems);

        // Response JSON
        res.json({
            frequentlyReorderedItems
        });

    } catch (error) {
        console.error("Error fetching most frequently reordered items:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};




