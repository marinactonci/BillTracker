import React, { useState } from "react";
import { Modal, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import CryptoJS from "crypto-js";
import { secretKey } from "../services/firebaseConfig";

interface AddBillProps {
  profile: any;
  onSave: (newBill: any) => void;
}

function AddBill({ profile, onSave }: AddBillProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "right",
      y: "top",
    },
    dismissible: true,
  });

  const reset = () => {
    setName("");
    setLink("");
    setUsername("");
    setPassword("");
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  const encrypt = (plainText) => {
    return CryptoJS.AES.encrypt(plainText, secretKey).toString();
  };

  const handleSave = () => {
    const createNewId = () => {
      if (profile.bills.length === 0) return 1;
      return profile.bills[profile.bills.length - 1].id + 1;
    };

    if (name === "") {
      notyf.error("Please enter a name");
      return;
    }

    const newBill = {
      id: createNewId(),
      name: name,
      eBill: {
        link: link,
        username: encrypt(username),
        password: encrypt(password),
      },
      items: [],
    };

    onSave(newBill);
    reset();
    setOpen(false);
  };

  return (
    <>
      <button
        className="w-5 h-5 grid place-items-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
        onClick={() => setOpen(true)}
      >
        <i className="fa fa-plus text-xs"></i>
      </button>
      <Modal
        title={"Add a new bill to " + profile.name}
        centered
        open={open}
        destroyOnClose
        keyboard
        okText="Create"
        cancelText="Cancel"
        footer={null}
        onOk={() => setOpen(false)}
        onCancel={() => handleCancel()}
      >
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Name</span>
            <Input
              type="text"
              placeholder="Bill name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>
          <label className="text-gray-900 mt-3 text-lg">
            E-bill (optional)
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Link</span>
            <Input
              type="text"
              placeholder="https://www.example.com"
              onChange={(e) => {
                setLink(e.target.value);
              }}
            />
          </label>
          <label className="text-gray-900 text-md">Credentials</label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Username</span>
            <Input
              type="text"
              placeholder="Username or email for login"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Password</span>
            <Input.Password
              placeholder="Password for login"
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </form>
        <div className="flex items-center justify-end mt-6">
          <div className="flex gap-3">
            <button
              className="p-2 border bg-white border-black rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors uppercase"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="p-2 bg-black min-w-[70px] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading && (
                <span className="loading loading-spinner loading-md"></span>
              )}
              {!isLoading && "Add"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AddBill;
