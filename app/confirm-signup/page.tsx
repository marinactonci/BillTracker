"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ConfirmSignup() {
  const [message, setMessage] = useState("Redirecting to confirm your signup...");
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleConfirmation = () => {
      const fullSearchParams = searchParams.toString();
      const confirmationUrlMatch = fullSearchParams.match(/confirmation_url=([^&]+)/);
      const confirmation_url = confirmationUrlMatch ? decodeURIComponent(confirmationUrlMatch[1]) : null;

      if (confirmation_url) {
        window.location.href = confirmation_url;
      } else {
        setMessage("Invalid confirmation URL. Please check your email for the correct link.");
      }
    };

    handleConfirmation();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Email Confirmation</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}