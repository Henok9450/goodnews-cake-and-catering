import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where,
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

const TEST_ORDER_IDS = ['order-gn-1001', 'order-gn-1002', 'order-gn-1003', 'order-gn-1004', 'order-gn-1005'];
const TEST_ORDER_NUMBERS = ['GN-202611-1001', 'GN-202611-1002', 'GN-202611-1003', 'GN-202611-1004', 'GN-202611-1005'];

/**
 * Fetch ALL real customer orders directly from Firebase Firestore.
 * Automatically handles unindexed collections and filters out any mock/seed test artifacts.
 */
export const getOrders = async () => {
    try {
        let snapshot;
        
        // 1. Try ordered query
        try {
            const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
            snapshot = await getDocs(q);
        } catch (orderErr) {
            console.warn('Orders orderBy fetch notice, using collection fetch:', orderErr.message);
            snapshot = await getDocs(collection(db, COLLECTION));
        }

        // 2. If ordered query returned 0 documents, fetch collection directly
        // (in Firestore, orderBy('createdAt') omits documents where createdAt is missing or stored as a string!)
        if (!snapshot || snapshot.empty) {
            try {
                const directSnap = await getDocs(collection(db, COLLECTION));
                if (directSnap && !directSnap.empty) {
                    snapshot = directSnap;
                }
            } catch (directErr) {
                console.warn('Direct collection fetch notice:', directErr.message);
            }
        }

        if (!snapshot || snapshot.empty) {
            return [];
        }

        // 3. Map all documents
        const allDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        // 4. Clean up any lingering test orders in background and strictly exclude them
        const realOrders = allDocs.filter(o => {
            const isTest = TEST_ORDER_IDS.includes(o.id) || 
                           TEST_ORDER_NUMBERS.includes(o.orderNumber) || 
                           (o.id && o.id.startsWith('order-gn-100'));
            if (isTest) {
                // Delete test order artifact from Firestore in background
                deleteDoc(doc(db, COLLECTION, o.id)).catch(() => {});
                return false;
            }
            return true;
        });

        // 5. Sort real orders by timestamp or date descending
        realOrders.sort((a, b) => {
            const dateA = a.createdAt?.toMillis?.() || 
                          (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : null) || 
                          (a.createdAt ? new Date(a.createdAt).getTime() : 0) || 
                          (a.eventDate ? new Date(a.eventDate).getTime() : 0) || 
                          (a.orderDate ? new Date(a.orderDate).getTime() : 0) || 0;
            const dateB = b.createdAt?.toMillis?.() || 
                          (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : null) || 
                          (b.createdAt ? new Date(b.createdAt).getTime() : 0) || 
                          (b.eventDate ? new Date(b.eventDate).getTime() : 0) || 
                          (b.orderDate ? new Date(b.orderDate).getTime() : 0) || 0;
            return dateB - dateA;
        });

        return realOrders;
    } catch (error) {
        console.error('Error fetching live orders from Firebase Firestore:', error.message);
        throw error;
    }
};

export const getOrderById = async (id) => {
    try {
        const docRef = doc(db, COLLECTION, id);
        const snap = await getDoc(docRef);
        if (snap.exists()) return { id: snap.id, ...snap.data() };
    } catch (e) {}

    // Fallback search by orderNumber
    try {
        const q = query(collection(db, COLLECTION), where('orderNumber', '==', id));
        const numSnap = await getDocs(q);
        if (!numSnap.empty) {
            const first = numSnap.docs[0];
            return { id: first.id, ...first.data() };
        }
    } catch (numErr) {}

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
        status: newStatus,
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

    await updateDoc(docRef, updatePayload);
    return true;
};

export const cancelOrder = async (orderId, cancelReason, cancelledBy = 'Admin') => {
    return updateOrderStatus(orderId, 'Cancelled', `Cancellation Reason: ${cancelReason}`, cancelledBy);
};

export const deleteOrder = async (orderId) => {
    await deleteDoc(doc(db, COLLECTION, orderId));
    return true;
};
