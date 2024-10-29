import React, { useState, useEffect } from "react";
import { Modal, AutoComplete, Input } from "antd";
import { countries } from "../utils/countries";
import {
  EditOutlined,
  HomeOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { updateProfile, deleteProfile } from "@/utils/supabaseUtils";
import { notification } from "antd";
import { ProfileType } from "@/types/profile";
import { useTranslations } from "next-intl";
import ConfirmModal from "./confirm-modal";

interface ProfileProps {
  profile: ProfileType;
  onChange: () => void;
}

function Profile({ profile, onChange }: ProfileProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [defaultValue, setDefaultValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const t = useTranslations("profiles");

  useEffect(() => {
    const locale = localStorage.getItem("locale") as "en" | "hr";
    const selectedCountry = countries.find(
      (country) => country.code === profile.country
    );
    if (selectedCountry) {
      setDefaultValue(selectedCountry[`name_${locale}`]);
    }
    setName(profile.name);
    setStreet(profile.street);
    setCity(profile.city);
    setCountry(profile.country);
  }, [profile]);

  const handleSave = async () => {
    setIsLoading(true);
    if (!name || !street || !city || !country) {
      setError("No fields can be empty.");
      return;
    }

    try {
      await updateProfile(profile.id, name, street, city, country);
      setOpen(false);
      api.success({
        message: "Profile updated",
        description: "Profile has been updated successfully.",
      });
      onChange();
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
      await deleteProfile(profile.id);
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

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      {contextHolder}
      <div className="flex flex-col p-6 gap-3 border rounded-lg">
        <div className="flex flex-col gap-6 justify-between">
          <div className="flex items-center gap-2">
            <HomeOutlined className="text-2xl" />
            <h1 className="text-2xl font-bold">{profile.name}</h1>
          </div>
          <div className="flex gap-2 items-center text-lg">
            <PushpinOutlined />
            <p className=" text-zinc-500">
              {profile.street}, {profile.city},{" "}
              {countries.map((countryItem) => {
                if (countryItem.code === profile.country) {
                  const locale = localStorage.getItem("locale") as "en" | "hr";
                  return countryItem[`name_${locale}`];
                }
              })}
            </p>
          </div>
          <div className="flex justify-end items-center gap-2">
            <Button
              className="flex items-center gap-2"
              onClick={() => setOpen(true)}
            >
              <EditOutlined />
              <span>{t("edit")}</span>
            </Button>
            <ConfirmModal onConfirm={handleDelete} isLoading={isLoading} />
          </div>
        </div>
      </div>
      <Modal
        title={t("title_edit") + profile.name}
        centered
        open={open}
        destroyOnClose
        keyboard
        okText="Update"
        cancelText="Cancel"
        footer={null}
        onOk={() => setOpen(false)}
        onCancel={() => handleCancel()}
      >
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Name</span>
            <Input
              type="text"
              placeholder={t("name_placeholder")}
              defaultValue={name}
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
              defaultValue={profile.street}
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
              defaultValue={city}
              onChange={(e) => {
                setCity(e.target.value);
              }}
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">{t("country")}</span>
            <AutoComplete
              allowClear
              defaultValue={defaultValue}
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
          <Button onClick={handleSave} disabled={isLoading} type="primary">
            {isLoading && (
              <span className="loading loading-spinner loading-md"></span>
            )}
            {!isLoading && t("submit")}
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Profile;
