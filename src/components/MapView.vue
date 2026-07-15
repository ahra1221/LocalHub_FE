<template>
  <div
    ref="mapContainer"
    class="w-full h-[400px] rounded-2xl overflow-hidden"
  ></div>
</template>

<script setup>
import { onMounted, watch, ref, nextTick } from "vue";
import { loadMap } from "./loadMap";

const props = defineProps({
  mapx: {
    type: [String, Number],
    default: null,
  },
  mapy: {
    type: [String, Number],
    default: null,
  },
});

const mapContainer = ref(null);

let map = null;
let marker = null;

function renderMap() {
  if (!props.mapx || !props.mapy) return;

  // 카카오 지도 SDK 로딩 확인
  if (!window.kakao || !window.kakao.maps) {
    console.error("카카오 지도 SDK가 로드되지 않았습니다.");
    return;
  }

  const position = new kakao.maps.LatLng(
    Number(props.mapy),
    Number(props.mapx)
  );

  if (!map) {
    map = new kakao.maps.Map(mapContainer.value, {
      center: position,
      level: 3,
    });
  } else {
    map.setCenter(position);
  }

  if (!marker) {
    marker = new kakao.maps.Marker({
      position,
    });

    marker.setMap(map);
  } else {
    marker.setPosition(position);
  }
}

onMounted(async () => {
  await loadMap();
  renderMap();
});


watch(
  () => [props.mapx, props.mapy],
  () => {
    renderMap();
  }
);
</script>