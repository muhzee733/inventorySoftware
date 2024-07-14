<template>
  <div class="mt-5">
    <nav class="d-flex justify-content-center">
      <button
        class="btn btn-dark"
        @click="currentTab = 'inventoryTable'"
        :class="{ active: currentTab === 'inventoryTable' }"
      >
        Inventory Table
      </button>
      <button
        class="btn btn-dark"
        @click="currentTab = 'addInventory'"
        :class="{ active: currentTab === 'addInventory' }"
      >
        Add Inventory
      </button>
      <button
        class="btn btn-dark"
        @click="currentTab = 'addEmployee'"
        :class="{ active: currentTab === 'addEmployee' }"
      >
        Add Employee
      </button>
      <button
        class="btn btn-dark"
        @click="currentTab = 'employees'"
        :class="{ active: currentTab === 'employees' }"
      >
        Employees
      </button>
    </nav>

    <div v-if="currentTab === 'inventoryTable'">
      <InventoryTable />
    </div>
    <div v-if="currentTab === 'addInventory'">
      <AddInventory />
    </div>
    <div v-if="currentTab === 'addEmployee'">
      <AddEmployee />
    </div>
    <div v-if="currentTab === 'employees'">
      <Employees />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AddInventory from '../components/AddInventory.vue';
import InventoryTable from '../components/InventoryTable.vue';
import AddEmployee from '../components/AddEmployee.vue';
import Employees from '../components/Employees.vue';

const currentTab = ref('inventoryTable'); // Set default active tab
</script>

<style scoped>
nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
button {
  padding: 10px 20px;
  cursor: pointer;
}
button.active {
  background-color: #343a40;
  color: white;
}
</style>
