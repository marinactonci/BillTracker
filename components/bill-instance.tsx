import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  DatePicker,
  Input,
  InputNumber,
  Switch,
  message,
} from "antd";
import dayjs from "dayjs";
import { updateBillInstance, deleteBillInstance } from "@/utils/supabaseUtils";
import { useTranslations } from "next-intl";
import enUS from "antd/es/date-picker/locale/en_US";
import hrHR from "antd/es/date-picker/locale/hr_HR";

interface BillInstanceProps {
  event: {
    id: number;
    billName: string;
    profileName: string;
    month: Date;
    dueDate: Date;
    amount: number;
    isPaid: boolean;
    description: string;
  };
  onChange: () => void;
}

function BillInstance({ event, onChange }: BillInstanceProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(dayjs(event.month));
  const [dueDate, setDueDate] = useState(dayjs(event.dueDate));
  const [amount, setAmount] = useState(event.amount);
  const [description, setDescription] = useState(event.description);
  const [isPaid, setIsPaid] = useState(event.isPaid);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const { TextArea } = Input;

  const t = useTranslations("calendar.bill_instance");

  useEffect(() => {
    setMonth(dayjs(event.month));
    setDueDate(dayjs(event.dueDate));
    setAmount(event.amount);
    setDescription(event.description);
    setIsPaid(event.isPaid);
  }, [event]);

  const handleUpdate = async () => {
    setIsLoadingUpdate(true);
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
        description,
      });
      setOpen(false);
      onChange();
      message.success("Bill instance updated successfully");
    } catch (error) {
      console.error("Error updating bill instance:", error);
      message.error("Failed to update bill instance");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const handleDelete = async () => {
    setIsLoadingDelete(true);
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

    setIsLoadingDelete(false);
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`text-xs hover:cursor-pointer border ${
          event.isPaid
            ? "bg-green-100 border-green-600"
            : "bg-red-100 border-red-600"
        } p-1 rounded`}
      >
        <div className="font-medium">{event.billName}</div>
        <div className="text-gray-600">{event.profileName}</div>
        <div className="text-gray-500">{event.amount.toFixed(2)} €</div>
        <div className={event.isPaid ? "text-green-600" : "text-red-600"}>
          {event.isPaid ? "Paid" : "Unpaid"}
        </div>
      </div>
      <Modal
        title={t("title_update")}
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
            <span className="text-gray-700">{t("month")}</span>
            <DatePicker
              format={"MM.YYYY"}
              picker="month"
              value={month}
              locale={localStorage.getItem("locale") === "hr" ? hrHR : enUS}
              onChange={(value) => {
                if (value) setMonth(value);
              }}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">{t("amount")}</span>
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
            <span className="text-gray-700">{t("due_date")}</span>
            <DatePicker
              format={"DD.MM.YYYY"}
              value={dueDate}
              locale={localStorage.getItem('locale') === 'hr' ? hrHR : enUS}
              onChange={(value) => {
                if (value) setDueDate(value.hour(12).minute(0).second(0));
              }}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">{t("description")}</span>
            <TextArea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <div className="flex items-center gap-3">
            <Switch
              checked={isPaid}
              onChange={(checked: boolean) => setIsPaid(checked)}
            />
            <span className="label-text">
              Status: {isPaid ? t("paid") : t("unpaid")}
            </span>
          </div>
        </form>
        <div className="flex items-center justify-end mt-8">
          <div className="flex gap-3">
            <Button onClick={() => setOpen(false)}>{t("cancel")}</Button>
            <Button
              color="danger"
              variant="solid"
              onClick={() => handleDelete()}
            >
              {isLoadingDelete && (
                <span className="loading loading-spinner loading-md"></span>
              )}
              {!isLoadingDelete && t("delete")}
            </Button>
            <Button type="primary" onClick={handleUpdate}>
              {isLoadingUpdate && (
                <span className="loading loading-spinner loading-md"></span>
              )}
              {!isLoadingUpdate && t("submit_update")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default BillInstance;
