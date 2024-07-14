<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h3>Add Employee</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="employeeName" class="form-label">Employee Name</label>
            <input
              type="text"
              class="form-control"
              id="employeeName"
              v-model="employeeName"
              required
            />
          </div>
          <div class="mb-3">
            <label for="employeeDepartment" class="form-label">Department</label>
            <input
              type="text"
              class="form-control"
              id="employeeDepartment"
              v-model="employeeDepartment"
              required
            />
          </div>
          <div class="mb-3">
            <label for="displayName" class="form-label">Display Name</label>
            <input
              type="text"
              class="form-control"
              id="displayName"
              v-model="displayName"
              required
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="text"
              class="form-control"
              id="password"
              v-model="password"
              readonly
              required
            />
            <button
              type="button"
              @click="generatePassword"
              class="btn btn-secondary mt-2"
            >
              Generate Password
            </button>
          </div>
          <button type="submit" class="btn btn-primary">Add Employee</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import { useCrudStore } from "../store/crud"; // Adjust the import according to your project structure

const employeeName = ref("");
const employeeDepartment = ref("");
const displayName = ref("");
const email = ref("");
const password = ref("");

const crudStore = useCrudStore();

const generatePassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let retVal = "";
  for (let i = 0; i < length; i++) {
    const randomPoz = Math.floor(Math.random() * charset.length);
    retVal += charset[randomPoz];
  }
  password.value = retVal;
};

const handleSubmit = async () => {
  const newEmployee = {
    employeeName: employeeName.value,
    employeeDepartment: employeeDepartment.value,
    displayName: displayName.value,
    email: email.value,
    password: password.value,
  };

  try {
    await crudStore.addItem("employee", newEmployee);

    // Clear form fields
    employeeName.value = "";
    employeeDepartment.value = "";
    displayName.value = "";
    email.value = "";
    password.value = "";

    // Show success alert
    Swal.fire({
      title: 'Success!',
      text: 'Employee added successfully!',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  } catch (error) {
    console.error("Error adding employee:", error);

    // Show error alert
    Swal.fire({
      title: 'Error!',
      text: 'There was an error adding the employee.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
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
</style>
