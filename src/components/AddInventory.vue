<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h3>Add Inventory</h3>
      </div>
      <div class="card-body">
        <div v-if="successMessage" class="alert alert-success" role="alert">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="productName" class="form-label">Product Name</label>
            <input type="text" class="form-control" id="productName" v-model="productName" required />
          </div>
          <div class="mb-3">
            <label for="department" class="form-label">Department</label>
            <input type="text" class="form-control" id="department" v-model="department" required />
          </div>
          <div class="mb-3">
            <label for="productCategory" class="form-label">Product Category</label>
            <input type="text" class="form-control" id="productCategory" v-model="productCategory" required />
          </div>
          <div class="mb-3">
            <label for="productModel" class="form-label">Product Model</label>
            <input type="text" class="form-control" id="productModel" v-model="productModel" required />
          </div>
          <div class="mb-3">
            <label for="qty" class="form-label">Quantity</label>
            <input type="number" class="form-control" id="qty" v-model="qty" required />
          </div>
          <div class="mb-3">
            <label for="dateOfPurchase" class="form-label">Date of Purchase</label>
            <input type="date" class="form-control" id="dateOfPurchase" v-model="dateOfPurchase" required />
          </div>
          <div class="mb-3">
            <label for="employeeName" class="form-label">Employee Name</label>
            <input type="text" class="form-control" id="employeeName" v-model="employeeName" required />
          </div>
          <button type="submit" class="btn btn-primary">Add Inventory</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCrudStore } from '../store/crud';

const productName = ref('');
const department = ref('');
const productCategory = ref('');
const productModel = ref('');
const qty = ref(0);
const dateOfPurchase = ref('');
const employeeName = ref('');

const successMessage = ref('');
const errorMessage = ref('');

const crudStore = useCrudStore();

const handleSubmit = async () => {
  const newItem = {
    productName: productName.value,
    department: department.value,
    productCategory: productCategory.value,
    productModel: productModel.value,
    qty: qty.value,
    dateOfPurchase: dateOfPurchase.value,
    employeeName: employeeName.value,
  };

  try {
    await crudStore.addItem('inventory', newItem);
    successMessage.value = 'Inventory item added successfully!';
    errorMessage.value = '';
    // Clear form fields
    productName.value = '';
    department.value = '';
    productCategory.value = '';
    productModel.value = '';
    qty.value = 0;
    dateOfPurchase.value = '';
    employeeName.value = '';
  } catch (error) {
    successMessage.value = '';
    errorMessage.value = 'Failed to add inventory item.';
  }
};
</script>

<style scoped>
.card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #007bff;
  color: white;
}
.card-body {
  padding: 20px;
}
.alert {
  margin-bottom: 20px;
}
</style>
