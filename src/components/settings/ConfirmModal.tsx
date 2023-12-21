import React, { useState } from "react";
import { Modal } from "antd";

function ConfirmModal({ onDelete, isLoading = false, name, item }) {
  const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <>
      {item === "profile" ? (
        <>
          <button
            className="p-2 bg-red-600 min-w-[79px] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-800 focus:outline-none focus:border-red-400 focus:ring ring-red-300 disabled:opacity-25 transition ease-in-out duration-150"
            onClick={() => {
              setOpenConfirm(true);
            }}
          >
            Delete
          </button>
        </>
      ) : (
        <li
          onClick={() => {
            setOpenConfirm(true);
          }}
          className="whitespace-nowrap"
        >
          <a className="whitespace-nowrap flex items-center gap-2">
            <i className="fa-solid fa-trash"></i>
            <div>Delete this bill</div>
          </a>
        </li>
      )}

      <Modal
        title={"Are you sure you want to delete " + name + "?"}
        centered
        open={openConfirm}
        destroyOnClose
        keyboard
        okText="Create"
        cancelText="Cancel"
        onOk={() => setOpenConfirm(false)}
        onCancel={() => setOpenConfirm(false)}
        footer={null}
      >
        <div className="flex gap-3 items-center justify-end mt-12">
          <button
            className="p-2 border bg-white border-black rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors uppercase"
            onClick={() => setOpenConfirm(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="p-2 bg-red-600 min-w-[79px] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-800 focus:outline-none focus:border-red-400 focus:ring ring-red-300 disabled:opacity-25 transition ease-in-out duration-150"
            onClick={onDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}

export default ConfirmModal;
