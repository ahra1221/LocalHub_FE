<template>
  <button
    @click="$emit('click', category)"
    class="flex flex-col items-center gap-2 p-3 bg-brand-light rounded-xl border border-slate-200 hover:border-brand hover:shadow-md transition"
  >
    <img
      :src="category.image"
      :alt="category.title"
      class="w-12 h-12 object-cover"
    />

    <span class="text-sm font-semibold text-slate-700">
      {{ category.title }}
    </span>
  </button>
</template>

<script setup>
defineProps({
  category: {
    type: Object,
    required: true,
  },
});

defineEmits(["click"]);
</script>