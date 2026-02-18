import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  AuthErrorCodes,
  type AuthError,
  type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export type SignUpInput = {
  email: string;
  password: string;
  displayName?: string;
  mobile?: string;
};

export type SignInInput = {
  email: string;
  password: string;
};

export function mapAuthError(err: unknown): string {
  const code = (err as AuthError)?.code;
  switch (code) {
    case AuthErrorCodes.EMAIL_EXISTS:
      return "Email is already registered.";
    case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
    case AuthErrorCodes.INVALID_PASSWORD:
    case AuthErrorCodes.INVALID_EMAIL:
      return "Invalid email or password.";
    case AuthErrorCodes.USER_DELETED:
      return "No account found for this email.";
    case AuthErrorCodes.WEAK_PASSWORD:
      return "Password is too weak.";
    case AuthErrorCodes.NETWORK_REQUEST_FAILED:
      return "Network error. Please try again.";
    case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
      return "Too many attempts. Please try again later.";
    default:
      return (err as Error)?.message ?? "Something went wrong.";
  }
}

export async function createUser(input: SignUpInput): Promise<User> {
  const { email, password, displayName, mobile } = input;

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // Update profile with display name if provided
  if (displayName || mobile) {
    await updateProfile(userCredential.user, { displayName });
  }

  return userCredential.user;
}

export async function loginUser(input: SignInInput): Promise<User> {
  const { email, password } = input;
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}
