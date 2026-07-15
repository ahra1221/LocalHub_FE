<!-- src/components/RecommendCard.vue -->
<template>
  <article class="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
    <button
      type="button"
      @click="handleClick"
      class="w-full text-left focus:outline-none focus:ring-2 focus:ring-brand/30"
      :aria-label="title"
    >
      <figure class="h-44 sm:h-56 bg-slate-100 overflow-hidden">
        <img
          :src="imgSrc"
          :alt="title"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
          loading="lazy"
          @error="onImgError"
        />
      </figure>

      <div class="p-4">
        <h3 class="text-sm sm:text-base font-semibold text-slate-900 mb-1 line-clamp-2">
          {{ title }}
        </h3>
        <p class="text-xs text-slate-500 line-clamp-2">
          {{ address }}
        </p>
      </div>
    </button>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, default: '' },
  googleMapUrl: { type: String, default: null }
})

const emits = defineEmits(['click'])

const fallbackSrc = '/images/fallback.jpg'
const imgSrc = ref(props.image)

function onImgError() {
  imgSrc.value = fallbackSrc
}

const address = computed(() => {
  if (!props.address) return ''
  return props.address.length > 90 ? props.address.slice(0, 90) + '…' : props.address
})

function handleClick() {
  emits('click', props.googleMapUrl)
}

watch(
  () => props.image,
  (newImage) => {
    imgSrc.value = newImage
  }
)

</script>