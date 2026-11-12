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
 * Draws the elegant "GoodNews Cake and Catering" watermark onto a canvas
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 */
export const drawWatermarkOnCanvas = (canvas, ctx) => {
    try {
        const { width, height } = canvas;
        const baseDim = Math.min(width, height);

        // 1. Bottom-Right Corner Signature
        const cornerFontSize = Math.max(14, Math.min(24, Math.round(baseDim * 0.022)));
        const marginRight = Math.max(18, Math.min(36, Math.round(width * 0.035)));
        const marginBottom = Math.max(18, Math.min(36, Math.round(height * 0.035)));

        // Analyze corner brightness
        const cornerW = Math.min(300, Math.round(width * 0.35));
        const cornerH = Math.min(100, Math.round(height * 0.12));
        const cornerData = ctx.getImageData(width - cornerW, height - cornerH, cornerW, cornerH).data;
        let totalBrightness = 0;
        let count = 0;
        for (let i = 0; i < cornerData.length; i += 16) {
            totalBrightness += (cornerData[i] + cornerData[i + 1] + cornerData[i + 2]) / 3;
            count++;
        }
        const cornerAvg = count > 0 ? totalBrightness / count : 150;
        const isCornerLight = cornerAvg > 195;

        // 2. 360-Degree Anti-Crop Ribbon System (Center, Upper, and Lower)
        const centerFontSize = Math.max(16, Math.min(28, Math.round(baseDim * 0.026)));
        const centerX = Math.round(width / 2);
        const centerY = Math.round(height / 2);
        const upperY = Math.round(height * 0.28);
        const lowerY = Math.round(height * 0.72);

        // Analyze center brightness
        const sampleW = Math.min(400, Math.round(width * 0.50));
        const sampleH = Math.min(120, Math.round(height * 0.15));
        const centerLeft = Math.max(0, Math.round((width - sampleW) / 2));
        const centerTop = Math.max(0, Math.round((height - sampleH) / 2));
        const centerData = ctx.getImageData(centerLeft, centerTop, sampleW, sampleH).data;
        let centerTotal = 0;
        let centerCount = 0;
        for (let i = 0; i < centerData.length; i += 16) {
            centerTotal += (centerData[i] + centerData[i + 1] + centerData[i + 2]) / 3;
            centerCount++;
        }
        const centerAvg = centerCount > 0 ? centerTotal / centerCount : 150;
        const isCenterLight = centerAvg > 195;

        const ribbonFill = isCenterLight ? 'rgba(15, 23, 42, 0.18)' : 'rgba(255, 255, 255, 0.20)';
        const ribbonSubFill = isCenterLight ? 'rgba(15, 23, 42, 0.13)' : 'rgba(255, 255, 255, 0.15)';
        const ribbonShadow = isCenterLight ? 'rgba(255, 255, 255, 0.40)' : 'rgba(0, 0, 0, 0.30)';

        // Render Upper Diagonal Ribbon (Crop-proof against top crop)
        ctx.save();
        ctx.translate(centerX, upperY);
        ctx.rotate(-22 * Math.PI / 180);
        ctx.font = `600 ${Math.round(centerFontSize * 0.85)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowOffsetX = 0.5;
        ctx.shadowOffsetY = 0.8;
        ctx.shadowBlur = 2.0;
        ctx.shadowColor = ribbonShadow;
        ctx.fillStyle = ribbonSubFill;
        ctx.fillText('GOODNEWS CAKE AND CATERING', 0, 0);
        ctx.restore();

        // Render Center Core Diagonal Ribbon (Un-croppable from ANY edge!)
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(-22 * Math.PI / 180);
        ctx.font = `600 ${centerFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowOffsetX = 0.5;
        ctx.shadowOffsetY = 1.0;
        ctx.shadowBlur = 2.5;
        ctx.shadowColor = ribbonShadow;
        ctx.fillStyle = ribbonFill;
        ctx.fillText('GOODNEWS CAKE AND CATERING', 0, 0);
        ctx.restore();

        // Render Lower Diagonal Ribbon (Crop-proof against bottom crop)
        ctx.save();
        ctx.translate(centerX, lowerY);
        ctx.rotate(-22 * Math.PI / 180);
        ctx.font = `600 ${Math.round(centerFontSize * 0.85)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowOffsetX = 0.5;
        ctx.shadowOffsetY = 0.8;
        ctx.shadowBlur = 2.0;
        ctx.shadowColor = ribbonShadow;
        ctx.fillStyle = ribbonSubFill;
        ctx.fillText('GOODNEWS CAKE AND CATERING', 0, 0);
        ctx.restore();

        // Render Bottom-Right Corner Signature
        ctx.save();
        ctx.font = `600 ${cornerFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.shadowOffsetX = 0.5;
        ctx.shadowOffsetY = 1.0;
        ctx.shadowBlur = 2.0;
        ctx.shadowColor = isCornerLight ? 'rgba(255, 255, 255, 0.50)' : 'rgba(0, 0, 0, 0.38)';
        ctx.fillStyle = isCornerLight ? 'rgba(15, 23, 42, 0.28)' : 'rgba(255, 255, 255, 0.30)';
        ctx.fillText('GoodNews Cake and Catering', width - marginRight, height - marginBottom);
        ctx.restore();
    } catch {
        // Fallback silently if canvas context or security error
    }
};

/**
 * Pre-compress an image client-side before upload to preserve high clarity while slashing upload payload
 * Optionally applies the official GoodNews watermark for cake photographs.
 * @param {File} file 
 * @param {number} maxWidth 
 * @param {number} quality 
 * @param {boolean} shouldWatermark
 * @returns {Promise<File|Blob>}
 */
export const compressImageForUpload = async (file, maxWidth = 1600, quality = 0.88, shouldWatermark = false) => {
    if (typeof window === 'undefined' || typeof document === 'undefined' || typeof Image === 'undefined') {
        return file; // Node/Jest test environment fallback
    }
    return new Promise((resolve) => {
        try {
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(objectUrl);
                let { width, height } = img;
                if (width > maxWidth || height > maxWidth) {
                    if (width > height) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxWidth) / height);
                        height = maxWidth;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(file);

                ctx.drawImage(img, 0, 0, width, height);

                // Apply watermark if cake image upload
                if (shouldWatermark) {
                    drawWatermarkOnCanvas(canvas, ctx);
                }

                // Prefer WebP for high compression with alpha support, fallback to original type
                const outputType = 'image/webp';
                canvas.toBlob(
                    (blob) => {
                        if (!blob || blob.size >= file.size) {
                            return resolve(file); // Keep original if compression isn't smaller
                        }
                        const optimizedName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                        const optimizedFile = new File([blob], optimizedName, {
                            type: blob.type,
                            lastModified: Date.now()
                        });
                        resolve(optimizedFile);
                    },
                    outputType,
                    quality
                );
            };
            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                resolve(file);
            };
            img.src = objectUrl;
        } catch {
            resolve(file);
        }
    });
};

/**
 * Upload an image file to Firebase Storage
 * Automatically applies the elegant "GoodNews Cake and Catering" watermark to cake photographs.
 * @param {File} file - The file to upload
 * @param {string} folder - Destination folder (e.g., 'products', 'categories', 'services', 'gallery')
 * @param {Function} [onProgress] - Optional progress callback: (percent: number) => void
 * @param {object} [options] - Options e.g. { isCake: boolean }
 * @returns {Promise<string>} Resolves with public download URL
 */
export const uploadImage = async (file, folder = 'products', onProgress = null, options = {}) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    // Automatically watermark cake products and cake gallery items
    const shouldWatermark = (folder === 'products' || folder === 'gallery' || options.isCake === true);

    // Client-side pre-compression and watermarking
    const uploadReadyFile = await compressImageForUpload(file, 1600, 0.88, shouldWatermark);

    return new Promise((resolve, reject) => {
        // Clean filename and create unique storage path
        const sanitizedName = uploadReadyFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniquePath = `${folder}/${Date.now()}_${sanitizedName}`;
        const storageRef = ref(storage, uniquePath);

        const uploadTask = uploadBytesResumable(storageRef, uploadReadyFile, {
            contentType: uploadReadyFile.type
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
