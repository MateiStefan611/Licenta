/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import SalesChart from "../components/SalesChart";
import RevenueCard from "../components/RevenueCard";
import DateRangePicker from "../components/DatePicker";

import { backendUrl } from "../App";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Dashboard = ({ token }) => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/order/sales`, {
          headers: { token },
        });
        if (response.data.success && Array.isArray(response.data.sales)) {
          setSalesData(response.data.sales);
        } else {
          toast.error(response.data.message || "Failed to load sales data");
        }
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [token]);

  useEffect(() => {
    if (dateFrom && dateTo && dateFrom > dateTo) {
      setDateError(
        "Invalid date"
      );
    } else {
      setDateError("");
    }
  }, [dateFrom, dateTo]);

  const filteredSales =
    dateFrom && dateTo && !dateError
      ? salesData.filter((entry) => {
          const entryDate = new Date(entry.date);
          return (
            entryDate.setHours(0, 0, 0, 0) >= dateFrom.setHours(0, 0, 0, 0) &&
            entryDate.setHours(0, 0, 0, 0) <= dateTo.setHours(0, 0, 0, 0)
          );
        })
      : salesData;

  // Total general pe interval 
  const totalInRange = filteredSales.reduce(
    (acc, curr) => acc + curr.totalAmount,
    0
  );

  // Funcție pentru generare raport PDF
  
  const generateFancyPDFReport = (sales, dateFrom, dateTo) => {
  const doc = new jsPDF();

  const dateFromStr = dateFrom.toLocaleDateString("ro-RO");
  const dateToStr = dateTo.toLocaleDateString("ro-RO");


  // Titlu + info
  doc.setFontSize(20);
  doc.setTextColor("#2c3e50");
  doc.text("Revenue report", 14, 20);

  doc.setFontSize(12);
  doc.setTextColor("#34495e");
  doc.text(`Interval: ${dateFromStr} – ${dateToStr}`, 14, 30);


  // Total venituri
  const totalInRange = sales.reduce((acc, cur) => acc + cur.totalAmount, 0);
  doc.setFontSize(14);
  doc.setTextColor("#2980b9");
  doc.text(
    `Total revenue: ${totalInRange.toLocaleString("ro-RO", {
      style: "currency",
      currency: "RON",
    })}`,
    14,
    40
  );


  // Pregatire date pentru tabel
  const tableColumn = ["Nr.", "Data", "Revenue"];
  const tableRows = sales.map((entry, index) => [
    index + 1,
    new Date(entry.date).toLocaleDateString("ro-RO"),
    entry.totalAmount.toLocaleString("ro-RO", {
      style: "currency",
      currency: "RON",
    }),
  ]);


  // Apelează autoTable cu doc și opțiuni
  autoTable(doc, {
    startY: 50,
    head: [tableColumn],
    body: tableRows,
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: {
      fillColor: "#2980b9",
      textColor: "#fff",
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: "#f2f2f2" },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {


      // Footer cu număr pagină
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.setTextColor("#7f8c8d");
      doc.text(
        `Page ${data.pageNumber} din ${pageCount}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    },
  });

  // Salvează PDF
  doc.save(`Raport_vanzari_${dateFromStr}_-${dateToStr}.pdf`);
};

  return (
    <div className="space-y-6">
      <DateRangePicker
        dateFrom={dateFrom}
        dateTo={dateTo}
        setDateFrom={setDateFrom}
        setDateTo={setDateTo}
        dateError={dateError}
      />

      {dateError && (
        <p className="text-red-600 font-semibold mt-1">{dateError}</p>
      )}

      <button
        onClick={() => generateFancyPDFReport(filteredSales, dateFrom, dateTo)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Generate PDF
      </button>

      <SalesChart data={filteredSales} loading={loading} />
      <RevenueCard sales={filteredSales} loading={loading} />
    </div>
  );
};

export default Dashboard;
