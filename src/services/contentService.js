import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION = 'website_content';

export const getContentSection = async (sectionName) => {
    try {
        const docRef = doc(db, COLLECTION, sectionName);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            return snap.data();
        }
        return null;
    } catch (error) {
        console.error(`Error fetching CMS section [${sectionName}]:`, error);
        return null;
    }
};

export const updateContentSection = async (sectionName, data) => {
    try {
        const docRef = doc(db, COLLECTION, sectionName);
        await setDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        }, { merge: true });
        return true;
    } catch (error) {
        console.error(`Error saving CMS section [${sectionName}]:`, error);
        throw error;
    }
};
