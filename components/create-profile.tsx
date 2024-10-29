import React, { useState } from "react";
import { Modal, AutoComplete, Input, Button } from "antd";
import { countries } from "@/utils/countries";
import { PlusCircleOutlined } from "@ant-design/icons";
import { createProfile } from "@/utils/supabaseUtils";
import { notification } from "antd";
import { useTranslations } from "next-intl";

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

  const t = useTranslations("profiles");

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
        title={t("title_create")}
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
            <span className="text-gray-700">{t("name")}</span>
            <Input
              type="text"
              placeholder={t("name_placeholder")}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>
          <label className="text-gray-900 mt-3 text-lg">{t("address")}</label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">{t("street")}</span>
            <Input
              type="text"
              placeholder={t("street_placeholder")}
              onChange={(e) => {
                setStreet(e.target.value);
              }}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">{t("city")}</span>
            <Input
              type="text"
              placeholder={t("city_placeholder")}
              onChange={(e) => {
                setCity(e.target.value);
              }}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">{t("country")}</span>
            <AutoComplete
              allowClear
              options={countries.map((country) => {
                return {
                  value:
                    country[
                      `name_${localStorage.getItem("locale") as "en" | "hr"}`
                    ],
                  name: country[
                    `name_${localStorage.getItem("locale") as "en" | "hr"}`
                  ],
                  label:
                    country[
                      `name_${localStorage.getItem("locale") as "en" | "hr"}`
                    ],
                };
              })}
              onChange={(value) => {
                const selectedValue = Array.isArray(value) ? value[0] : value;
                countries.forEach((countryItem) => {
                  if (
                    countryItem[
                      `name_${localStorage.getItem("locale") as "en" | "hr"}`
                    ] === selectedValue
                  ) {
                    setCountry(countryItem.code);
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
              placeholder={t("country_placeholder")}
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
            {t("cancel")}
          </Button>
          <Button onClick={handleCreate} disabled={isLoading} type="primary">
            {isLoading && (
              <span className="loading loading-spinner loading-md"></span>
            )}
            {!isLoading && t("create")}
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default CreateProfile;
