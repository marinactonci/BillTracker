import React, { useState } from "react";
import { Modal, Input, Checkbox, Button } from "antd";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { createBill } from "@/utils/supabaseUtils";
import { notification } from "antd";
import { encrypt } from "@/utils/encryption";

interface AddBillProps {
  profileId: number;
  onChange: () => void;
}

function CreateBill({ profileId, onChange }: AddBillProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [isRecurring, setIsRecurring] = useState(true);
  const [link, setLink] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [api, contextHolder] = notification.useNotification();

  const handleAdd = async () => {
    setIsLoading(true);

    if (!name) {
      setError("Name is required.");
      return;
    }

    try {
      await createBill(
        profileId,
        name,
        isRecurring,
        link,
        encrypt(username),
        encrypt(password)
      );
      setError(null);
      api.success({
        message: "Bill added",
        description: `Your ${name} bill has been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding bill:", error);
      setError("Failed to add bill. Please try again.");
      api.error({
        message: "Failed to add bill",
        description: `Your ${name} bill could not be added. Please try again.`,
      });
    }

    setIsLoading(false);
    onChange();
    setOpen(false);
  };

  return (
    <>
      {contextHolder}
      <div className="flex items-stretch h-full min-h-36">
        <Button
          className="flex-1 flex items-center justify-center"
          onClick={() => setOpen(true)}
          style={{ height: "100%", width: "100%" }}
        >
          <PlusCircleOutlined style={{ fontSize: "2rem" }} />
        </Button>
      </div>
      <Modal
        title={"Add a new bill"}
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
              placeholder="Bill name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>
          <Checkbox
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          >
            Is recurring
          </Checkbox>
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
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="text-red-500">{error}</p>}
        </form>
        <div className="flex items-center justify-end mt-6">
          <div className="flex gap-3">
            <Button onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={isLoading} type="primary">
              {isLoading && (
                <span className="loading loading-spinner loading-md"></span>
              )}
              {!isLoading && "Add"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CreateBill;
