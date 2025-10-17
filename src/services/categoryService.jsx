import { 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc,
    query,
    orderBy 
  } from 'firebase/firestore';
  import { db } from '../firebase/config';
  
  const COLLECTION_NAME = 'categories';
  
  export const getAllCategories = async () => {
    try {
      const categoriesRef = collection(db, COLLECTION_NAME);
      const q = query(categoriesRef, orderBy('order'));
      const querySnapshot = await getDocs(q);
      
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`✅ Fetched ${categories.length} categories`);
      return categories;
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      throw error;
    }
  };
  
  export const addCategory = async (categoryData) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...categoryData,
        createdAt: new Date().toISOString()
      });
      
      return {
        id: docRef.id,
        ...categoryData
      };
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };
  
  export const updateCategory = async (categoryId, categoryData) => {
    try {
      const categoryRef = doc(db, COLLECTION_NAME, categoryId);
      await updateDoc(categoryRef, {
        ...categoryData,
        updatedAt: new Date().toISOString()
      });
      
      return {
        id: categoryId,
        ...categoryData
      };
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };
  
  export const deleteCategory = async (categoryId) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, categoryId));
      return categoryId;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };