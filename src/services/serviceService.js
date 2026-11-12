import { INITIAL_SERVICES } from '../utils/seedData';
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

const COLLECTION = 'services';

export const getServices = async (includeDrafts = false) => {
    try {
        let snapshot;
        try {
            const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
            snapshot = await getDocs(q);
        } catch (idxErr) {
            snapshot = await getDocs(collection(db, COLLECTION));
        }
        let services = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        // Seamless catalog fallback if Firestore collection is empty
        if (services.length === 0) {
            services = INITIAL_SERVICES.map((s, idx) => ({ id: s.slug || `init-serv-${idx + 1}`, ...s }));
        }

        if (!includeDrafts) {
            return services.filter(s => s.status === 'published');
        }
        return services;
    } catch (error) {
        console.warn('Firestore services fetch notice (using catalog fallback):', error.message);
        let services = INITIAL_SERVICES.map((s, idx) => ({ id: s.slug || `init-serv-${idx + 1}`, ...s }));
        if (!includeDrafts) {
            return services.filter(s => s.status === 'published');
        }
        return services;
    }
};

export const getServiceById = async (id) => {
    try {
        const docRef = doc(db, COLLECTION, id);
        const snap = await getDoc(docRef);
        if (snap.exists()) return { id: snap.id, ...snap.data() };
    } catch (e) {}
    const fallback = INITIAL_SERVICES.find((s, idx) => s.slug === id || s.id === id || `init-serv-${idx + 1}` === id);
    if (fallback) return { id: fallback.slug || id, ...fallback };
    throw new Error('Service not found');
};

export const createService = async (data) => {
    const cleanData = {
        title: data.title?.trim() || 'Untitled Service',
        slug: (data.slug || data.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
        description: data.description || '',
        category: data.category || 'Catering',
        coverImage: data.coverImage || (data.images && data.images[0]) || '/images/catering/catering1.png',
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.coverImage || '/images/catering/catering1.png'],
        pricingType: data.pricingType || 'quote', // 'fixed' or 'quote'
        startingPrice: data.startingPrice ? Number(data.startingPrice) : null,
        serves: data.serves || '',
        features: Array.isArray(data.features) ? data.features : (data.features ? data.features.split('\n').filter(Boolean) : []),
        isFeatured: data.isFeatured || false,
        status: data.status || 'published',
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

export const updateService = async (id, data) => {
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
    return { id, ...updateData };
};

export const deleteService = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
};
