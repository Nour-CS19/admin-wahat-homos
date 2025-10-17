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
  import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
  import { db, storage } from '../firebase/config';
  
  const COLLECTION_NAME = 'menuItems';
  
  export const getAllMenuItems = async () => {
    try {
      const menuRef = collection(db, COLLECTION_NAME);
      const q = query(menuRef, orderBy('category'));
      const querySnapshot = await getDocs(q);
      
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`✅ Fetched ${items.length} menu items`);
      return items;
    } catch (error) {
      console.error('❌ Error fetching menu items:', error);
      throw error;
    }
  };
  
  export const uploadImage = async (file) => {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }
  
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }
  
      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }
  
      const timestamp = Date.now();
      const fileName = `menu-items/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      console.log('📤 Uploading image:', fileName);
      
      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      console.log('✅ Image uploaded successfully:', downloadURL);
      
      return { url: downloadURL, path: fileName };
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'storage/unauthorized') {
        throw new Error('Storage access denied. Please check Firebase Storage rules.');
      } else if (error.code === 'storage/canceled') {
        throw new Error('Upload canceled');
      } else if (error.code === 'storage/unknown') {
        throw new Error('Storage error. Please check your Firebase configuration.');
      }
      
      throw error;
    }
  };
  
  export const deleteImage = async (imagePath) => {
    try {
      if (imagePath) {
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
        console.log('✅ Image deleted:', imagePath);
      }
    } catch (error) {
      // Don't throw error if image doesn't exist
      if (error.code !== 'storage/object-not-found') {
        console.error('❌ Error deleting image:', error);
      }
    }
  };
  
  export const addMenuItem = async (itemData, imageFile) => {
    try {
      let imageData = null;
      
      // Upload image if provided
      if (imageFile) {
        try {
          imageData = await uploadImage(imageFile);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }
      
      // Add document to Firestore
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...itemData,
        imageUrl: imageData?.url || null,
        imagePath: imageData?.path || null,
        createdAt: new Date().toISOString()
      });
      
      console.log('✅ Menu item added:', docRef.id);
      
      return {
        id: docRef.id,
        ...itemData,
        imageUrl: imageData?.url || null
      };
    } catch (error) {
      console.error('❌ Error adding menu item:', error);
      throw error;
    }
  };
  
  export const updateMenuItem = async (itemId, itemData, imageFile, oldImagePath) => {
    try {
      let imageData = null;
      
      // Upload new image if provided
      if (imageFile) {
        try {
          // Delete old image first
          if (oldImagePath) {
            await deleteImage(oldImagePath);
          }
          
          // Upload new image
          imageData = await uploadImage(imageFile);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }
      
      // Update document in Firestore
      const itemRef = doc(db, COLLECTION_NAME, itemId);
      const updateData = {
        ...itemData,
        updatedAt: new Date().toISOString()
      };
      
      // Only update image fields if new image was uploaded
      if (imageFile && imageData) {
        updateData.imageUrl = imageData.url;
        updateData.imagePath = imageData.path;
      }
      
      await updateDoc(itemRef, updateData);
      
      console.log('✅ Menu item updated:', itemId);
      
      return {
        id: itemId,
        ...updateData
      };
    } catch (error) {
      console.error('❌ Error updating menu item:', error);
      throw error;
    }
  };
  
  export const deleteMenuItem = async (itemId, imagePath) => {
    try {
      // Delete image if exists
      if (imagePath) {
        await deleteImage(imagePath);
      }
      
      // Delete document from Firestore
      await deleteDoc(doc(db, COLLECTION_NAME, itemId));
      
      console.log('✅ Menu item deleted:', itemId);
      return itemId;
    } catch (error) {
      console.error('❌ Error deleting menu item:', error);
      throw error;
    }
  };