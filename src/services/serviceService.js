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

const COLLECTION = 'services';

export const getServices = async (includeDrafts = false) => {
    try {
        const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const services = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        if (!includeDrafts) {
            return services.filter(s => s.status === 'published');
        }
        return services;
    } catch (error) {
        console.error('Error fetching services:', error);
        throw error;
    }
};

export const getServiceById = async (id) => {
    const docRef = doc(db, COLLECTION, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error('Service not found');
    return { id: snap.id, ...snap.data() };
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
    const ref = await addDoc(collection(db, COLLECTION), cleanData);
    return { id: ref.id, ...cleanData };
};

export const updateService = async (id, data) => {
    const docRef = doc(db, COLLECTION, id);
    const updateData = {
        ...data,
        updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, updateData);
    return { id, ...updateData };
};

export const deleteService = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
};
