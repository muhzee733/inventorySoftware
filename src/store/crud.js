import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../../firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

export const useCrudStore = defineStore('crud', () => {
  const items = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchItems = async (collectionName) => {
    loading.value = true;
    error.value = null;
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      items.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('Error fetching items:', err);
      error.value = 'Failed to fetch items.';
    } finally {
      loading.value = false;
    }
  };

  const addItem = async (collectionName, item) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = await addDoc(collection(db, collectionName), item);
      items.value.push({ id: docRef.id, ...item });
    } catch (err) {
      console.error('Error adding item:', err);
      error.value = 'Failed to add item.';
    } finally {
      loading.value = false;
    }
  };

  const updateItem = async (collectionName, id, updatedItem) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, updatedItem);
      const index = items.value.findIndex(item => item.id === id);
      items.value[index] = { id, ...updatedItem };
    } catch (err) {
      console.error('Error updating item:', err);
      error.value = 'Failed to update item.';
    } finally {
      loading.value = false;
    }
  };

  const deleteItem = async (collectionName, id) => {
    loading.value = true;
    error.value = null;
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      items.value = items.value.filter(item => item.id !== id);
    } catch (err) {
      console.error('Error deleting item:', err);
      error.value = 'Failed to delete item.';
    } finally {
      loading.value = false;
    }
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem
  };
});
