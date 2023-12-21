import { app } from "./firebaseConfig";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

const db = getFirestore(app);

export async function getProfiles(userId: string) {
  const docRef = doc(db, "bills", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().profiles;
  } else {
    return [];
  }
}

export async function addProfile(userId: string, profile: object) {
  const docRef = doc(db, "bills", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, {
      profiles: arrayUnion(profile),
    });
  } else {
    await setDoc(docRef, {
      profiles: [profile],
    });
  }
}

export async function updateProfile(userId: string, profile: any) {
  const docRef = doc(db, "bills", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const currentProfiles = docSnap.data().profiles;
    const oldProfile = currentProfiles.find((p: any) => p.id === profile.id);

    if (oldProfile) {
      await updateDoc(docRef, {
        profiles: arrayUnion(profile),
      });
      await updateDoc(docRef, {
        profiles: arrayRemove(oldProfile),
      });
    } else {
      console.log(`Profile with id ${profile.id} not found.`);
    }
  } else {
    console.log(`User with id ${userId} not found.`);
  }
}

export async function deleteProfile(userId: string, profileId: any) {
  const docRef = doc(db, "bills", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const currentProfiles = docSnap.data().profiles;
    const oldProfile = currentProfiles.find((p: any) => p.id === profileId);

    if (oldProfile) {
      await updateDoc(docRef, {
        profiles: arrayRemove(oldProfile),
      });
    } else {
      console.log(`Profile with id ${profileId} not found.`);
    }
  } else {
    console.log(`User with id ${userId} not found.`);
  }
}

export async function addBill(userId: string, profileId: string, bill: object) {
  const docRef = doc(db, "bills", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const currentProfiles = docSnap.data().profiles;
    const profile = currentProfiles.find((p: any) => p.id === profileId);

    if (profile) {
      await updateDoc(docRef, {
        profiles: arrayRemove(profile),
      });
      await updateDoc(docRef, {
        profiles: arrayUnion({
          ...profile,
          bills: arrayUnion(bill),
        }),
      });
    } else {
      console.log(`Profile with id ${profileId} not found.`);
    }
  } else {
    console.log(`User with id ${userId} not found.`);
  }
}

export async function deleteBill(
  userId: string,
  profileId: string,
  billId: string
) {
  const docRef = doc(db, "bills", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const currentProfiles = docSnap.data().profiles;
    const profileIndex = currentProfiles.findIndex(
      (p: any) => p.id === profileId
    );

    if (profileIndex !== -1) {
      const currentBills = currentProfiles[profileIndex].bills;
      const billIndex = currentBills.findIndex((b: any) => b.id === billId);

      if (billIndex !== -1) {
        currentProfiles[profileIndex].bills.splice(billIndex, 1);

        await updateDoc(docRef, { profiles: currentProfiles });
      } else {
        console.log(`Bill with id ${billId} not found.`);
      }
    } else {
      console.log(`Profile with id ${profileId} not found.`);
    }
  } else {
    console.log(`User with id ${userId} not found.`);
  }
}

export async function updateBill(userId: string, profileId: string, bill: any) {
  const docRef = doc(db, "bills", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const currentProfiles = docSnap.data().profiles;
    const profile = currentProfiles.find((p: any) => p.id === profileId);

    if (profile) {
      const currentBills = profile.bills;
      const billIndex = currentBills.findIndex((b: any) => b.id === bill.id);

      if (billIndex !== -1) {
        currentProfiles[profileId].bills[billIndex] = bill;

        await updateDoc(docRef, { profiles: currentProfiles });
      } else {
        console.log(`Bill with id ${bill.id} not found.`);
      }
    } else {
      console.log(`Profile with id ${profileId} not found.`);
    }
  } else {
    console.log(`User with id ${userId} not found.`);
  }
}
