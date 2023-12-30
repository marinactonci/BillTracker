import React from "react";
import ConfirmModal from "../ConfirmModal";
import AddMonth from "./AddMonth";
import EditBill from "./EditBill";
import EditMonths from "./EditMonths";

function Bill({ onDelete, onSaveEdit, bill }) {
  const handleDelete = async (id, item) => {
    onDelete(id, item);
  };

  const handleSaveEdit = (newBill) => {
    onSaveEdit(newBill);
  };

  const handleAddMonth = (newMonth) => {
    const newBill = {
      id: bill.id,
      name: bill.name,
      eBill: bill.eBill,
      items: [...bill.items, newMonth],
    };
    onSaveEdit(newBill);
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
              <EditBill bill={bill} onSave={handleSaveEdit} />
              <EditMonths bill={bill} onSave={handleSaveEdit} />
              <AddMonth bill={bill} onAddMonth={handleAddMonth} />
              <ConfirmModal
                onDelete={() => handleDelete(bill.id, "bill")}
                name={bill.name}
                item={"bill"}
              />
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Bill;
