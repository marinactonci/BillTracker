import {
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  updateProfile,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  updatePassword,
  EmailAuthProvider,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { app } from "./firebaseConfig";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { FirebaseError } from "firebase/app";

const notyf = new Notyf({
  duration: 4000,
  position: {
    x: "right",
    y: "top",
  },
  dismissible: true,
});

export const auth = getAuth(app);

export async function register(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    if (user.displayName === null) {
      await updateProfile(user, { displayName: email.split("@")[0] });
    }
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      notyf.error("Email already in use!");
    } else if (error.code === "auth/invalid-email") {
      notyf.error("Invalid email!");
    } else if (error.code === "auth/weak-password") {
      notyf.error("Password too weak!");
    } else {
      notyf.error(error.message);
    }
  }
}

export async function login(
  email: string,
  password: string,
  remember: boolean
) {
  const currentUser = getCurrentUser();

  if (currentUser !== null) {
    notyf.error("You are already logged in!");
    return;
  }

  try {
    if (remember) {
      await setPersistence(auth, browserLocalPersistence);
    } else {
      await setPersistence(auth, browserSessionPersistence);
    }
    await signInWithEmailAndPassword(auth, email, password);
  } catch {
    notyf.error("Wrong email or password");
  }
}

export async function googleLogin() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    notyf.error(error.message);
  }
}

export async function githubLogin() {
  const provider = new OAuthProvider("github.com");
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    notyf.error(error.message);
  }
}

export async function logout() {
  const currentUser = getCurrentUser();
  if (currentUser === null) {
    notyf.error("You are not logged in!");
    return;
  }
  await signOut(auth);
}

export function getCurrentUser() {
  return auth.currentUser;
}

export async function changeDisplayName(user: any, displayName: string) {
  try {
    await updateProfile(user, { displayName });
    notyf.success("Display name changed successfully!");
    return { success: true, displayName: displayName };
  } catch (error) {
    console.log(error);
    notyf.error("Something went wrong!");
    return { success: false };
  }
}

export async function verifyEmail(user: any) {
  try {
    await sendEmailVerification(user);
    notyf.success("Email verification sent!");
  } catch (error) {
    notyf.error("Something went wrong!");
  }
}

export async function changePassword(
  user: any,
  oldpassword: string,
  newpassword: string
) {
  try {
    const credential = EmailAuthProvider.credential(user.email, oldpassword);
    await reauthenticateWithCredential(user, credential);
    updatePassword(user, newpassword);
    notyf.success("Password changed successfully!");
  } catch (error) {
    console.log(error);
    notyf.error("Wrong password!");
  }
}

export async function enable2FA(user: any) {
  try {
    await verifyBeforeUpdateEmail(user, user.email);
    await enable2FA(user);
    notyf.success("2FA enabled successfully!");
  } catch (error) {
    console.log(error);
    notyf.error("Something went wrong!");
  }
}

export async function forgotPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    if (error.code === "auth/invalid-email") notyf.error("Invalid email!");
    else notyf.error("Something went wrong!");
  }
}

export function logOutEverywhere(user: any) {
  try {
    user.multiFactor.getSession().then((session: any) => {
      session.signOut();
    });
  } catch (error) {
    notyf.error(error.message);
  }
}

export function deleteAccount(user: any) {
  try {
    user.delete();
  } catch (error) {
    notyf.error(error.message);
  }
}
