<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h3>Employee List</h3>
      </div>
      <div class="card-body">
        <!-- Search Bar -->
        <div class="mb-3">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Search..."
          />
        </div>

        <!-- Employee Table -->
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Display Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center">Loading...</td>
            </tr>
            <tr v-if="!loading && filteredEmployees.length === 0">
              <td colspan="5" class="text-center">No data found</td>
            </tr>
            <tr v-for="employee in paginatedEmployees" :key="employee.id">
              <td>{{ employee.employeeName }}</td>
              <td>{{ employee.employeeDepartment }}</td>
              <td>{{ employee.displayName }}</td>
              <td>{{ employee.email }}</td>
              <td>
                <button
                  @click="deleteEmployee(employee.id)"
                  class="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <nav v-if="showPagination">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button
                class="page-link"
                @click="currentPage > 1 && setPage(currentPage - 1)"
              >
                Previous
              </button>
            </li>
            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: page === currentPage }"
            >
              <button class="page-link" @click="setPage(page)">
                {{ page }}
              </button>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
              <button
                class="page-link"
                @click="currentPage < totalPages && setPage(currentPage + 1)"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import { useCrudStore } from "../store/crud"; // Adjust the import according to your project structure

const crudStore = useCrudStore();
const employees = computed(() => crudStore.items); // Adjust according to your store
const loading = computed(() => crudStore.loading);
const error = computed(() => crudStore.error);

// Search and Pagination Variables
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5; // Adjust as needed

// Computed Filtered and Paginated Employees
const filteredEmployees = computed(() => {
  return employees.value.filter((employee) =>
    employee.employeeName
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  );
});

const paginatedEmployees = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredEmployees.value.slice(startIndex, startIndex + itemsPerPage);
});

// Pagination Calculations
const totalPages = computed(() =>
  Math.ceil(filteredEmployees.value.length / itemsPerPage)
);
const showPagination = computed(() => totalPages.value > 1);

// Methods
const fetchEmployees = async () => {
  await crudStore.fetchItems("employee"); // Adjust according to your store method
};

const deleteEmployee = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    try {
      await crudStore.deleteItem("employee", id); // Adjust according to your store method
      Swal.fire(
        'Deleted!',
        'The employee has been deleted.',
        'success'
      );
      fetchEmployees(); // Refresh the employee list
    } catch (error) {
      Swal.fire(
        'Error!',
        'There was an error deleting the employee.',
        'error'
      );
      console.error("Error deleting employee:", error);
    }
  } else {
    console.log("Delete action cancelled.");
  }
};

const setPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Lifecycle Hook
onMounted(() => {
  fetchEmployees();
});
</script>

<style scoped>
.table {
  width: 100%;
  margin-top: 20px;
}

.table th,
.table td {
  text-align: center;
}

.pagination {
  margin-top: 20px;
}
</style>

