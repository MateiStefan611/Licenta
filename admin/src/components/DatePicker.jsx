import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ro from "date-fns/locale/ro";

import "react-datepicker/dist/react-datepicker.css";

registerLocale("ro", ro);

const DateRangePicker = ({ dateFrom, dateTo, setDateFrom, setDateTo, dateError }) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <label className="font-medium">Select date range:</label>

      <DatePicker
        selected={dateFrom}
        onChange={setDateFrom}
        selectsStart
        startDate={dateFrom}
        endDate={dateTo}
        locale="ro"
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/MM/yyyy"
        className="border p-2 rounded-lg dark:bg-zinc-800 dark:text-white"
        maxDate={dateTo}
        isClearable
      />

      <span>to</span>

      <DatePicker
        selected={dateTo}
        onChange={setDateTo}
        selectsEnd
        startDate={dateFrom}
        endDate={dateTo}
        locale="ro"
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/MM/yyyy"
        className="border p-2 rounded-lg dark:bg-zinc-800 dark:text-white"
        minDate={dateFrom}
        disabled={!dateFrom}
        isClearable
      />
    </div>
  );
};

export default DateRangePicker;
