import { INITIAL_CATEGORIES } from '../utils/seedData';
import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
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
        const q = query(collection(db, COLLECTION), orderBy('displayOrder', 'asc'));
        const snapshot = await getDocs(q);
        const categories = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        if (!includeInactive) {
            return categories.filter(c => c.isActive !== false);
        }
        return categories;
    } catch (error) {
        console.warn('Firestore categories fetch notice (using catalog fallback):', error.message);
        return INITIAL_CATEGORIES.map((c, idx) => ({ id: c.id || `init-cat-${idx}`, ...c }));
    }
};

export const getCategoryById = async (id) => {
    const docRef = doc(db, COLLECTION, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error('Category not found');
    return { id: snap.id, ...snap.data() };
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
    const ref = await addDoc(collection(db, COLLECTION), cleanData);
    return { id: ref.id, ...cleanData };
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
    await updateDoc(docRef, updateData);
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
