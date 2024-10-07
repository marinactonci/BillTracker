"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { signUp } from "../../utils/authUtils";
import { notification } from "antd";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [api, contextHolder] = notification.useNotification();

  const isDisabled = loading || !email || !password || !confirmPassword;

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { user } = await signUp(email, password);
      console.log("Signed up: ", user);
      //router.push("/login");
      api.success({
        message: "Registration successful",
        description:
          "A confirmation email has been sent to your email address. Please verify your email to login.",
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
    setLoading(false);
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-[84vh] grid place-items-center">
        <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold text-center text-gray-700">
            Register a new account
          </h2>
          <div className="grid grid-cols-2 gap-4 my-4">
            {/* <button
              className="flex items-center justify-center space-x-2 h-12 border border-black rounded-md hover:bg-gray-50 transition-colors"
              onClick={handleGoogleLogin}
            >
              <img src="/google.svg" alt="" />
              <span>Google</span>
            </button> */}
            {/* <button
              className="flex items-center justify-center space-x-2 h-12 bg-black text-white rounded-md hover:bg-slate-900 transition-colors"
              onClick={handleGithubLogin}
            >
              <i className="fa-brands fa-github"></i>
              <span>Github</span>
            </button> */}
          </div>
          <div className="relative my-2">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or register with your email
              </span>
            </div>
          </div>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <Input.Password
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="confirm_password"
              >
                Confirm Password
              </label>
              <Input.Password
                visibilityToggle={{
                  visible: passwordConfirmVisible,
                  onVisibleChange: setPasswordConfirmVisible,
                }}
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <button
              className="w-full p-2 mt-1 bg-black border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
              type="submit"
              onClick={handleRegister}
              disabled={isDisabled}
            >
              Sign Up
            </button>
          </form>
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
            </span>
            <Link
              className="ml-1 text-sm font-medium text-gray-600 hover:underline"
              href="/login"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
