import React, { useEffect, useState } from "react";
import { Modal, Button, DatePicker, InputNumber, Switch, message } from "antd";
import dayjs from "dayjs";
import { updateBillInstance, deleteBillInstance } from "@/utils/supabaseUtils";

interface BillInstanceProps {
  event: {
    id: number;
    billName: string;
    profileName: string;
    month: Date;
    dueDate: Date;
    amount: number;
    isPaid: boolean;
  };
  onChange: () => void;
}

function BillInstance({ event, onChange }: BillInstanceProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(dayjs(event.month));
  const [dueDate, setDueDate] = useState(dayjs(event.dueDate));
  const [amount, setAmount] = useState(event.amount);
  const [isPaid, setIsPaid] = useState(event.isPaid);

  useEffect(() => {
    setMonth(dayjs(event.month));
    setDueDate(dayjs(event.dueDate));
    setAmount(event.amount);
    setIsPaid(event.isPaid);
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
    } catch (error) {
      console.error("Error updating bill instance:", error);
      message.error("Failed to update bill instance");
    }
  };

  const handleDelete = async () => {
    if (!event.id) {
      message.error("Invalid bill instance ID");
      return;
    }

    try {
      await deleteBillInstance(event.id);
      setOpen(false);
      onChange();
      message.success("Bill instance deleted successfully");
    } catch (error) {
      console.error("Error deleting bill instance:", error);
      message.error("Failed to delete bill instance");
    }
  }

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`text-xs hover:cursor-pointer ${
          event.isPaid ? "bg-green-100" : "bg-red-100"
        } p-1 rounded`}
      >
        <div className="font-medium">{event.billName}</div>
        <div className="text-gray-600">{event.profileName}</div>
        <div className="text-gray-500">${event.amount.toFixed(2)}</div>
        <div className={event.isPaid ? "text-green-600" : "text-red-600"}>
          {event.isPaid ? "Paid" : "Unpaid"}
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
                if (value) setDueDate(value.hour(12).minute(0).second(0));
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
            <Button
              color="danger"
              variant="solid"
              onClick={() => handleDelete()}
            >
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default BillInstance;
