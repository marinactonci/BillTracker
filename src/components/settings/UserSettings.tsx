import React from "react";

function UserSettings({ user }) {
  let provider = "";
  if (Array.isArray(user.providerData) && user.providerData.length > 0) {
    provider = user.providerData[0].providerId;
  }

  return (
    <>
      <h1 className="text-2xl font-medium">User Settings</h1>
      <div className="flex flex-col gap-3 mt-5">
        <div className="flex flex-row items-center gap-2">
          <i className="fa-solid fa-user text-zinc-500"></i>
          <p className="text-lg">{user.displayName}</p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <i className="fa-solid fa-envelope text-zinc-500"></i>
          <p className="text-lg">{user.email}</p>
        </div>
        {provider === "password" && (
          <>
            <div>
              <button className="btn">Change Password</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default UserSettings;
