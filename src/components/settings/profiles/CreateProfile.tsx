import React, { useState } from "react";
import { Modal, AutoComplete } from "antd";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { getCurrentUser } from "../../../services/firebaseAuth";
import { getProfiles, addProfile } from "../../../services/firebaseFirestore";
import countries from "../../../utils/countries.json";

function CreateProfile({ onCreateProfile }) {
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "right",
      y: "top",
    },
    dismissible: true,
  });

  const handleCreate = async () => {
    setIsLoading(true);
    const user = await getCurrentUser();
    let profiles: any;
    if (user?.uid) {
      profiles = await getProfiles(user?.uid);
      profiles.sort((a, b) => a.id - b.id);
    }

    const createNewId = () => {
      if (profiles.length === 0) return 1;
      return profiles[profiles.length - 1].id + 1;
    };

    const profile = {
      id: createNewId(),
      name: name,
      address: {
        street: street,
        city: city,
        country: country,
      },
      bills: [],
    };
    if (user?.uid === undefined) return;

    await addProfile(user.uid, profile);
    setIsLoading(false);
    setOpen(false);
    notyf.success("Profile created successfully");
    onCreateProfile();
  };

  return (
    <>
      <div
        className="border-2 rounded-lg p-6 hover:border-black hover:cursor-pointer transition-colors grid place-items-center"
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className="w-12 h-12 bg-gray-900 rounded-full grid place-items-center">
          <i className="fa-solid fa-plus text-white"></i>
        </div>
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
        <form method="dialog" className="flex flex-col gap-3">
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Name</span>
            <input
              type="text"
              className="input input-bordered text-sm placeholder:font-light placeholder:text-sm placeholder:text-gray-400"
              placeholder="Enter profile name"
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
        </form>
        <div className="modal-action">
          <button
            className="p-2 border bg-white border-black rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors uppercase"
            onClick={() => {
              setOpen(false);
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
