import React, { useState } from "react";
import { Modal, InputNumber, DatePicker } from "antd";
import dayjs from "dayjs";

function AddMonth({ bill }) {
  const [open, setOpen] = useState(false);

  const [dueDate, setDueDate] = useState("");
  const [amount, setAmount] = useState(0.0);
  const [month, setMonth] = useState("");
  const [isPaid, setIsPaid] = useState(true);

  const onAmountChange = (value) => {
    setAmount(value);
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const reset = () => {
    setDueDate("");
    setAmount(0.0);
    setMonth("");
    setIsPaid(true);
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
              defaultValue={dayjs().subtract(1, "month")}
              onChange={(value) => {
                if (!value) return;
                console.log(value);
                setMonth(value.toString());
              }}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Amount</span>
            <InputNumber
              className="w-full"
              min={0}
              defaultValue={15}
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
              defaultValue={dayjs()}
              onChange={(value) => {
                if (!value) return;
                console.log(value.toString());
                setDueDate(value.toString());
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
            <button className="p-2 bg-black min-w-[70px] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AddMonth;
