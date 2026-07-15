<template>
  <div class="fixed inset-0 z-50 bg-white">
    <!-- 닫기 -->
    <button
      @click="$emit('close')"
      class="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-white shadow-lg hover:bg-slate-100"
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
        left: `${cardPosition.x}px`,
        top: `${cardPosition.y}px`,
      }"
    >
      <RecommendCard
        :key="selectedPlace.contentid"
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
import { ref, reactive, onMounted, nextTick } from "vue";
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
let currentMarker = null;

async function renderMap() {
  await loadMap();

  const places = await fetchCategory(props.category.endpoint);

  if (!places?.length) return;

  // 강남역
  const center = new kakao.maps.LatLng(
    37.5012860931305,
    127.039604663862
  );

  map = new kakao.maps.Map(mapContainer.value, {
    center,
    level: 3,
  });

  places.forEach((place) => {
    const position = new kakao.maps.LatLng(
      Number(place.mapy),
      Number(place.mapx)
    );

    const marker = new kakao.maps.Marker({
      map,
      position,
    });

    kakao.maps.event.addListener(marker, "click", async () => {
      // 이전 선택 해제
      if (currentMarker) {
        currentMarker.setZIndex(0);
      }

      currentMarker = marker;
      currentMarker.setZIndex(999);

      // 카드 내용 변경
      selectedPlace.value = { ...place };

      await nextTick();

      // 해당 위치로 이동
      map.panTo(position);

      setTimeout(() => {
        updateCardPosition(position);
      }, 250);
    });
  });

  // 지도 움직이면 카드도 같이 이동
  kakao.maps.event.addListener(map, "center_changed", () => {
    if (!selectedPlace.value) return;

    updateCardPosition(
      new kakao.maps.LatLng(
        Number(selectedPlace.value.mapy),
        Number(selectedPlace.value.mapx)
      )
    );
  });

  kakao.maps.event.addListener(map, "zoom_changed", () => {
    if (!selectedPlace.value) return;

    updateCardPosition(
      new kakao.maps.LatLng(
        Number(selectedPlace.value.mapy),
        Number(selectedPlace.value.mapx)
      )
    );
  });

  kakao.maps.event.addListener(map, "drag", () => {
    if (!selectedPlace.value) return;

    updateCardPosition(
      new kakao.maps.LatLng(
        Number(selectedPlace.value.mapy),
        Number(selectedPlace.value.mapx)
      )
    );
  });
}

function updateCardPosition(latlng) {
  if (!map) return;

  const projection = map.getProjection();

  const point = projection.containerPointFromCoords(latlng);

  cardPosition.x = point.x;

  // 마커 바로 위
  cardPosition.y = point.y - 25;
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