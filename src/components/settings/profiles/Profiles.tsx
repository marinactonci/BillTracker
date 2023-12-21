import React from "react";
import Profile from "./Profile";
import CreateProfile from "./CreateProfile";

function Profiles({ onCreate, onSave, onSaveEdit, onDelete, profiles }: any) {
  const handleOnCreate = async () => {
    await onCreate();
  };

  const handleSave = async (newProfile) => {
    await onSave(newProfile);
  };

  const handleSaveEdit = async (newProfile) => {
    await onSaveEdit(newProfile);
  };

  const handleDelete = async (item, profileId, billId) => {
    await onDelete(item, profileId, billId ? billId : null);
  };

  return (
    <>
      <h1 className="text-2xl font-medium mb-6">
        Create a new profile or edit the existing ones
      </h1>
      <div className="grid grid-cols-5 gap-4">
        {profiles.map((profile: any) => {
          return (
            <Profile
              profile={profile}
              onSave={handleSave}
              onSaveEdit={handleSaveEdit}
              key={profile.id}
              onDelete={handleDelete}
            />
          );
        })}
        <CreateProfile onCreateProfile={handleOnCreate} />
      </div>
    </>
  );
}

export default Profiles;
