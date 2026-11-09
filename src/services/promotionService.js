import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy, 
    serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION = 'promotions';

export const getPromotions = async () => {
    try {
        const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error('Error fetching promotions:', error);
        throw error;
    }
};

export const createPromotion = async (data) => {
    const cleanData = {
        title: data.title?.trim() || 'Untitled Promotion',
        code: data.code?.trim().toUpperCase() || '',
        discountType: data.discountType || 'percentage', // 'percentage' or 'fixed'
        discountValue: Number(data.discountValue) || 0,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        applicableCategory: data.applicableCategory || 'all',
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
    const ref = await addDoc(collection(db, COLLECTION), cleanData);
    return { id: ref.id, ...cleanData };
};

export const updatePromotion = async (id, data) => {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
    });
    return true;
};

export const deletePromotion = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
};
