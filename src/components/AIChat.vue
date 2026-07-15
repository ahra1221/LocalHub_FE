<template>
  <div>
    <button
      @click="chatOpen = !chatOpen"
      class="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-brand text-white shadow-xl hover:bg-brand-dark transition flex items-center justify-center"
    >
      <i
        :class="
          chatOpen
            ? 'fa-solid fa-xmark text-2xl'
            : 'fa-solid fa-comments text-2xl'
        "
      ></i>
    </button>

    <div
      v-if="chatOpen"
      class="fixed bottom-24 right-6 z-40 w-[360px] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
    >
      <div
        class="bg-brand text-white px-5 py-4 flex items-center justify-between"
      >
        <div>
          <h3 class="font-bold">LocalHub AI</h3>
          <p class="text-xs opacity-80">무엇을 도와드릴까요?</p>
        </div>

        <button @click="chatOpen = false">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div
        ref="messageContainer"
        class="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          :class="
            message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
          "
        >
          <div
            :class="
              message.role === 'user'
                ? 'bg-brand text-white'
                : 'bg-white border border-slate-200'
            "
            class="max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line"
          >
            <div v-if="message.loading" class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span v-else class="whitespace-pre-line">
              {{ message.content }}
            </span>
          </div>
        </div>
      </div>

      <form
        @submit.prevent="sendMessage"
        class="border-t border-slate-200 p-3 flex gap-2"
      >
        <input
          v-model="chatInput"
          class="flex-1 border rounded-xl px-3 py-2 outline-none"
          placeholder="메시지를 입력하세요."
        />

        <button class="bg-brand text-white rounded-xl px-4" type="submit">
          전송
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { fetchChat } from '@/api/endpoints'

const chatOpen = ref(false)
const chatInput = ref('')
const messages = ref([
  {
    id: 1,
    role: 'assistant',
    content: '안녕하세요! 어떤 정보를 찾고 계신가요?',
  },
])
const messageContainer = ref(null)

watch(
  () => messages.value.length,
  async () => {
    await nextTick()
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  },
)

async function sendMessage() {
  if (!chatInput.value.trim()) return

  const text = chatInput.value
  messages.value.push({
    id: Date.now(),
    role: 'user',
    content: text,
  })

  chatInput.value = ''
  const loadingId = Date.now() + 1

  messages.value.push({
    id: loadingId,
    role: 'assistant',
    content: '...',
    loading: true,
  })

  try {
    const data = await fetchChat(text)
    const loadingMessage = messages.value.find((message) => message.id === loadingId)
    if (loadingMessage) {
      loadingMessage.content = data.reply
      loadingMessage.loading = false
    }
  } catch (err) {
    const loadingMessage = messages.value.find((message) => message.id === loadingId)
    if (loadingMessage) {
      loadingMessage.content = '오류가 발생했습니다.'
      loadingMessage.loading = false
    }
  }
}
</script>
