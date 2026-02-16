import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage.
 * @param file The file to upload.
 * @param path The storage path (e.g., 'users/123/reports/report.pdf').
 * @returns The download URL of the uploaded file.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
        const storageRef = ref(storage, path);
        const result = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(result.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

/**
 * Helper to upload a report attachment.
 * @param file The file object.
 * @param userId The user/patient ID.
 * @returns The download URL.
 */
export const uploadReportAttachment = async (file: File, userId: string): Promise<string> => {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const path = `users/${userId}/reports/${timestamp}_${safeName}`;
    return uploadFile(file, path);
};

/**
 * Helper to upload a chat attachment.
 * @param file The file object.
 * @param userId The user/patient ID.
 * @returns The download URL.
 */
export const uploadChatAttachment = async (file: File, userId: string): Promise<string> => {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const path = `users/${userId}/chat_uploads/${timestamp}_${safeName}`;
    return uploadFile(file, path);
};

/**
 * Deletes a file from Firebase Storage using its download URL.
 * @param downloadUrl The download URL of the file to delete.
 */
export const deleteFileFromUrl = async (downloadUrl: string): Promise<void> => {
    try {
        const storageRef = ref(storage, downloadUrl);
        await deleteObject(storageRef);
    } catch (error) {
        console.error("Error deleting file from storage:", error);
        throw error;
    }
};
