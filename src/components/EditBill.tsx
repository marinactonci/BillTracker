import React, { useEffect, useState } from "react";
import { Modal, Input, Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { secretKey } from "../services/firebaseConfig";
import CryptoJS from "crypto-js";

interface EditBillProps {
  onSave: (newBill: any) => void;
  bill: any;
}

function EditBill({ onSave, bill }: EditBillProps) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [open, setOpen] = useState(false);

  const [copyUsernameIcon, setCopyUsernameIcon] = useState("fa-solid fa-copy");
  const [copyPasswordIcon, setCopyPasswordIcon] = useState("fa-solid fa-copy");

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    setName(bill.name);
    setLink(bill.eBill.link);
    setUsername(decrypt(bill.eBill.username));
    setPassword(decrypt(bill.eBill.password));
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

  const handleSave = () => {
    const newBill = {
      id: bill.id,
      name: name,
      eBill: {
        link: link,
        username: encrypt(username),
        password: encrypt(password),
      },
    };
    onSave(newBill);
    setOpen(false);
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  return (
    <>
      <li onClick={() => setOpen(true)} className="whitespace-nowrap">
        <a className="whitespace-nowrap flex items-center gap-2">
          <i className="fa-solid fa-pen"></i>
          <div>Edit this bill</div>
        </a>
      </li>
      <Modal
        title={"Edit " + bill.name}
        centered
        open={open}
        destroyOnClose
        footer={null}
        onOk={() => setOpen(false)}
        onCancel={() => handleCancel()}
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
              <div className="flex gap-3 items-center">
                <Input
                  type="text"
                  placeholder="https://www.example.com"
                  defaultValue={link}
                  onChange={(e) => {
                    setLink(e.target.value);
                  }}
                />
                <a href={bill.eBill.link} target="_blank">
                  <Button>
                    <i className="fa-solid fa-external-link"></i>
                  </Button>
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="username">Username</label>
              <div className="flex gap-3 items-center">
                <Input
                  placeholder="Username or email for login"
                  defaultValue={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
                <Button
                  onClick={(e) => {
                    navigator.clipboard
                      .writeText(decrypt(bill.eBill.username))
                      .then(() => {
                        setCopyUsernameIcon("fa-solid fa-check");
                        setTimeout(() => {
                          setCopyUsernameIcon("fa-solid fa-copy");
                        }, 2000);
                      });
                  }}
                >
                  <i className={copyUsernameIcon}></i>
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password">Password</label>
              <div className="flex gap-3 items-center">
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
                <Button
                  onClick={(e) => {
                    navigator.clipboard
                      .writeText(decrypt(bill.eBill.password))
                      .then(() => {
                        setCopyPasswordIcon("fa-solid fa-check");
                        setTimeout(() => {
                          setCopyPasswordIcon("fa-solid fa-copy");
                        }, 2000);
                      });
                  }}
                >
                  <i className={copyPasswordIcon}></i>
                </Button>
              </div>
            </div>
          </div>
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
        </form>
      </Modal>
    </>
  );
}

export default EditBill;
