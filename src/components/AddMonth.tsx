import React, { useState } from "react";
import { Modal, InputNumber, DatePicker } from "antd";
import dayjs from "dayjs";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

interface AddMonthProps {
  onAddMonth: (newMonth: any) => void;
  bill: any;
}

function AddMonth({ onAddMonth, bill }: AddMonthProps) {
  const [open, setOpen] = useState(false);

  const [month, setMonth] = useState(
    findFirstAvailableMonth().format("MM.YYYY")
  );
  const [dueDate, setDueDate] = useState(
    findFirstAvailableDate().format("MM.DD.YYYY.")
  );
  const [amount, setAmount] = useState(15.0);
  const [isPaid, setIsPaid] = useState(true);

  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "right",
      y: "top",
    },
  });

  const onAmountChange = (value) => {
    setAmount(value);
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const reset = () => {
    setMonth(findFirstAvailableMonth().format("MM.YYYY"));
    setDueDate(findFirstAvailableDate().format("MM.DD.YYYY."));
    setAmount(15.0);
    setIsPaid(true);
  };

  function isMonthDisabled(date) {
    return (
      bill.items &&
      bill.items.some((item) => item.month === date.format("MM.YYYY"))
    );
  }

  function findFirstAvailableMonth() {
    let month = dayjs().subtract(1, "month");
    while (isMonthDisabled(month)) {
      month = month.subtract(1, "month");
    }

    return month;
  }

  function findFirstAvailableDate() {
    let date = dayjs();
    while (getNextMonth(date)) {
      date = date.subtract(1, "day");
    }

    return date;
  }

  function getNextMonth(date) {
    const [monthItem, yearItem] = month.split(".");
    const selectedMonth = dayjs(`${yearItem}-${monthItem}-01`);
    const nextMonth = selectedMonth.add(1, "month");

    return !date.isSame(nextMonth, "month");
  }

  const handleAddMonth = () => {
    const newMonth = {
      month,
      dueDate,
      amount,
      isPaid,
    };

    onAddMonth(newMonth);
    reset();
    notyf.success("Monthly instance added.");
    setOpen(false);
  };

  return (
    <>
      <li onClick={() => setOpen(true)} className="whitespace-nowrap">
        <a className="whitespace-nowrap flex items-center gap-2">
          <i className="fa-solid fa-calendar-plus"></i>
          <div>Add monthly instance</div>
        </a>
      </li>
      <Modal
        title={"Add a monthly instance for " + bill.name}
        centered
        open={open}
        destroyOnClose
        footer={null}
        onOk={() => setOpen(false)}
        onCancel={() => handleCancel()}
      >
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-3"
        >
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Month</span>
            <DatePicker
              format={"MM.YYYY."}
              picker="month"
              disabledDate={isMonthDisabled}
              defaultValue={dayjs(month, "MM.YYYY")}
              onChange={(value) => {
                if (!value) return;
                setMonth(value.format("MM.YYYY"));
              }}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Amount</span>
            <InputNumber
              className="w-full"
              min={0}
              defaultValue={amount}
              formatter={(value) =>
                `${value} €`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              onChange={onAmountChange}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Due date</span>
            <DatePicker
              format={"DD.MM.YYYY."}
              showToday
              defaultValue={dayjs(dueDate)}
              disabledDate={getNextMonth}
              onChange={(value) => {
                if (!value) return;
                setDueDate(value.format("MM.DD.YYYY"));
              }}
            />
          </label>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="toggle"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
            />
            <span className="label-text">
              Status: {isPaid ? "Paid" : "Unpaid"}
            </span>
          </div>
        </form>
        <div className="flex items-center justify-end mt-8">
          <div className="flex gap-3">
            <button
              className="p-2 border bg-white border-black rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors uppercase"
              onClick={() => handleCancel()}
            >
              Cancel
            </button>
            <button
              className="p-2 bg-black min-w-[70px] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
              onClick={() => handleAddMonth()}
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AddMonth;
