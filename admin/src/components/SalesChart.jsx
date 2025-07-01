import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SalesChart = ({ data, loading }) => {
  if (loading) return <p>Loading sales data...</p>;
  if (!data || data.length === 0) return <p>No sales data available.</p>;

  // Formatter pentru YAxis stânga (orders count) - afișează doar întregi
  const formatCount = (value) => Math.round(value);

  // Formatter pentru YAxis dreapta (total amount) - 2 zecimale, prefix RON
  const formatAmount = (value) => `RON ${value.toFixed(2)}`;

  // Formatter pentru Tooltip
  const tooltipFormatter = (value, name) => {
    if (name === "totalAmount") return [`RON ${value.toFixed(2)}`, "Total Amount"];
    if (name === "count") return [Math.round(value), "Orders Count"];
    return [value, name];
  };
  console.log(data)
const formattedData = data.map((item) => ({
  ...item,
  date: new Date(item.date).toLocaleDateString("ro-RO", { timeZone: "Europe/Bucharest" }),
}));

  return (
    <div style={{ width: "100%", height: 500, padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>
        Sales Chart - Orders Count & Total Amount Per Day
      </h1>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={70}
            interval={0}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#8884d8"
            tickFormatter={formatCount}
            allowDecimals={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#82ca9d"
            tickFormatter={formatAmount}
          />
          <Tooltip formatter={tooltipFormatter} />
          <Legend verticalAlign="top" />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Orders Count"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="totalAmount"
            stroke="#82ca9d"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Total Amount"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
