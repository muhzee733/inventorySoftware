import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth } from '../../firebase'; // Ensure this is correctly configured
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import router from '../router';

export const useUserStore = defineStore('auth', () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const login = async (email, password) => {
    loading.value = true;
    error.value = '';
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
      localStorage.setItem('auth', true)
    } catch (err) {
      console.error('Error logging in:', err);
      error.value = 'Failed to login. Please check your credentials and try again.';
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      user.value = null;
      localStorage.removeItem('auth')
      router.push('/login');
    } catch (err) {
      console.error('Error logging out:', err);
      error.value = 'Failed to logout. Please try again.';
    }
  };

  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });

  return {
    user,
    loading,
    error,
    login,
    logout,
  };
});
