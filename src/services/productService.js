import { INITIAL_PRODUCTS } from '../utils/seedData';
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

const COLLECTION = 'products';

/**
 * Fetch products with optional category, status, and search filters
 */
export const getProducts = async (filters = {}) => {
    try {
        const { category, status = 'all', featuredOnly = false, search = '' } = filters;
        
        let snapshot;
        try {
            const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
            snapshot = await getDocs(q);
        } catch (idxErr) {
            snapshot = await getDocs(collection(db, COLLECTION));
        }
        let products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        if (category && category !== 'all') {
            products = products.filter(p => p.category === category);
        }

        if (status && status !== 'all') {
            products = products.filter(p => p.status === status);
        }

        if (featuredOnly) {
            products = products.filter(p => p.isFeatured === true);
        }

        if (search && search.trim() !== '') {
            const term = search.toLowerCase().trim();
            products = products.filter(p => 
                (p.name && p.name.toLowerCase().includes(term)) ||
                (p.description && p.description.toLowerCase().includes(term)) ||
                (p.category && p.category.toLowerCase().includes(term))
            );
        }

        return products;
    } catch (error) {
        console.warn('Firestore products fetch notice (using catalog fallback):', error.message);
        let products = INITIAL_PRODUCTS.map((p, idx) => ({ id: p.id || `init-${idx}`, ...p }));
        const { category, status = 'all', featuredOnly = false, search = '' } = filters;
        if (category && category !== 'all') products = products.filter(p => p.category === category);
        if (status && status !== 'all') products = products.filter(p => p.status === status);
        if (featuredOnly) products = products.filter(p => p.isFeatured === true);
        if (search && search.trim() !== '') {
            const term = search.toLowerCase().trim();
            products = products.filter(p => 
                (p.name && p.name.toLowerCase().includes(term)) ||
                (p.description && p.description.toLowerCase().includes(term))
            );
        }
        return products;
    }
};

export const getProductById = async (id) => {
    const docRef = doc(db, COLLECTION, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error('Product not found');
    return { id: snap.id, ...snap.data() };
};

export const createProduct = async (data) => {
    const cleanData = {
        name: data.name?.trim() || 'Untitled Product',
        slug: (data.slug || data.name || 'product').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
        description: data.description || '',
        category: data.category || 'cakes',
        price: data.price !== undefined && data.price !== '' ? Number(data.price) : null,
        discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
        featuredImage: data.featuredImage || (data.images && data.images[0]) || '/images/cakes/cake1.png',
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.featuredImage || '/images/cakes/cake1.png'],
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : (data.ingredients ? data.ingredients.split(',').map(s => s.trim()) : []),
        sizes: Array.isArray(data.sizes) ? data.sizes : (data.sizes ? data.sizes.split(',').map(s => s.trim()) : []),
        flavors: Array.isArray(data.flavors) ? data.flavors : (data.flavors ? data.flavors.split(',').map(s => s.trim()) : []),
        servings: data.servings || '',
        size: data.size || '',
        prepTime: data.prepTime || '24-48 hours',
        isCustomizable: data.isCustomizable !== undefined ? data.isCustomizable : true,
        isMadeToOrder: data.isMadeToOrder !== undefined ? data.isMadeToOrder : true,
        stockQuantity: data.stockQuantity !== undefined ? Number(data.stockQuantity) : 0,
        isFeatured: data.isFeatured || false,
        status: data.status || 'published', // 'published', 'draft', 'archived'
        seoTitle: data.seoTitle || data.name || '',
        seoDescription: data.seoDescription || data.description || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    const ref = await addDoc(collection(db, COLLECTION), cleanData);
    return { id: ref.id, ...cleanData };
};

export const updateProduct = async (id, data) => {
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

export const deleteProduct = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
};

export const updateProductStock = async (id, newStock, availabilityStatus = 'in-stock') => {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
        stockQuantity: Number(newStock),
        availabilityStatus,
        updatedAt: serverTimestamp()
    });
};
