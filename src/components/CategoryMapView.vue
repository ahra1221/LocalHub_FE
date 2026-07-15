<template>
  <div class="fixed inset-0 z-50 bg-white">
    <!-- 닫기 -->
    <button
      @click="$emit('close')"
      class="absolute top-5 right-5 z-50 bg-white rounded-full shadow-lg w-11 h-11 hover:bg-slate-100"
    >
      ✕
    </button>

    <!-- 지도 -->
    <div ref="mapContainer" class="w-full h-full"></div>

    <!-- 카드 -->
    <div
      v-if="selectedPlace"
      class="absolute z-40 w-[340px] -translate-x-1/2 -translate-y-full"
      :style="{
        left: cardPosition.x + 'px',
        top: cardPosition.y + 'px',
      }"
    >
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
import { ref, reactive, onMounted } from "vue";

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

const cardPosition = reactive({
  x: 0,
  y: 0,
});

let map = null;

async function renderMap() {
  await loadMap();

  const places = await fetchCategory(props.category.endpoint);

  if (!places?.length) return;

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

    const marker = new kakao.maps.Marker({
      map,
      position,
    });

    kakao.maps.event.addListener(marker, "click", () => {
      selectedPlace.value = place;

      map.panTo(position);

      setTimeout(() => {
        updateCardPosition(position);
      }, 200);
    });
  });

  map.setBounds(bounds);

  // 자동 확대
  setTimeout(() => {
    map.setLevel(Math.max(map.getLevel() - 1, 3));
  }, 100);

  kakao.maps.event.addListener(map, "center_changed", () => {
    if (!selectedPlace.value) return;

    updateCardPosition(
      new kakao.maps.LatLng(
        Number(selectedPlace.value.mapy),
        Number(selectedPlace.value.mapx),
      ),
    );
  });

  kakao.maps.event.addListener(map, "zoom_changed", () => {
    if (!selectedPlace.value) return;

    updateCardPosition(
      new kakao.maps.LatLng(
        Number(selectedPlace.value.mapy),
        Number(selectedPlace.value.mapx),
      ),
    );
  });
}

function updateCardPosition(latlng) {
  const projection = map.getProjection();

  const point = projection.containerPointFromCoords(latlng);

  cardPosition.x = point.x;
  cardPosition.y = point.y - 15;
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
