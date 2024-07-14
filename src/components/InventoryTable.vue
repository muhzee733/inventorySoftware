<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h3>Inventory Table</h3>
      </div>
      <div class="card-body">
        <!-- Search Bar -->
        <div class="mb-3">
          <input v-model="searchQuery" type="text" class="form-control" placeholder="Search...">
        </div>

        <!-- Inventory Table -->
        <table class="table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Department</th>
              <th>Category</th>
              <th>Model</th>
              <th>Quantity</th>
              <th>Date of Purchase</th>
              <th>Employee Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="text-center">Loading...</td>
            </tr>
            <tr v-if="!loading && filteredInventory.length === 0">
              <td colspan="8" class="text-center">No data found</td>
            </tr>
            <tr v-for="item in paginatedInventory" :key="item.id">
              <td>{{ item.productName }}</td>
              <td>{{ item.department }}</td>
              <td>{{ item.productCategory }}</td>
              <td>{{ item.productModel }}</td>
              <td>{{ item.qty }}</td>
              <td>{{ item.dateOfPurchase }}</td>
              <td>{{ item.employeeName }}</td>
              <td>
                <button @click="openEditModal(item)" class="btn btn-warning btn-sm">Edit</button>
                <button @click="deleteItem(item.id)" class="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <nav v-if="showPagination">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="currentPage > 1 && setPage(currentPage - 1)">Previous</button>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
              <button class="page-link" @click="setPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="currentPage < totalPages && setPage(currentPage + 1)">Next</button>
            </li>
          </ul>
        </nav>

        <!-- Edit Modal -->
        <div v-if="showModal" class="modal" tabindex="-1" style="display: block;" role="dialog">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Edit Item</h5>
                <button type="button" class="close" @click="closeEditModal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="updateItem">
                  <div class="form-group">
                    <label for="productName">Product Name</label>
                    <input v-model="editForm.productName" type="text" class="form-control" id="productName" required>
                  </div>
                  <div class="form-group">
                    <label for="department">Department</label>
                    <input v-model="editForm.department" type="text" class="form-control" id="department" required>
                  </div>
                  <div class="form-group">
                    <label for="category">Category</label>
                    <input v-model="editForm.productCategory" type="text" class="form-control" id="category" required>
                  </div>
                  <div class="form-group">
                    <label for="model">Model</label>
                    <input v-model="editForm.productModel" type="text" class="form-control" id="model" required>
                  </div>
                  <div class="form-group">
                    <label for="quantity">Quantity</label>
                    <input v-model="editForm.qty" type="number" class="form-control" id="quantity" required>
                  </div>
                  <div class="form-group">
                    <label for="dateOfPurchase">Date of Purchase</label>
                    <input v-model="editForm.dateOfPurchase" type="date" class="form-control" id="dateOfPurchase" required>
                  </div>
                  <div class="form-group">
                    <label for="employeeName">Employee Name</label>
                    <input v-model="editForm.employeeName" type="text" class="form-control" id="employeeName" required>
                  </div>
                  <button type="submit" class="btn btn-primary">Save changes</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div v-if="showModal" class="modal-backdrop fade show"></div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCrudStore } from '../store/crud';

const crudStore = useCrudStore();
const inventory = computed(() => crudStore.items);
const loading = computed(() => crudStore.loading);
const error = computed(() => crudStore.error);

// Search and Pagination Variables
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 4; // Adjust as needed

// Edit Modal State
const showModal = ref(false);
const currentItem = ref(null);
const editForm = ref({
  productName: '',
  department: '',
  productCategory: '',
  productModel: '',
  qty: 0,
  dateOfPurchase: '',
  employeeName: ''
});

// Computed Filtered and Paginated Inventory
const filteredInventory = computed(() => {
  return inventory.value.filter(item =>
    item.productName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedInventory = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredInventory.value.slice(startIndex, startIndex + itemsPerPage);
});

// Pagination Calculations
const totalPages = computed(() => Math.ceil(filteredInventory.value.length / itemsPerPage));
const showPagination = computed(() => totalPages.value > 1);

// Methods
const fetchInventory = async () => {
  await crudStore.fetchItems('inventory');
};

const openEditModal = (item) => {
  currentItem.value = item;
  editForm.value = { ...item }; // Initialize form with item data
  showModal.value = true;
};

const closeEditModal = () => {
  showModal.value = false;
  currentItem.value = null;
};

const updateItem = async () => {
  try {
    await crudStore.updateItem('inventory', editForm.value.id, editForm.value);
    fetchInventory(); // Refresh the inventory list
    closeEditModal(); // Close modal after successful update
  } catch (error) {
    console.error('Error updating item:', error);
  }
};

const deleteItem = async (id) => {
  const confirmed = confirm('Are you sure you want to delete this item?');
  if (confirmed) {
    try {
      await crudStore.deleteItem('inventory', id);
      fetchInventory(); // Refresh the inventory list
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  } else {
    console.log('Delete action cancelled.');
  }
};

const setPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Lifecycle Hook
onMounted(() => {
  fetchInventory();
});
</script>


<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;
}

.modal-dialog {
  max-width: 500px;
  margin: 30px auto;
}

.modal-content {
  position: relative;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 0.3rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e5e5;
}

.modal-title {
  margin: 0;
  line-height: 1.5;
}

.modal-body {
  position: relative;
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  text-align: right;
  border-top: 1px solid #e5e5e5;
}

.close {
  padding: 0.75rem 1.25rem;
  margin: -0.75rem -1.25rem -0.75rem auto;
  color: #000;
  background: transparent;
  border: 0;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}
</style>

