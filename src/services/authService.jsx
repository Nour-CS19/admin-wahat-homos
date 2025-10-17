import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
  } from 'firebase/auth';
  import { auth } from '../firebase/config';
  
  export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };
  
  export const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };
  
  export const onAuthChanged = (callback) => {
    return onAuthStateChanged(auth, callback);
  };