<template>
  <div class="fixed inset-0 z-50 bg-white">
    <button
      @click="$emit('close')"
      class="absolute top-5 right-5 z-30 bg-white rounded-full shadow-lg w-11 h-11 hover:bg-slate-100"
    >
      ✕
    </button>

    <div ref="mapContainer" class="w-full h-full"></div>

    <div v-if="selectedPlace" class="absolute left-6 bottom-6 z-20 w-[360px]">
      <RecommendCard
        :title="selectedPlace.title"
        :image="selectedPlace.image"
        :address="selectedPlace.address"
        :googleMapUrl="selectedPlace.googleMapUrl"
        @click="openMap"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import RecommendCard from "./RecommendCard.vue";
import { loadMap } from "./loadMap";
import { fetchCategory } from "../api/endpoints";

const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);

const mapContainer = ref(null);

const selectedPlace = ref(null);

let map = null;

async function renderMap() {
  await loadMap();

  const places = await fetchCategory(props.category.endpoint);

  if (!places || places.length === 0) return;

  const center = new kakao.maps.LatLng(
    Number(places[0].mapy),
    Number(places[0].mapx),
  );

  map = new kakao.maps.Map(mapContainer.value, {
    center,
    level: 5,
  });

  const bounds = new kakao.maps.LatLngBounds();

  places.forEach((place) => {
    const position = new kakao.maps.LatLng(
      Number(place.mapy),
      Number(place.mapx),
    );

    bounds.extend(position);

    // 기본 마커
    const marker = new kakao.maps.Marker({
      position,
      map,
    });

    kakao.maps.event.addListener(marker, "click", () => {
      // 항상 하나의 카드만 표시
      selectedPlace.value = place;

      // 클릭한 마커를 가운데로 이동
      map.panTo(position);
    });
  });

  map.setBounds(bounds);
}

function openMap(url) {
  if (url) {
    window.open(url, "_blank");
  }
}

onMounted(() => {
  renderMap();
});
</script>
