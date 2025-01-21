"use client";

import React, { useEffect, useState } from "react";
import { Suspense } from 'react';

function ConfirmSignupContent() {
  const [message, setMessage] = useState("Confirming your signup...");

  useEffect(() => {
    const handleConfirmation = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const confirmation_url = searchParams.get("confirmation_url");

      if (confirmation_url) {
        window.location.href = confirmation_url;
      } else {
        setMessage("Invalid confirmation URL. Please check your email for the correct link.");
      }
    };

    handleConfirmation();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Email Confirmation</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default function ConfirmSignup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmSignupContent />
    </Suspense>
  );
}