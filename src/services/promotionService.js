import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    setDoc,
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy, 
    serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION = 'promotions';

export const INITIAL_PROMOTIONS = [
    {
        id: 'promo-welcome10',
        title: 'New Customer Welcome Privilege',
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        applicableCategory: 'all',
        isActive: true
    },
    {
        id: 'promo-wedding5',
        title: 'Grand Wedding Cake Privilege',
        code: 'WEDDING5',
        discountType: 'percentage',
        discountValue: 5,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        applicableCategory: 'cakes',
        isActive: true
    },
    {
        id: 'promo-sweetparty',
        title: 'Cupcake & Party Batch Bonus',
        code: 'SWEETPARTY',
        discountType: 'fixed',
        discountValue: 200,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        applicableCategory: 'cupcakes',
        isActive: true
    }
];

export const getPromotions = async () => {
    try {
        let snapshot;
        try {
            const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
            snapshot = await getDocs(q);
        } catch (e) {
            snapshot = await getDocs(collection(db, COLLECTION));
        }
        let promotions = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        if (promotions.length === 0) {
            promotions = INITIAL_PROMOTIONS;
        }
        return promotions;
    } catch (error) {
        console.warn('Promotions fetch notice (using catalog fallback):', error.message);
        return INITIAL_PROMOTIONS;
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
    const docId = cleanData.code || `promo-${Date.now()}`;
    const docRef = doc(db, COLLECTION, docId);
    try {
        await setDoc(docRef, cleanData, { merge: true });
        return { id: docId, ...cleanData };
    } catch (err) {
        const ref = await addDoc(collection(db, COLLECTION), cleanData);
        return { id: ref.id, ...cleanData };
    }
};

export const updatePromotion = async (id, data) => {
    const docRef = doc(db, COLLECTION, id);
    const updateData = {
        ...data,
        updatedAt: serverTimestamp()
    };
    try {
        await updateDoc(docRef, updateData);
    } catch (err) {
        await setDoc(docRef, {
            ...updateData,
            createdAt: serverTimestamp()
        }, { merge: true });
    }
    return true;
};

export const deletePromotion = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
};
