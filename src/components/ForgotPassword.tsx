import React, { useState } from "react";
import { Modal, Input } from "antd";
import { forgotPassword } from "../services/firebaseAuth";

function ForgotPassword() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSend = async () => {
    console.log("Send email to: ", email);
    forgotPassword(email);
    await setOpen(false);
  };

  return (
    <>
      <a
        className="text-sm font-medium text-gray-600 hover:underline"
        onClick={() => setOpen(true)}
      >
        Forgot your password?
      </a>
      <Modal
        title={"Forgot Password"}
        centered
        open={open}
        destroyOnClose
        footer={null}
        onOk={() => setOpen(false)}
        onCancel={() => handleCancel()}
      >
        <div>
          <label className="text-sm font-medium text-gray-700" htmlFor="email">
            Email Address
          </label>
          <Input
            type="email"
            id="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="modal-action">
          <button
            className="p-2 border bg-white border-black rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors uppercase"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            className="p-2 bg-black min-w-[70px] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
            onClick={handleSend}
            disabled={!email}
          >
            Send
          </button>
        </div>
      </Modal>
    </>
  );
}

export default ForgotPassword;
