"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Input } from "antd";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  GithubFilled,
} from "@ant-design/icons";
import {
  signInWithGithub,
  signInWithPassword,
  signInWithGoogle,
} from "@/utils/authUtils";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          router.push("/calendar");
        }
      } catch (error) {
        console.error("Error initializing:", error);
      }
    };

    initialize();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPassword(email, password);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
    setLoading(false);
  };

  const handleGithubLogin = async () => {
    setGithubLoading(true);
    setError("");
    try {
      await signInWithGithub();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
    setGithubLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
    setGoogleLoading(false);
  };

  const isDisabled = loading || !email || !password;

  return (
    <>
      <div className="min-h-[84vh] px-4 sm:px-0 grid place-items-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-xl">
          <h2 className="text-2xl font-semibold text-center text-gray-700">
            Log in to your account
          </h2>
          <div className="grid grid-cols-2 gap-4 my-4">
            <button
              className="flex items-center justify-center space-x-2 h-12 border border-black rounded-md hover:bg-gray-50 transition-colors"
              onClick={handleGoogleLogin}
            >
              {googleLoading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <>
                  <img src="/google.svg" alt="" />
                  <span>Google</span>
                </>
              )}
            </button>
            <button
              className="flex items-center justify-center space-x-2 h-12 bg-black text-white rounded-md hover:bg-slate-900 transition-colors"
              onClick={handleGithubLogin}
            >
              {githubLoading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <>
                  <GithubFilled />
                  <span>Github</span>
                </>
              )}
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
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button
              type="primary"
              variant="solid"
              className="w-full"
              onClick={handleLogin}
              disabled={isDisabled}
            >
              Log In
            </Button>
          </form>
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              className="ml-1 text-sm font-medium text-blue-600 hover:text-blue-300 transition-colors hover:underline"
              href="/register"
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
