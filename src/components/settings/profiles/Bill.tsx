import React, { useEffect, useState } from "react";
import ConfirmModal from "../ConfirmModal";
import { Modal } from "antd";
import { DatePicker, InputNumber, Input } from "antd";
import dayjs from "dayjs";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { secretKey } from "../../../services/firebaseConfig";
import CryptoJS from "crypto-js";

function Bill({ onDelete, onSaveEdit, bill }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [dueDate, setDueDate] = useState("");
  const [amount, setAmount] = useState(0.0);
  const [isPaid, setIsPaid] = useState(false);
  const [month, setMonth] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    reset();
  }, []);

  const onAmountChange = (value) => {
    setAmount(value);
  };

  const handleDelete = async (id, item) => {
    onDelete(id, item);
  };

  const encrypt = (plainText) => {
    return plainText.length > 0
      ? CryptoJS.AES.encrypt(plainText, secretKey).toString()
      : "";
  };

  function decrypt(cipherText: string) {
    if (cipherText.length === 0) return "";
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  const reset = () => {
    setName(bill.name);
    setLink(bill.eBill.link);
    setUsername(decrypt(bill.eBill.username));
    setPassword(decrypt(bill.eBill.password));
  };

  const handleCancelEdit = () => {
    reset();
    setOpenEdit(false);
  };

  const handleSaveEdit = () => {
    const newBill = {
      id: bill.id,
      name: name,
      eBill: {
        link: link,
        username: encrypt(username),
        password: encrypt(password),
      },
    };
    onSaveEdit(newBill);
    setOpenEdit(false);
  };

  const handleCancelAdd = () => {
    setOpenAdd(false);
  };

  return (
    <>
      <div
        key={bill.id}
        className="bg-gray-200 flex justify-between items-center py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
      >
        <span>{bill.name}</span>
        <div className="flex gap-3 items-center">
          {bill.eBill.link.length > 0 && (
            <a
              className="text-blue-500 hover:text-blue-600"
              target="_blank"
              href={bill.eBill.link}
              rel="noreferrer"
            >
              <i className="fa-solid fa-external-link"></i>
            </a>
          )}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="w-auto cursor-pointer">
              <i className="fa-solid fa-ellipsis-v justify-center text-xl w-4"></i>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content w-auto menu p-2 shadow bg-base-100 rounded-box relative z-10"
            >
              <li
                onClick={() => setOpenEdit(true)}
                className="whitespace-nowrap"
              >
                <a className="whitespace-nowrap flex items-center gap-2">
                  <i className="fa-solid fa-pen"></i>
                  <div>Edit this bill</div>
                </a>
              </li>
              <li
                onClick={() => setOpenAdd(true)}
                className="whitespace-nowrap"
              >
                <a className="whitespace-nowrap flex items-center gap-2">
                  <i className="fa-solid fa-gear"></i>
                  <div>Manage months</div>
                </a>
              </li>
              <ConfirmModal
                onDelete={() => handleDelete(bill.id, "bill")}
                name={bill.name}
                item={"bill"}
              />
            </ul>
          </div>
        </div>
      </div>
      <Modal
        title={"Edit " + bill.name}
        centered
        open={openEdit}
        destroyOnClose
        footer={null}
        onOk={() => setOpenEdit(false)}
        onCancel={() => handleCancelEdit()}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="name">Name</label>
              <Input
                type="text"
                defaultValue={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="link">Link</label>
              <Input
                type="text"
                placeholder="https://www.example.com"
                defaultValue={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="username">Username</label>
              <Input
                type="text"
                placeholder="Username or email for login"
                defaultValue={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password">Password</label>
              <Input.Password
                placeholder="Password for login"
                defaultValue={password}
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-end mt-8">
            <div className="flex gap-3">
              <button
                className="p-2 border bg-white border-black rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors uppercase"
                onClick={() => handleCancelEdit()}
              >
                Cancel
              </button>
              <button
                className="p-2 bg-black min-w-[70px] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                onClick={() => handleSaveEdit()}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </Modal>
      <Modal
        title={"Manage months for " + bill.name}
        centered
        open={openAdd}
        destroyOnClose
        footer={null}
        onOk={() => setOpenAdd(false)}
        onCancel={() => handleCancelAdd()}
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
        </form>
        <div className="flex items-center justify-end mt-8">
          <div className="flex gap-3">
            <button
              className="p-2 border bg-white border-black rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors uppercase"
              onClick={() => handleCancelAdd()}
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

export default Bill;
