import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy, 
    serverTimestamp, 
    arrayUnion 
} from 'firebase/firestore';
import { db } from '../config/firebase';

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
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.warn('Orders fetch notice:', error.message);
        return [];
    }
};

export const getOrderById = async (id) => {
    const docRef = doc(db, COLLECTION, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error('Order not found');
    return { id: snap.id, ...snap.data() };
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

    await updateDoc(docRef, updatePayload);
    return true;
};

export const updatePaymentStatus = async (orderId, paymentStatus, paymentReference = '', changedBy = 'Admin') => {
    const docRef = doc(db, COLLECTION, orderId);
    await updateDoc(docRef, {
        paymentStatus,
        paymentReference: paymentReference || null,
        updatedAt: serverTimestamp(),
        statusHistory: arrayUnion({
            status: `Payment: ${paymentStatus}`,
            timestamp: new Date().toISOString(),
            note: paymentReference ? `Reference: ${paymentReference}` : `Payment marked as ${paymentStatus}`,
            changedBy
        })
    });
    return true;
};

export const cancelOrder = async (orderId, cancelReason, cancelledBy = 'Admin') => {
    return updateOrderStatus(orderId, 'Cancelled', `Cancellation Reason: ${cancelReason}`, cancelledBy);
};

export const deleteOrder = async (orderId) => {
    await deleteDoc(doc(db, COLLECTION, orderId));
    return true;
};
