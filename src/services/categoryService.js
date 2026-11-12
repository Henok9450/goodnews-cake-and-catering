import { INITIAL_CATEGORIES } from '../utils/seedData';
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
    where, 
    orderBy, 
    serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION = 'categories';

export const getCategories = async (includeInactive = false) => {
    try {
        let snapshot;
        try {
            const q = query(collection(db, COLLECTION), orderBy('displayOrder', 'asc'));
            snapshot = await getDocs(q);
        } catch (idxErr) {
            snapshot = await getDocs(collection(db, COLLECTION));
        }
        let categories = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        // Seamless catalog fallback if Firestore collection is empty
        if (categories.length === 0) {
            categories = INITIAL_CATEGORIES.map((c, idx) => ({ id: c.slug || `init-cat-${idx + 1}`, ...c }));
        }

        if (!includeInactive) {
            return categories.filter(c => c.isActive !== false);
        }
        return categories;
    } catch (error) {
        console.warn('Firestore categories fetch notice (using catalog fallback):', error.message);
        let categories = INITIAL_CATEGORIES.map((c, idx) => ({ id: c.slug || `init-cat-${idx + 1}`, ...c }));
        if (!includeInactive) {
            return categories.filter(c => c.isActive !== false);
        }
        return categories;
    }
};

export const getCategoryById = async (id) => {
    try {
        const docRef = doc(db, COLLECTION, id);
        const snap = await getDoc(docRef);
        if (snap.exists()) return { id: snap.id, ...snap.data() };
    } catch (e) {}
    const fallback = INITIAL_CATEGORIES.find((c, idx) => c.slug === id || c.id === id || `init-cat-${idx + 1}` === id);
    if (fallback) return { id: fallback.slug || id, ...fallback };
    throw new Error('Category not found');
};

export const createCategory = async (data) => {
    const cleanData = {
        name: data.name.trim(),
        slug: (data.slug || data.name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
        description: data.description || '',
        image: data.image || '',
        displayOrder: Number(data.displayOrder) || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
    const docId = cleanData.slug;
    const docRef = doc(db, COLLECTION, docId);
    try {
        await setDoc(docRef, cleanData, { merge: true });
        return { id: docId, ...cleanData };
    } catch (err) {
        const ref = await addDoc(collection(db, COLLECTION), cleanData);
        return { id: ref.id, ...cleanData };
    }
};

export const updateCategory = async (id, data) => {
    const docRef = doc(db, COLLECTION, id);
    const updateData = {
        ...data,
        updatedAt: serverTimestamp()
    };
    if (data.name && !data.slug) {
        updateData.slug = data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    }
    try {
        await updateDoc(docRef, updateData);
    } catch (err) {
        await setDoc(docRef, {
            ...updateData,
            createdAt: serverTimestamp()
        }, { merge: true });
    }
    return { id, ...updateData };
};

export const deleteCategory = async (id, categorySlug) => {
    // Check if any product is currently using this category
    const productsQuery = query(
        collection(db, 'products'),
        where('category', '==', categorySlug || id)
    );
    const productsSnap = await getDocs(productsQuery);
    if (!productsSnap.empty) {
        throw new Error(`Cannot delete category: ${productsSnap.size} product(s) are assigned to it. Reassign them first.`);
    }

    await deleteDoc(doc(db, COLLECTION, id));
    return true;
};
