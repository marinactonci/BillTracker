import React, { useEffect, useState } from "react";
import ConfirmModal from "../ConfirmModal";
import { Modal } from "antd";

function Bill({ onDelete, bill }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    reset();
  }, []);

  const handleDelete = async (id, item) => {
    onDelete(id, item);
  };

  const reset = () => {
    setName(bill.name);
    setLink(bill.eBill.link);
    setUsername(bill.eBill.username);
    setPassword(bill.eBill.password);
  };

  const handleCancelEdit = () => {
    reset();
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
              <input
                className="border-2 rounded-lg p-2"
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="link">Link</label>
              <input
                className="border-2 rounded-lg p-2"
                type="text"
                name="link"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="username">Username</label>
              <input
                className="border-2 rounded-lg p-2"
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password">Password</label>
              <input
                className="border-2 rounded-lg p-2"
                type="text"
                name="password"
                id="password"
                value={password}
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
              <button className="p-2 bg-black min-w-[70px] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">
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
