import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase.config";

export const saveUserToFirestore = async (user: any) => {
    if (!user?.uid) return;

    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            fullName: user.displayName || '',
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString(),
        });
    }
};
