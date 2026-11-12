import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    setDoc,
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy, 
    serverTimestamp, 
    arrayUnion 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { INITIAL_ORDERS } from '../utils/seedData';

const COLLECTION = 'orders';

export const ORDER_STATUSES = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready for Pickup / Out for Delivery',
    'Delivered / Completed',
    'Cancelled'
];

export const PAYMENT_STATUSES = [
    'Pending',
    'Partially Paid',
    'Paid',
    'Refunded'
];

export const getOrders = async () => {
    try {
        let snapshot;
        try {
            const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
            snapshot = await getDocs(q);
        } catch (orderErr) {
            // Fallback without orderBy if index is missing
            snapshot = await getDocs(collection(db, COLLECTION));
        }
        let orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        // Seamless catalog fallback if Firestore orders collection is empty
        if (orders.length === 0) {
            orders = INITIAL_ORDERS;
        }

        return orders;
    } catch (error) {
        console.warn('Orders fetch notice (using baseline fallback):', error.message);
        return INITIAL_ORDERS;
    }
};

export const getOrderById = async (id) => {
    try {
        const docRef = doc(db, COLLECTION, id);
        const snap = await getDoc(docRef);
        if (snap.exists()) return { id: snap.id, ...snap.data() };
    } catch (e) {
        // Fall back below
    }
    const fallback = INITIAL_ORDERS.find(o => o.id === id || o.orderNumber === id);
    if (fallback) return fallback;
    throw new Error('Order not found');
};

export const updateOrderStatus = async (orderId, newStatus, adminNote = '', changedBy = 'Admin') => {
    const docRef = doc(db, COLLECTION, orderId);
    const historyEntry = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: adminNote || `Status updated to ${newStatus}`,
        changedBy
    };

    const updatePayload = {
        orderStatus: newStatus,
        status: newStatus, // maintain compatibility with existing fields
        updatedAt: serverTimestamp(),
        statusHistory: arrayUnion(historyEntry)
    };

    if (adminNote) {
        updatePayload.adminNotes = adminNote;
    }

    try {
        await updateDoc(docRef, updatePayload);
    } catch (err) {
        // If order does not exist in Firestore yet (e.g., initial baseline), set it with payload
        const existing = INITIAL_ORDERS.find(o => o.id === orderId || o.orderNumber === orderId) || {};
        await setDoc(docRef, {
            ...existing,
            ...updatePayload,
            createdAt: serverTimestamp()
        }, { merge: true });
    }
    return true;
};

export const updatePaymentStatus = async (orderId, paymentStatus, paymentReference = '', changedBy = 'Admin') => {
    const docRef = doc(db, COLLECTION, orderId);
    const historyEntry = {
        status: `Payment: ${paymentStatus}`,
        timestamp: new Date().toISOString(),
        note: paymentReference ? `Reference: ${paymentReference}` : `Payment marked as ${paymentStatus}`,
        changedBy
    };

    const updatePayload = {
        paymentStatus,
        paymentReference: paymentReference || null,
        updatedAt: serverTimestamp(),
        statusHistory: arrayUnion(historyEntry)
    };

    try {
        await updateDoc(docRef, updatePayload);
    } catch (err) {
        const existing = INITIAL_ORDERS.find(o => o.id === orderId || o.orderNumber === orderId) || {};
        await setDoc(docRef, {
            ...existing,
            ...updatePayload,
            createdAt: serverTimestamp()
        }, { merge: true });
    }
    return true;
};

export const cancelOrder = async (orderId, cancelReason, cancelledBy = 'Admin') => {
    return updateOrderStatus(orderId, 'Cancelled', `Cancellation Reason: ${cancelReason}`, cancelledBy);
};

export const deleteOrder = async (orderId) => {
    try {
        await deleteDoc(doc(db, COLLECTION, orderId));
    } catch (e) {
        console.warn('Delete order notice:', e.message);
    }
    return true;
};
