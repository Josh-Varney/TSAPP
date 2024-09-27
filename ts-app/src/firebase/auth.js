import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    updatePassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { auth } from "./firebase.js"; // Ensure the correct path to your firebase.js file

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error; // Re-throw error for handling at the call site
    }
};

export const doSignInWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error during sign-in:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        throw error; // Re-throw error for handling at the call site
    }
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user; // Return the signed-in user
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error; // Re-throw error for handling at the call site
    }
};

export const doSignOut = async () => {
    try {
        await signOut(auth);
        console.log("User signed out successfully.");
    } catch (error) {
        console.error("Error signing out:", error);
        throw error; // Re-throw error for handling at the call site
    }
};

export const doPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent.");
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error; // Re-throw error for handling at the call site
    }
};

export const doPasswordChange = async (password) => {
    try {
        await updatePassword(auth.currentUser, password);
        console.log("Password updated successfully.");
    } catch (error) {
        console.error("Error updating password:", error);
        throw error; // Re-throw error for handling at the call site
    }
};

export const doSendEmailVerification = async () => {
    try {
        await sendEmailVerification(auth.currentUser, {
            url: `${window.location.origin}/`, // URL to redirect to after verification
        });
        console.log("Verification email sent.");
    } catch (error) {
        console.error("Error sending email verification:", error);
        throw error; // Re-throw error for handling at the call site
    }
};
