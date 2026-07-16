<template>
  <div
    class="relative w-full h-[500px] bg-white rounded-2xl overflow-hidden border border-slate-200"
  >
    <button
      @click="showRandomPlace"
      class="absolute top-4 right-4 z-50 px-4 py-2 bg-white text-brand border border-brand rounded-full shadow-md hover:bg-brand-light transition"
    >
      추천
    </button>
    <div ref="mapContainer" class="w-full h-full"></div>

    <div
      v-if="selectedPlace"
      class="absolute z-40 w-[300px] -translate-x-1/2 -translate-y-full"
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
import { ref, reactive, onMounted, nextTick, watch } from "vue";
import RecommendCard from "./RecommendCard.vue";
import { loadMap } from "./loadMap";
import { fetchCategory } from "../api/endpoints";

const props = defineProps({
  category: {
    type: Object,
    default: null,
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
const markers = ref([]);

async function renderMap() {
  if (!props.category) return;
  await loadMap();

  const places = await fetchCategory(props.category.endpoint);

  if (!places?.length) return;

  // 강남역
  const center = new kakao.maps.LatLng(37.5012860931305, 127.039604663862);

  map = new kakao.maps.Map(mapContainer.value, {
    center,
    level: 3,
  });

  places.forEach((place) => {
    const position = new kakao.maps.LatLng(
      Number(place.mapy),
      Number(place.mapx),
    );

    const marker = new kakao.maps.Marker({
      map,
      position,
    });

    markers.value.push({
      marker,
      place,
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

  kakao.maps.event.addListener(map, "drag", () => {
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

function showRandomPlace() {
  if (!markers.value.length) return;

  const random =
    markers.value[Math.floor(Math.random() * markers.value.length)];

  if (currentMarker) {
    currentMarker.setZIndex(0);
  }

  currentMarker = random.marker;
  currentMarker.setZIndex(999);

  selectedPlace.value = { ...random.place };

  map.panTo(random.position);

  setTimeout(() => {
    updateCardPosition(random.position);
  }, 300);
}

onMounted(() => {
  if (props.category) {
    renderMap();
  }
});

watch(
  () => props.category,
  () => {
    if (map) {
      map = null;
      currentMarker = null;
      markers.value = [];
      selectedPlace.value = null;
      mapContainer.value.innerHTML = "";
    }

    renderMap();
  },
);
</script>
