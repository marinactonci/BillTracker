import React, { useState } from "react";
import { Modal, DatePicker } from "antd";
import dayjs from "dayjs";

function AddBill({ profile, onSave }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const createNewId = () => {
      if (profile.bills.length === 0) return 1;
      return profile.bills[profile.bills.length - 1].id + 1;
    };

    const newBill = {
      id: createNewId(),
      name: name,
      link: link,
      items: [],
    };

    onSave(newBill);
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
        <form className="flex flex-col gap-3">
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Name</span>
            <input
              type="text"
              className="input input-bordered text-sm placeholder:font-light placeholder:text-sm placeholder:text-gray-400"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>

          {/* <label className="flex flex-col w-full">
            <span className="text-gray-700">Due date</span>
            <DatePicker
              className="input input-bordered w-full m-0 focus:border-gray-500 !placeholder:font-bold"
              format={"DD.MM.YYYY."}
              showToday
              onChange={(value) => {
                if (!value) return;
                console.log(value);
                setDueDate(value);
              }}
            />
          </label> */}
          {/* <label className="flex flex-col w-full">
            <span className="text-gray-700">Month</span>
            <DatePicker
              className="input input-bordered w-full m-0 focus:border-gray-500 !placeholder:font-bold"
              format={"MM.YYYY."}
              picker="month"
              onChange={(value) => {
                if (!value) return;
                console.log(value);
                setMonth(value);
              }}
            />
          </label> */}
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Link</span>
            <input
              type="text"
              className="input input-bordered text-sm placeholder:font-light placeholder:text-sm placeholder:text-gray-400"
              placeholder="Eg. New York"
              onChange={(e) => {
                setLink(e.target.value);
              }}
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
              {!isLoading && "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AddBill;
