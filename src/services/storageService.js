import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Validate image file type and size
 * @param {File} file 
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateImageFile = (file) => {
    if (!file) {
        return { valid: false, error: 'No file selected.' };
    }
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
        return { valid: false, error: `Invalid file type (${file.type}). Supported formats: JPG, JPEG, PNG, WebP.` };
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return { valid: false, error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed size is ${MAX_FILE_SIZE_MB}MB.` };
    }
    return { valid: true };
};

/**
 * Upload an image file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} folder - Destination folder (e.g., 'products', 'categories', 'services', 'gallery')
 * @param {Function} [onProgress] - Optional progress callback: (percent: number) => void
 * @returns {Promise<string>} Resolves with public download URL
 */
export const uploadImage = (file, folder = 'products', onProgress = null) => {
    return new Promise((resolve, reject) => {
        const validation = validateImageFile(file);
        if (!validation.valid) {
            return reject(new Error(validation.error));
        }

        // Clean filename and create unique storage path
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniquePath = `${folder}/${Date.now()}_${sanitizedName}`;
        const storageRef = ref(storage, uniquePath);

        const uploadTask = uploadBytesResumable(storageRef, file, {
            contentType: file.type
        });

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress && typeof onProgress === 'function') {
                    onProgress(Math.round(progress));
                }
            },
            (error) => {
                console.error('❌ Upload failed:', error);
                reject(new Error(`Failed to upload image: ${error.message}`));
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (err) {
                    reject(new Error(`Failed to retrieve download URL: ${err.message}`));
                }
            }
        );
    });
};

/**
 * Delete an image from Firebase Storage by URL or full path
 * @param {string} imageUrl 
 */
export const deleteImage = async (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('firebasestorage')) {
        return; // Don't try to delete local assets like /images/cakes/...
    }
    try {
        const fileRef = ref(storage, imageUrl);
        await deleteObject(fileRef);
    } catch (error) {
        console.warn('⚠️ Could not delete old image from storage:', error.message);
    }
};
