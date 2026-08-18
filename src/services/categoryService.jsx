import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { uploadImage, deleteImage } from './menuService';

const COLLECTION_NAME = 'categories';

export const getAllCategories = async () => {
  const snapshot = await getDocs(
    query(collection(db, COLLECTION_NAME), orderBy('order'))
  );
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

export const addCategory = async (categoryData, imageFile) => {
  const imageData = imageFile
    ? await uploadImage(imageFile, 'categories')
    : null;

  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...categoryData,
    imageUrl: imageData?.url || null,
    imagePath: imageData?.path || null,
    createdAt: new Date().toISOString()
  });

  return {
    id: docRef.id,
    ...categoryData,
    imageUrl: imageData?.url || null,
    imagePath: imageData?.path || null
  };
};

export const updateCategory = async (categoryId, categoryData, imageFile) => {
  const imageData = imageFile
    ? await uploadImage(imageFile, 'categories')
    : null;
  const updateData = {
    ...categoryData,
    updatedAt: new Date().toISOString()
  };

  if (imageData) {
    updateData.imageUrl = imageData.url;
    updateData.imagePath = imageData.path;
  }

  await updateDoc(doc(db, COLLECTION_NAME, categoryId), updateData);
  return { id: categoryId, ...updateData };
};

export const deleteCategory = async (categoryId, imagePath) => {
  await deleteImage(imagePath);
  await deleteDoc(doc(db, COLLECTION_NAME, categoryId));
  return categoryId;
};
