import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  login,
  googleLogin,
  getCurrentUser,
  githubLogin,
} from "../services/firebaseAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    setLoading(true);

    e.preventDefault();

    await login(email, password, remember);

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

  const isDisabled = loading || !email || !password;

  return (
    <>
      <div className="min-h-[92vh] grid place-items-center">
        <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-xl">
          <h2 className="text-2xl font-semibold text-center text-gray-700">
            Log in to your account
          </h2>
          <div className="grid grid-cols-2 gap-4 my-4">
            <button
              className="flex items-center justify-center space-x-2 h-12 border border-black rounded-md hover:bg-gray-50 transition-colors"
              onClick={handleGoogleLogin}
            >
              <img src="/google.svg" alt="" />
              <span>Google</span>
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
                Or continue with your email
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
            <div className="flex items-center justify-between">
              <div>
                <input
                  className="text-indigo-600 border-transparent rounded focus:ring-indigo-200 focus:border-indigo-500"
                  id="remember"
                  type="checkbox"
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label
                  className="ml-2 text-sm text-gray-600"
                  htmlFor="remember"
                >
                  Remember Me
                </label>
              </div>
              <div>
                <a
                  className="text-sm font-medium text-gray-600 hover:underline"
                  href="#"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <button
              className="w-full p-2 mt-1 bg-black border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
              type="submit"
              onClick={handleLogin}
              disabled={isDisabled}
            >
              Log In
            </button>
          </form>
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
            </span>
            <Link
              className="ml-1 text-sm font-medium text-gray-600 hover:underline"
              to="/register"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
