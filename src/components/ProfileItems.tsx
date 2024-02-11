import React from "react";
import CreateProfile from "./CreateProfile";
import Profile from "./Profile";

interface ProfileItemsProps {
  onCreate: () => void;
  onSave: (newProfile: any) => void;
  onSaveEdit: (newProfile: any) => void;
  onDelete: (item: string, profileId: number, billId: number) => void;
  profiles: any;
}

function ProfileItems({
  onCreate,
  onSave,
  onSaveEdit,
  onDelete,
  profiles,
}: ProfileItemsProps) {
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
