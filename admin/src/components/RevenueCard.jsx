/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useMemo } from "react";

const RevenueCard = ({ sales }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Grupăm sales pe lună
  const salesGroupedByMonth = useMemo(() => {
    const grouped = {};

    sales.forEach(({ date, totalAmount }) => {
      const d = new Date(date);
      const monthKey = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      if (!grouped[monthKey]) grouped[monthKey] = { days: [], totalAmount: 0 };

      grouped[monthKey].days.push({ date, totalAmount });
      grouped[monthKey].totalAmount += totalAmount;
    });

    // Sortez lunile crescător
    const sorted = Object.entries(grouped)
      .map(([month, data]) => ({
        month,
        days: data.days.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        ),
        totalAmount: data.totalAmount,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return sorted;
  }, [sales]);

  const totalPages = salesGroupedByMonth.length;

  // Datele lunii curente (pagina curentă)
  const currentMonthData = salesGroupedByMonth[currentPage - 1] || { days: [], totalAmount: 0, month: "" };


  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(year, Number(month) - 1);
    return date.toLocaleDateString("ro-RO", { year: "numeric", month:"2-digit"});
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-md max-h-[600px] overflow-auto">
      <h2 className="text-xl font-semibold mb-4">
        📈 Revenue for {formatMonth(currentMonthData.month)} — Total:{" "}
        {currentMonthData.totalAmount.toLocaleString("ro-RO", {
          style: "currency",
          currency: "RON",
        })}
      </h2>

      {currentMonthData.days.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No data</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {currentMonthData.days.map(({ date, totalAmount }) => (
            <div
              key={date}
              className="bg-blue-100 dark:bg-blue-950 p-3 rounded-xl"
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {new Date(date).toLocaleDateString("ro-RO", {
                  timeZone: "Europe/Bucharest",
                })}
              </p>
              <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                {totalAmount.toLocaleString("ro-RO", {
                  style: "currency",
                  currency: "RON",
                })}
              </p>
            </div>
          ))}
        </div>
      )}

        {/*Paginare*/}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        <span>
          Page {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RevenueCard;
