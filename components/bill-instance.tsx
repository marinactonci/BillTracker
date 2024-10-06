import React, { useEffect, useState } from "react";
import { Modal, Button, DatePicker, InputNumber, Switch, message } from "antd";
import dayjs from "dayjs";
import { updateBillInstance } from "@/utils/supabaseUtils";

interface BillInstanceProps {
  event: any;
  onChange: () => void;
}

function BillInstance({ event, onChange }: BillInstanceProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(dayjs(event.month));
  const [dueDate, setDueDate] = useState(dayjs(event.due_date));
  const [amount, setAmount] = useState(event.amount);
  const [isPaid, setIsPaid] = useState(event.is_paid);

  useEffect(() => {
    console.log("month", dayjs(event.month).format("MM.YYYY"));
    console.log("dueDate", event.due_date);
    console.log("dueDate", dayjs(event.due_date).format("DD.MM.YYYY"));
    setMonth(dayjs(event.month));
    setDueDate(dayjs(event.due_date));
    setAmount(event.amount);
    setIsPaid(event.is_paid);
  }, [event]);

  const handleUpdate = async () => {
    if (!event.id) {
      message.error("Invalid bill instance ID");
      return;
    }

    try {
      await updateBillInstance(event.id, {
        month: month.toDate(),
        due_date: dueDate.toDate(),
        amount,
        is_paid: isPaid,
      });
      setOpen(false);
      onChange();
      message.success("Bill instance updated successfully");
    } catch (error: any) {
      console.error("Error updating bill instance:", error);
      message.error("Failed to update bill instance");
    }
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`text-xs hover:cursor-pointer ${
          event.is_paid ? "bg-green-100" : "bg-red-100"
        } p-1 rounded`}
      >
        <div className="font-medium">{event.billName}</div>
        <div className="text-gray-600">{event.profileName}</div>
        <div className="text-gray-500">${event.amount.toFixed(2)}</div>
        <div className={event.is_paid ? "text-green-600" : "text-red-600"}>
          {event.is_paid ? "Paid" : "Unpaid"}
        </div>
      </div>
      <Modal
        title={"Update bill instance"}
        centered
        open={open}
        destroyOnClose
        footer={null}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-3"
        >
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Month</span>
            <DatePicker
              format={"MM.YYYY"}
              picker="month"
              value={month}
              onChange={(value) => {
                if (value) setMonth(value);
              }}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Amount</span>
            <InputNumber
              className="w-full"
              min={0}
              value={amount}
              formatter={(value) =>
                `${value} €`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              onChange={(value) => {
                if (value !== null) setAmount(value);
              }}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Due date</span>
            <DatePicker
              format={"DD.MM.YYYY"}
              value={dueDate}
              onChange={(value) => {
                if (value) setDueDate(value);
              }}
            />
          </label>
          <div className="flex items-center gap-3">
            <Switch
              checked={isPaid}
              onChange={(checked: boolean) => setIsPaid(checked)}
            />
            <span className="label-text">
              Status: {isPaid ? "Paid" : "Unpaid"}
            </span>
          </div>
        </form>
        <div className="flex items-center justify-end mt-8">
          <div className="flex gap-3">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleUpdate}>
              Update
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default BillInstance;
