<template>
  <main class="app-shell">
    <h1>Welcome to LocalHub FE</h1>
    <p>Vue 3 + Vite 초기 세팅이 완료되었습니다.</p>
    <button @click="count += 1">클릭: {{ count }}</button>
  </main>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<style>
:root {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #222;
  background: #f8f9fb;
}

body,
html {
  margin: 0;
  min-height: 100vh;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 32px;
  text-align: center;
}

button {
  padding: 10px 18px;
  border: none;
  border-radius: 12px;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
  background: #2563eb;
}
</style>
