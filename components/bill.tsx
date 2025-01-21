import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Checkbox } from "antd";
import {
  CopyOutlined,
  EditOutlined,
  ExportOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { updateBill, deleteBill } from "@/utils/supabaseUtils";
import { notification } from "antd";
import { encrypt, decrypt } from "@/utils/encryption";
import { BillType } from "@/types/bill";
import ConfirmModal from "./confirm-modal";

interface BillProps {
  bill: BillType;
  onChange: () => void;
}

function Bill({ bill, onChange }: BillProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isRecurring, setIsRecurring] = useState(true);
  const [link, setLink] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordDisplayVisible, setPasswordDisplayVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    setName(bill.name);
    setIsRecurring(bill.is_recurring);
    setLink(bill.link);
    setUsername(decrypt(bill.username));
    setPassword(decrypt(bill.password));
  }, [bill]);

  const handleSave = async () => {
    setIsLoading(true);
    if (!name) {
      setError("Name is required.");
      return;
    }

    try {
      const encryptedUsername = encrypt(username);
      const encryptedPassword = encrypt(password);

      await updateBill(bill.id, {
        name,
        is_recurring: isRecurring,
        link,
        username: encryptedUsername,
        password: encryptedPassword,
      });
      setOpen(false);
      onChange();
      api.success({
        message: "Profile updated",
        description: "Profile has been updated successfully.",
      });
    } catch (error) {
      api.error({
        message: "Error updating profile",
        description: "An error occurred while updating the profile.",
      });
      console.error("Error updating profile:", error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteBill(bill.id);
      onChange();
      api.success({
        message: "Profile deleted",
        description: "Profile has been deleted successfully.",
      });
    } catch (error) {
      api.error({
        message: "Error deleting profile",
        description: "An error occurred while deleting the profile.",
      });
      console.error("Error deleting profile:", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      {contextHolder}
      <div className="flex flex-col p-6 gap-3 border rounded-lg">
        <div className="flex flex-col gap-6 justify-between">
          <h1 className="text-2xl font-bold">{bill.name}</h1>
          <div className="flex flex-col gap-2">
            {bill.link && (
              <div className="text-lg text-zinc-500">
                <div className="flex items-center justify-between flex-wrap">
                  <p className="font-semibold">
                    Link: <span className="font-normal">{bill.link}</span>
                  </p>
                  <Button href={bill.link} target="_blank">
                    <ExportOutlined />
                  </Button>
                </div>
              </div>
            )}
            {decrypt(bill.username) && (
              <div className="text-lg text-zinc-500">
                <div className="flex items-center justify-between flex-wrap">
                  <p className="font-semibold">
                    Username:{" "}
                    <span className="font-normal">
                      {decrypt(bill.username)}
                    </span>
                  </p>
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(decrypt(bill.username))
                    }
                  >
                    <CopyOutlined />
                  </Button>
                </div>
              </div>
            )}
            {decrypt(bill.password) && (
              <div className="text-lg text-zinc-500">
                <div className="flex items-center justify-between flex-wrap">
                  <p className="font-semibold">
                    Password:{" "}
                    <span className="font-normal">
                      {passwordDisplayVisible
                        ? decrypt(bill.password)
                        : // Replace password with asterisks
                          Array(decrypt(bill.password).length)
                            .fill("*")
                            .join("")}
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        setPasswordDisplayVisible(!passwordDisplayVisible)
                      }
                    >
                      {passwordDisplayVisible ? (
                        <EyeInvisibleOutlined />
                      ) : (
                        <EyeOutlined />
                      )}
                    </Button>
                    <Button
                      onClick={() =>
                        navigator.clipboard.writeText(decrypt(bill.password))
                      }
                    >
                      <CopyOutlined />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end items-center gap-2">
            <Button
              className="flex items-center gap-2"
              onClick={() => setOpen(true)}
            >
              <EditOutlined />
              <span>Edit</span>
            </Button>
            <ConfirmModal onConfirm={handleDelete} isLoading={isLoading} />
          </div>
        </div>
      </div>
      <Modal
        title={"Edit bill " + bill.name}
        centered
        open={open}
        destroyOnClose
        keyboard
        okText="Create"
        cancelText="Cancel"
        footer={null}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Name</span>
            <Input
              type="text"
              placeholder="Enter bill name"
              defaultValue={bill.name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>
          <Checkbox
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          >
            Recurring
          </Checkbox>
          <label className="text-gray-900 mt-3 text-lg">E-bill</label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Link</span>
            <Input
              type="text"
              placeholder="https://example.com"
              defaultValue={bill.link}
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
              placeholder="Username for e-bill"
              defaultValue={decrypt(bill.username)}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Password</span>
            <Input.Password
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              defaultValue={decrypt(bill.password)}
              placeholder="Password for e-bill"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && (
            <div className="text-red-500 text-sm font-semibold">{error}</div>
          )}
        </form>
        <div className="modal-action">
          <Button
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} type="primary">
            {isLoading && (
              <span className="loading loading-spinner loading-md"></span>
            )}
            {!isLoading && "Update"}
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Bill;
