import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'menuItems';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'keps3rgh';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'menu_items';

export const getAllMenuItems = async () => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('category'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

export const uploadImage = async (file, folder = 'menu-items') => {
  if (!file) throw new Error('No file provided');
  if (file.size > 5 * 1024 * 1024) throw new Error('File size must be less than 5MB');
  if (!file.type.startsWith('image/')) throw new Error('File must be an image');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', `coffee-menu/${folder}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  const result = await response.json();

  if (!response.ok) throw new Error(result.error?.message || 'Cloudinary upload failed');
  return { url: result.secure_url, path: result.public_id };
};

// Cloudinary deletion requires a signed server-side request.
export const deleteImage = async (imagePath) => {
  if (imagePath) console.log('Cloudinary image retained:', imagePath);
};

export const addMenuItem = async (itemData, imageFile) => {
  const imageData = imageFile ? await uploadImage(imageFile) : null;
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...itemData,
    imageUrl: imageData?.url || null,
    imagePath: imageData?.path || null,
    createdAt: new Date().toISOString()
  });

  return { id: docRef.id, ...itemData, imageUrl: imageData?.url || null };
};

export const updateMenuItem = async (itemId, itemData, imageFile) => {
  const imageData = imageFile ? await uploadImage(imageFile) : null;
  const updateData = { ...itemData, updatedAt: new Date().toISOString() };

  if (imageData) {
    updateData.imageUrl = imageData.url;
    updateData.imagePath = imageData.path;
  }

  await updateDoc(doc(db, COLLECTION_NAME, itemId), updateData);
  return { id: itemId, ...updateData };
};

export const deleteMenuItem = async (itemId, imagePath) => {
  await deleteImage(imagePath);
  await deleteDoc(doc(db, COLLECTION_NAME, itemId));
  return itemId;
};
