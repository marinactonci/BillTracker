import React from "react";
import Profile from "./Profile";
import CreateProfile from "./CreateProfile";

function ProfileItems({
  onCreate,
  onSave,
  onSaveEdit,
  onDelete,
  profiles,
}: any) {
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
      <div className="grid grid-cols-5 gap-4">
        {profiles &&
          profiles.map((profile: any) => {
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

export default ProfileItems;
