<template>
  <div
    class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
  >
    <!-- Header -->
    <h3
      class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4"
    >
      <i class="fa-regular fa-comments text-brand"></i>
      <span>댓글 ({{ comments.length }})</span>
    </h3>


    <!-- Comment List -->
    <div
      v-if="comments.length === 0"
      class="text-center py-10 text-slate-400 text-xs sm:text-sm"
    >
      <i
        class="fa-regular fa-comment-dots text-slate-300 text-lg mb-2 block"
      ></i>
      <span>아직 작성된 댓글이 없습니다.</span>
    </div>


    <div v-else class="divide-y divide-slate-100">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="py-4 first:pt-0 last:pb-0 flex flex-col gap-2"
      >
        <div class="flex items-center gap-2 text-xs">
          <span
            class="font-bold text-slate-700 flex items-center gap-1"
          >
            <i class="fa-solid fa-user-circle text-[10px] text-slate-400"></i>
            익명
          </span>

          <span class="text-slate-300">•</span>

          <span class="text-slate-400">
            {{ comment.created_at }}
          </span>
        </div>


        <p
          class="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words"
        >
          {{ comment.content }}
        </p>
      </div>
    </div>


    <!-- Comment Write -->
    <form
      @submit.prevent="submitComment"
      class="border-t border-slate-100 pt-5 space-y-4"
    >
      <textarea
        v-model="content"
        rows="3"
        placeholder="따뜻하고 건강한 커뮤니티 공간을 위한 소중한 한마디를 적어주세요."
        required
        class="transition-custom w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none leading-relaxed"
      ></textarea>


      <div class="flex justify-end">
        <button
          type="submit"
          class="transition-custom px-5 py-2 bg-brand text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-brand-dark shadow-sm"
        >
          댓글 등록
        </button>
      </div>
    </form>

  </div>
</template>


<script setup>
import { ref } from "vue";

const props = defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
});


const emit = defineEmits([
  "submit",
]);


const content = ref("");


function submitComment() {
  emit("submit", {
    content: content.value.trim(),
  });

  content.value = "";
}
</script>