<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 shadow-sm" style="width: 24rem;">
        <h3 class="card-title text-center mb-4">Login</h3>
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="loading">Login</button>
        </form>
        <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        <div v-if="success" class="alert alert-success mt-3">Login successfully</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useUserStore } from '../store/useStore';
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const success = ref(false);
  
  const userStore = useUserStore();
  const router = useRouter();
  
  const handleSubmit = async () => {
    await userStore.login(email.value, password.value);
    if (!userStore.error) {
      success.value = true;
      setTimeout(() => {
        router.push('/');
      }, 2000); 
    }
  };
  </script>
  
  <style scoped>
  .container {
    background: #f8f9fa;
  }
  .card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  </style>
  