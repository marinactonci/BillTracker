import React, { useState } from "react";
import { Modal, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";

interface EditMonthsProps {
  onSave: (newMonth: any) => void;
  bill: any;
}

function EditMonths({ onSave, bill }: EditMonthsProps) {
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  // TODO:
  // First have only month picker enabled with disabled months that aren't added to items
  // After month is selected, fetch the item for that month and fill the form with it's data

  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const reset = () => {
    setMonth("");
    setAmount(0);
    setDueDate("");
    setIsPaid(false);
    setIsDisabled(true);
  };

  const onMonthChange = (value) => {
    setMonth(value.toString());
    fetchItem(value.toString());
  };

  const fetchItem = (month) => {
    const item = bill.items.find(
      (item) => item.month === dayjs(month).format("MM.YYYY")
    );
    if (item) {
      setAmount(item.amount);
      setDueDate(item.dueDate);
      setIsPaid(item.isPaid);
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  function isMonthDisabled(date) {
    return !(
      bill.items &&
      bill.items.some((item) => item.month === date.format("MM.YYYY"))
    );
  }

  const onAmountChange = (value) => {
    setAmount(value);
  };

  const handleSave = () => {
    const item = {
      month: dayjs(month).format("MM.YYYY"),
      amount,
      dueDate,
      isPaid,
    };

    onSave(item);
    setOpen(false);
  };

  return (
    <>
      <li onClick={() => setOpen(true)} className="whitespace-nowrap">
        <a className="whitespace-nowrap flex items-center gap-2">
          <i className="fa-solid fa-gear"></i>
          <div>Edit monthly instances</div>
        </a>
      </li>
      <Modal
        title={"Edit monthly instances for " + bill.name}
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
              onChange={(value) => {
                onMonthChange(value);
              }}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Amount</span>
            <InputNumber
              className="w-full"
              min={0}
              value={amount}
              disabled={isDisabled}
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
              disabled={isDisabled}
              value={dueDate.length ? dayjs(dueDate) : null}
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
              disabled={isDisabled}
              onChange={(e) => setIsPaid(e.target.checked)}
            />
            {!isDisabled && (
              <span className="label-text">
                Status: {isPaid ? "Paid" : "Unpaid"}
              </span>
            )}
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
              onClick={() => handleSave()}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default EditMonths;
