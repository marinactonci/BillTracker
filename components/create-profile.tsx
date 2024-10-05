import React, { useState } from "react";
import { Modal, AutoComplete, Input, Button } from "antd";
import { countries } from "@/utils/countries";
import { PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { createProfile } from "@/utils/supabaseUtils";
import { notification } from "antd";

interface CreateProfileProps {
  onChange: () => void;
}

function CreateProfile({ onChange }: CreateProfileProps) {
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [api, contextHolder] = notification.useNotification();

  const handleCreate = async () => {
    setIsLoading(true);
    setError(null);

    if (!name || !street || !city || !country) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      await createProfile(name, street, city, country);
      setOpen(false);
      setError(null);
      api.success({
        message: "Profile created",
        description: `Your ${name} profile has been created successfully.`,
      });
      onChange();
    } catch (error) {
      console.error("Error creating profile:", error);
      setError("Failed to create profile. Please try again.");
    }
    setIsLoading(false);
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
        title="Create a new profile"
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
              placeholder="Enter profile name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>
          <label className="text-gray-900 mt-3 text-lg">Address</label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Street</span>
            <Input
              type="text"
              placeholder="Eg. 123 Main St."
              onChange={(e) => {
                setStreet(e.target.value);
              }}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">City</span>
            <Input
              type="text"
              placeholder="Eg. New York"
              onChange={(e) => {
                setCity(e.target.value);
              }}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Country</span>
            <AutoComplete
              allowClear
              options={countries.map((country) => {
                return {
                  value: country.name,
                  name: country.name,
                  label: country.name,
                };
              })}
              onChange={(value) => {
                countries.forEach((country) => {
                  if (country.name === value) {
                    setCountry(country.code);
                  }
                });
              }}
              filterOption={(inputValue, option) => {
                if (option?.value === undefined) return false;
                return (
                  option?.name
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                );
              }}
              placeholder="Eg. United States"
            />
          </label>
          {error && (
            <div className="text-red-500 text-sm font-semibold">{error}</div>
          )}
        </form>
        <div className="modal-action">
          <button
            className="p-2 border bg-white border-black rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors uppercase"
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="p-2 bg-black min-w-[70px] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
            onClick={handleCreate}
            disabled={isLoading}
          >
            {isLoading && (
              <span className="loading loading-spinner loading-md"></span>
            )}
            {!isLoading && "Create"}
          </button>
        </div>
      </Modal>
    </>
  );
}

export default CreateProfile;
