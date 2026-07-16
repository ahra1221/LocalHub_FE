<template>
  <button
    @click="$emit('click', category)"
    :class="
      active
        ? 'bg-brand text-white border-brand shadow-md'
        : 'bg-white text-slate-700 border-slate-200'
    "
    class="w-full aspect-square flex flex-col items-center justify-center gap-3 rounded-xl border transition"
  >
    <img
      :src="category.image"
      :alt="category.title"
      class="w-1/3 aspect-square object-contain"
    />

    <span
      class="text-sm font-semibold"
      :class="active ? 'text-white' : 'text-slate-700'"
    >
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
  active: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);
</script>
