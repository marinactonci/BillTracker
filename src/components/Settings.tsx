import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, changePassword, verifyEmail } from "../services/firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";
import { Modal, Input, Cascader } from "antd";
import { changeDisplayName } from "../services/firebaseAuth";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import countries from "../utils/countries.json";
import { getUserCountry } from "../services/utilities";

function Settings() {
  const [user, setUser] = useState({} as any);
  const [isLoggedIn, setIsLoggedIn] = useState({});

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const navigator = useNavigate();

  let provider = "";
  if (Array.isArray(user.providerData) && user.providerData.length > 0) {
    provider = user.providerData[0].providerId;
  }

  useEffect(() => {
    const listener = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        setDisplayName(user.displayName || "");
        setEmail(user.email || "");
        handleGetCountry();
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => listener();
  }, []);

  const handleGetCountry = async () => {
    const country = await getUserCountry();
    if (country !== null) {
      setCountry(country);
    }
  };

  const handleNameChange = async (name: string) => {
    const response = await changeDisplayName(user, name);
    if (response !== null && response.success) {
      setDisplayName(response.displayName || user.displayName);
    }
  };

  const handlePasswordChange = async (
    oldPassword: string,
    newPassword: string
  ) => {
    await changePassword(user, oldPassword, newPassword);
  };

  const handleVerifyEmail = async () => {
    console.log("clicked");
    await verifyEmail(user);
  };

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-[84vh] grid place-items-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-xl">
              You have to be signed in to view this page
            </p>
            <button
              className="p-2 bg-black border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
              onClick={() => navigator("/login")}
            >
              Log In
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto min-h-[84vh] py-20">
        <h1 className="text-2xl font-medium">User Settings</h1>
        <div className="flex flex-col gap-6 mt-5 max-w-4xl">
          <div className="flex justify-between items-center pb-3 border-b">
            <div className="flex flex-col gap-2 max-w-2xl">
              <label>Display name</label>
              <div className="flex flex-row items-center gap-2">
                <i className="fa-solid fa-user text-zinc-500"></i>
                <p className="text-lg">{displayName}</p>
              </div>
            </div>
            <ChangeNameModal onConfirm={handleNameChange} />
          </div>
          <div className="flex justify-between items-center pb-3 border-b">
            <div className="flex flex-col gap-2 max-w-2xl">
              <label>Email</label>
              <div className="flex flex-row items-center gap-2">
                <i className="fa-solid fa-envelope text-zinc-500"></i>
                <p className="text-lg">{email}</p>
              </div>
            </div>
          </div>
          {provider === "password" && (
            <>
              <div className="flex justify-between items-center pb-3 border-b">
                <div className="flex flex-col gap-2 max-w-2xl">
                  <label>Password</label>
                  <div className="flex flex-row items-center gap-2">
                    <i className="fa-solid fa-lock text-zinc-500"></i>
                    <p className="text-lg">Change your account password</p>
                  </div>
                </div>
                <ChangePasswordModal onConfirm={handlePasswordChange} />
              </div>
            </>
          )}
          {!user.emailVerified && (
            <div className="flex justify-between items-center pb-3 border-b">
              <div className="flex flex-col gap-2 max-w-2xl">
                <label>Verify email</label>
                <div className="flex flex-row items-center gap-2">
                  <i className="fa-solid fa-certificate text-zinc-500"></i>
                  <p className="text-lg">
                    Verify your email address to gain access to 2-factor
                    authentication. Clicking the button below will send a
                    verification email to your email address.
                  </p>
                </div>
              </div>
              <button
                className="px-4 py-2 w-28 bg-black border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                onClick={() => {
                  handleVerifyEmail();
                }}
                disabled={isDisabled}
              >
                Send
              </button>
            </div>
          )}
          <div className="flex justify-between items-center pb-3 border-b">
            <div className="flex flex-col gap-2 max-w-2xl">
              <label>2-factor authentication</label>
              <div className="flex flex-row items-center gap-2">
                <i className="fa-solid fa-shield-halved text-zinc-500"></i>
                <p className="text-lg">
                  Protect your account with a second verification step.
                </p>
              </div>
            </div>
            <Add2FAModal user={user} />
          </div>
          <div className="flex justify-between items-center pb-3 border-b">
            <div className="flex flex-col gap-2 max-w-2xl">
              <label>Log out everywhere</label>
              <div className="flex flex-row items-center gap-2">
                <i className="fa-solid fa-power-off text-zinc-500"></i>
                <p className="text-lg">
                  Log out on all devices for security reasons. You will need to
                  log in again on each device.
                </p>
              </div>
            </div>
            <button
              className="px-4  whitespace-nowrap py-2 w-28 bg-black border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
              onClick={() => {}}
            >
              Log out
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2 max-w-2xl">
              <label>Delete account</label>
              <div className="flex flex-row items-center gap-2">
                <i className="fa-solid fa-trash text-zinc-500"></i>
                <p className="text-lg">
                  Permanently delete your account, profiles, and bills. You will
                  be asked for confirmation before deletion proceeds.
                </p>
              </div>
            </div>
            <button
              className="px-4 py-2 w-28 bg-red-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-800 focus:outline-none focus:border-red-400 focus:ring ring-red-300 disabled:opacity-25 transition ease-in-out duration-150"
              onClick={() => {}}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ChangeNameModal({ onConfirm }) {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const handleOk = () => {
    setOpen(false);
    onConfirm(name);
    setName("");
  };

  const handleCancel = () => {
    setOpen(false);
    setName("");
  };

  return (
    <>
      <button
        className="px-4 py-2 w-28 whitespace-nowrap bg-black border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
        onClick={() => setOpen(true)}
      >
        Change
      </button>
      <Modal
        title={"Change your name"}
        centered
        open={open}
        destroyOnClose
        keyboard
        onOk={() => handleOk()}
        onCancel={() => handleCancel()}
        footer={null}
      >
        <label className="flex flex-col w-full my-5">
          <span className="text-gray-700">New name</span>
          <Input
            type="text"
            placeholder="Enter your new name..."
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </label>
        <div className="flex gap-3 items-center justify-end mt-12">
          <button
            className="p-2 border bg-white border-black rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors uppercase"
            onClick={() => handleCancel}
          >
            Cancel
          </button>
          <button
            className="p-2 bg-black min-w-[79px] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
            onClick={handleOk}
          >
            Confirm change
          </button>
        </div>
      </Modal>
    </>
  );
}

