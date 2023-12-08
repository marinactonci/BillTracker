import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  register,
  getCurrentUser,
  googleLogin,
  githubLogin,
} from "../services/firebaseAuth";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "right",
      y: "top",
    },
    dismissible: true,
  });

  const navigate = useNavigate();

  const isDisabled = loading || !email || !password || !confirmPassword;

  const handleRegister = async (e) => {
    setLoading(true);

    e.preventDefault();

    if (password !== confirmPassword) {
      notyf.error("Passwords do not match");
      return;
    }

    await register(email, password);

    const user = await getCurrentUser();
    if (!user) {
      return;
    }

    navigate("/");
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    await googleLogin();

    setLoading(false);

    navigate("/");
  };

  const handleGithubLogin = async () => {
    setLoading(true);

    await githubLogin();

    setLoading(false);

    navigate("/");
  };

  return (
    <>
      <div className="min-h-[92vh] grid place-items-center">
        <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold text-center text-gray-700">
            Register a new account
          </h2>
          <div className="grid grid-cols-3 gap-4 my-4">
            <button
              className="flex items-center justify-center space-x-2 h-12 border border-black rounded-md hover:bg-gray-50 transition-colors"
              onClick={handleGoogleLogin}
            >
              <img src="/src/assets/google.svg" alt="" />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-[#F3F2F1] h-12 rounded-md hover:bg-gray-200 transition-colors">
              <img src="/src/assets/microsoft.svg" alt="" />
              <span>Microsoft</span>
            </button>
            <button
              className="flex items-center justify-center space-x-2 h-12 bg-black text-white rounded-md hover:bg-slate-900 transition-colors"
              onClick={handleGithubLogin}
            >
              <i className="fa-brands fa-github"></i>
              <span>Github</span>
            </button>
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
          <form className="space-y-6">
            <div>
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                id="email"
                required
                type="email"
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
              <input
                className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                id="password"
                required
                type="password"
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
              <input
                className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                id="confirm_password"
                required
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              className="w-full p-2 mt-1 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
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
              className="ml-1 text-sm font-medium text-indigo-600 hover:underline"
              to="/login"
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
