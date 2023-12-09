import React, { useState, useEffect } from "react";
import { Modal, AutoComplete } from "antd";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import countries from "../../../utils/countries.json";
import AddBill from "./AddBill";

function Profile({ onSave, onDelete, profile }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [tab, setTab] = useState(1);

  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "right",
      y: "top",
    },
    dismissible: true,
  });

  useEffect(() => {
    reset();
  }, []);

  const handleSave = async () => {
    setIsLoadingSave(true);
    const newProfile = {
      id: profile.id,
      name: name,
      address: {
        street: street,
        city: city,
        country: countries.find((countryItem) => countryItem.name === country)
          ?.code,
      },
      bills: profile.bills,
    };
    await onSave(newProfile);
    setIsLoadingSave(false);
    setOpen(false);
    notyf.success("Profile updated successfully");
  };

  const handleDelete = async (id, item) => {
    setIsLoadingDelete(true);
    if (item === "profile") {
      onDelete(item, id, null);
      setOpen(false);
    } else onDelete(item, profile.id, id);
    setIsLoadingDelete(false);
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  const handleAddBill = (bill) => {
    const newProfile = {
      id: profile.id,
      name: profile.name,
      address: {
        street: profile.address.street,
        city: profile.address.city,
        country: profile.address.country,
      },
      bills: [...profile.bills, bill],
    };
    onSave(newProfile);
  };

  const reset = () => {
    setName(profile.name);
    setStreet(profile.address.street);
    setCity(profile.address.city);
    countries.forEach((countryItem) => {
      if (countryItem.code === profile.address.country) {
        setCountry(countryItem.name);
      }
    });
  };

  return (
    <>
      <div
        className="flex flex-col gap-3 border-2 rounded-lg p-6 hover:cursor-pointer hover:border-black transition-colors"
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-house text-zinc-500"></i>
            <h1 className="text-xl font-medium">{profile.name}</h1>
          </div>
          <div className="flex gap-2 items-center text-sm">
            <i className="fa-solid fa-location-dot text-zinc-500"></i>
            <p className=" text-zinc-500">
              {profile.address.street}, {profile.address.city},{" "}
              {countries.map((countryItem) => {
                if (countryItem.code === profile.address.country) {
                  return countryItem.name;
                }
              })}
            </p>
          </div>
        </div>

        <div>Bills added: {profile.bills.length}</div>
      </div>
      <Modal
        title={"Edit " + profile.name}
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
        <div role="tablist" className="tabs tabs-bordered">
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Basic info"
            defaultChecked
            onChange={() => setTab(1)}
          />
          <div role="tabpanel" className="tab-content pt-4 min-h-[450px]">
            <form method="dialog" className="flex flex-col gap-3">
              <label className="flex flex-col w-full">
                <span className="text-gray-700">Name</span>
                <input
                  type="text"
                  className="input input-bordered text-sm placeholder:font-light placeholder:text-sm placeholder:text-gray-400"
                  placeholder="Enter profile name"
                  defaultValue={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </label>
              <label className="text-gray-900 mt-3 text-lg">Address</label>
              <label className="flex flex-col w-full">
                <span className="text-gray-700">Street</span>
                <input
                  type="text"
                  className="input input-bordered text-sm placeholder:font-light placeholder:text-sm placeholder:text-gray-400"
                  placeholder="Eg. 123 Main St."
                  defaultValue={street}
                  onChange={(e) => {
                    setStreet(e.target.value);
                  }}
                />
              </label>
              <label className="flex flex-col w-full">
                <span className="text-gray-700">City</span>
                <input
                  type="text"
                  className="input input-bordered text-sm placeholder:font-light placeholder:text-sm placeholder:text-gray-400"
                  placeholder="Eg. New York"
                  defaultValue={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                />
              </label>
              <label className="flex flex-col w-full">
                <span className="text-gray-700">Country</span>
                <AutoComplete
                  className="input input-bordered w-full m-0 p-0 focus:border-gray-500 !placeholder:font-bold"
                  bordered={false}
                  allowClear
                  defaultValue={country}
                  options={countries.map((country) => {
                    return {
                      value: country.name,
                      name: country.name,
                      label: country.name,
                    };
                  })}
                  onChange={(value) => {
                    countries.forEach((countryItem) => {
                      if (countryItem.name === value) {
                        setCountry(countryItem.name);
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
            </form>
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Bills"
            onChange={() => setTab(2)}
          />
          <div role="tabpanel" className="tab-content pt-4 min-h-[450px]">
            <div className="flex gap-3 items-center mt-3">
              <label className="text-gray-900 text-lg">Bills</label>
              <div>
                <AddBill profile={profile} onSave={handleAddBill} />
              </div>
            </div>
            {profile.bills.length > 0 ? (
              <>
                <div className="flex flex-col gap-3 mt-3">
                  {profile.bills.map((bill) => (
                    <div
                      key={bill.id}
                      className="bg-gray-200 flex justify-between p-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <span>{bill.name}</span>
                      <div className="flex gap-3">
                        <a
                          className="text-blue-500 hover:text-blue-600"
                          href={bill.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa-solid fa-external-link"></i>
                        </a>
                        <ConfirmModal
                          onDelete={() => handleDelete(bill.id, "bill")}
                          isLoading={isLoadingDelete}
                          name={bill.name}
                          item={"bill"}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <span className="text-gray-700">
                  You don't have any bills added yet.
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <ConfirmModal
            onDelete={() => handleDelete(profile.id, "profile")}
            isLoading={isLoadingDelete}
            name={profile.name}
            item={"profile"}
          />
          <div className="flex gap-3">
            <button
              className="p-2 border bg-white border-black rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors uppercase"
              onClick={handleCancel}
            >
              Cancel
            </button>
            {tab === 1 && (
              <button
                className="p-2 bg-black min-w-[70px] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                onClick={handleSave}
                disabled={isLoadingSave || isLoadingDelete}
              >
                {isLoadingSave && (
                  <span className="loading loading-spinner loading-md"></span>
                )}
                {!isLoadingSave && "Save"}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

function ConfirmModal({ onDelete, isLoading, name, item }) {
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
        <div
          onClick={() => {
            setOpenConfirm(true);
          }}
        >
          <i className="fa-solid fa-trash text-red-600 hover:text-red-700 transition-colors hover:cursor-pointer"></i>
        </div>
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

export default Profile;