function ChangePasswordModal({ onConfirm }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] =
    useState(false);
  const [open, setOpen] = useState(false);

  const notyf = new Notyf({
    duration: 3000,
    position: {
      x: "right",
      y: "top",
    },
  });

  const handleOk = () => {
    if (newPassword !== confirmNewPassword) {
      return notyf.error("Passwords do not match");
    }
    setOpen(false);
    onConfirm(oldPassword, newPassword);
    reset();
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const reset = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setOldPasswordVisible(false);
    setNewPasswordVisible(false);
    setConfirmNewPasswordVisible(false);
  };

  return (
    <>
      <button
        className="px-4 py-2 w-28 whitespace-nowrap bg-black border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
        onClick={() => setOpen(true)}
      >
        Change
      </button>
      <Modal
        title={"Change your password"}
        centered
        open={open}
        destroyOnClose
        keyboard
        onOk={() => handleOk()}
        onCancel={() => handleCancel()}
        footer={null}
      >
        <label className="flex flex-col w-full my-5">
          <span className="text-gray-700">Current password</span>
          <Input.Password
            placeholder="Enter your current password..."
            visibilityToggle={{
              visible: oldPasswordVisible,
              onVisibleChange: setOldPasswordVisible,
            }}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </label>
        <label className="flex flex-col w-full my-5">
          <span className="text-gray-700">New password</span>
          <Input.Password
            placeholder="Enter your new password..."
            visibilityToggle={{
              visible: newPasswordVisible,
              onVisibleChange: setNewPasswordVisible,
            }}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label className="flex flex-col w-full my-5">
          <span className="text-gray-700">Confirm new password</span>
          <Input.Password
            placeholder="Confirm your new password..."
            visibilityToggle={{
              visible: confirmNewPasswordVisible,
              onVisibleChange: setConfirmNewPasswordVisible,
            }}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </label>
        <div className="flex gap-3 items-center justify-end mt-12">
          <button
            className="p-2 border bg-white border-black rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors uppercase"
            onClick={() => handleCancel}
          >
            Cancel
          </button>
          <button
            className="p-2 bg-black min-w-[79px] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
            onClick={handleOk}
          >
            Confirm change
          </button>
        </div>
      </Modal>
    </>
  );
}

function Add2FAModal({ user }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        className="px-4 py-2 w-28 bg-black border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
        onClick={() => {
          setOpen(true);
        }}
      >
        {user && user.multiFactor && user.multiFactor.enrolledFactors.length > 0
          ? "Disable"
          : "Enable"}
      </button>
      <Modal
        title={"Enable 2-factor authentication"}
        centered
        open={open}
        destroyOnClose
        keyboard
        onOk={() => handleOk()}
        onCancel={() => handleCancel()}
        footer={null}
      >
        <label className="flex flex-col w-full my-5">
          <span className="text-gray-700">Phone number</span>
          <Input
            addonBefore={
              <Cascader
                options={countries.map((country) => {
                  return {
                    value: country.name,
                    name: country.name,
                    label: country.name,
                  };
                })}
              />
            }
            defaultValue=""
          />
        </label>
        <div className="flex gap-3 items-center justify-end mt-12">
          <button
            className="p-2 border bg-white border-black rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors uppercase"
            onClick={() => handleCancel}
          >
            Cancel
          </button>
          <button
            className="p-2 bg-black min-w-[79px] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
            onClick={handleOk}
          >
            Next
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Settings;
