<template>
  <div class="flex-grow flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased" v-cloak>
    <header class="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div class="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2 cursor-pointer" @click="goHome">
          <div class="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white">
            <i class="fa-solid fa-feather-alt text-sm"></i>
          </div>
          <span class="font-bold text-lg text-brand tracking-tight">LocalHub</span>
        </div>
        <button
          @click="showCreate"
          class="transition-custom flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-dark shadow-md"
        >
          <i class="fa-solid fa-pen-nib text-xs"></i>
          <span>글쓰기</span>
        </button>
      </div>
    </header>

    <main class="flex-grow max-w-3xl w-full mx-auto px-5 py-8">
      <div class="mb-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h1 class="text-lg font-bold text-slate-900 mb-1">환영합니다! 자유로운 소통 공간입니다.</h1>
        <p class="text-slate-500 text-xs sm:text-sm leading-relaxed">
          회원가입이나 로그인 없이 비밀번호만으로 간편하고 안전하게 글을 작성하고 조회할 수 있습니다.
        </p>
      </div>

        <!-- Recommend buttons -->
        <div class="mb-6 flex gap-3">
          <button
            @click="showRecommendFor('watch')"
            :class="activeRecommend === 'watch'
              ? 'bg-brand text-white border-brand'
              : 'bg-white text-slate-700 border-slate-200'"
            class="flex-1 py-3 rounded-lg font-semibold border transition"
          >
            볼거리 추천
          </button>

          <button
            @click="showRecommendFor('enjoy')"
            :class="activeRecommend === 'enjoy'
              ? 'bg-brand text-white border-brand'
              : 'bg-white text-slate-700 border-slate-200'"
            class="flex-1 py-3 rounded-lg font-semibold border transition"
          >
            즐길거리 추천
          </button>
        </div>

        <!-- Recommend cards area -->
        <section v-if="recommendVisible" class="mb-6">
          <div>
            <RecommendCard
              v-for="item in recommendItems"
              :key="item.title"
              :title="item.title"
              :image="item.image"
              :address="item.address"
            />
          </div>
        </section>

      <section v-if="view === 'list'" class="space-y-4">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div v-if="posts.length === 0" class="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <i class="fa-regular fa-folder-open text-xl"></i>
            </div>
            <h3 class="font-bold text-slate-700 mb-1">게시글이 존재하지 않습니다</h3>
            <p class="text-slate-400 text-xs">첫 게시글을 지금 등록해보세요.</p>
          </div>

          <div v-else class="divide-y divide-slate-150">
            <article
              v-for="post in sortedPosts"
              :key="post.id"
              @click="openDetail(post)"
              class="transition-custom p-6 hover:bg-slate-50 cursor-pointer flex flex-col gap-2 group"
            >
              <div class="flex items-center justify-between text-xs text-slate-400">
                <div class="flex items-center gap-1.5">
                  <span class="font-medium text-slate-600 flex items-center gap-1">
                    <i class="fa-solid fa-user-secret text-slate-400 text-[10px]"></i> 익명
                  </span>
                  <span>•</span>
                  <span>{{ formatDate(post.createdAt) }}</span>
                </div>
                <div class="flex items-center gap-1 text-slate-400 bg-slate-100/75 px-2 py-0.5 rounded-full text-[11px]">
                  <i class="fa-regular fa-eye text-[10px]"></i>
                  <span>{{ post.views || 0 }}</span>
                </div>
              </div>
              <h3 class="font-bold text-slate-900 group-hover:text-brand transition-custom text-base leading-snug">{{ post.title }}</h3>
              <p class="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">{{ post.preview }}</p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="view === 'detail'" class="space-y-4">
        <div class="flex items-center justify-between">
          <button
            @click="backToList"
            class="transition-custom flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>목록</span>
          </button>

          <div class="flex gap-2">
            <button
              @click="requestEdit"
              class="transition-custom flex items-center gap-1 px-3.5 py-2 text-xs sm:text-sm font-semibold text-brand bg-brand-light rounded-xl hover:bg-brand/10"
            >
              <span>수정</span>
            </button>
            <button
              @click="requestDelete"
              class="transition-custom flex items-center gap-1 px-3.5 py-2 text-xs sm:text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100"
            >
              <span>삭제</span>
            </button>
          </div>
        </div>

        <article class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div class="border-b border-slate-100 pb-5 space-y-2">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span class="font-semibold text-slate-600">익명</span>
              <span>•</span>
              <span>{{ formatDate(selectedPost.createdAt) }}</span>
              <span>•</span>
              <span class="flex items-center gap-1 text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">
                <i class="fa-regular fa-eye text-[11px] text-brand"></i>
                <span>조회수 {{ selectedPost.views || 0 }}</span>
              </span>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-950 leading-snug">{{ selectedPost.title }}</h2>
          </div>

          <p class="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words min-h-[150px]">{{ selectedPost.content }}</p>
        </article>
      </section>

      <section v-if="view === 'create' || view === 'edit'" class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <i class="fa-solid" :class="view === 'create' ? 'fa-pen-to-square text-brand' : 'fa-pen text-brand'"></i>
            <span>{{ view === 'create' ? '새로운 글 작성하기' : '글 수정하기' }}</span>
          </h2>
          <button @click="cancelForm" class="text-slate-400 hover:text-slate-600 transition-custom">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form @submit.prevent="view === 'create' ? submitCreate() : submitEdit()" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">글 제목</label>
            <input
              v-model="form.title"
              type="text"
              placeholder="제목을 입력해 주세요"
              required
              maxlength="100"
              class="transition-custom w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">상세 내용</label>
            <textarea
              v-model="form.content"
              placeholder="내용을 자유롭게 입력하세요."
              rows="10"
              required
              class="transition-custom w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">비밀번호</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              required
              class="transition-custom w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
            />
            <p 
              v-if="errorMessage"
              class="text-xs text-red-500 mt-2 flex items-center gap-1"
            >
              <i class="fa-solid fa-circle-exclamation"></i>
              <span>{{ errorMessage }}</span>
            </p>
            <p class="text-xs text-slate-400 mt-2">
              <i class="fa-solid fa-circle-info mr-2"></i>
              <span>비밀번호는 본인의 작성물 권한 확인을 위해서만 사용되며 평문 데이터로 내부 저장됩니다.</span>
            </p>
          </div>

          <div class="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
            <button
              type="button"
              @click="cancelForm"
              class="transition-custom px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              class="transition-custom px-6 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-dark shadow-md"
            >
              {{ view === 'create' ? '등록' : '저장' }}
            </button>
          </div>
        </form>
      </section>

      <section v-if="view === 'confirm'" class="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-brand flex items-center justify-center mx-auto text-lg">
            <i class="fa-solid fa-lock"></i>
          </div>
          <h2 class="text-lg font-bold text-slate-900">비밀번호 확인</h2>
          <p class="text-xs sm:text-sm text-slate-500 leading-normal">
            선택하신 게시글을 <strong>{{ action === 'edit' ? '수정' : '삭제' }}</strong>하려면 비밀번호를 입력해주세요.
          </p>
        </div>

        <form @submit.prevent="verifyPassword" class="space-y-4">
          <div>
            <input
              v-model="passwordCheck"
              type="password"
              placeholder="비밀번호를 입력하세요"
              required
              autofocus
              class="transition-custom w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
            />
          </div>

          <p v-if="errorMessage" class="text-xs text-red-500 flex items-center gap-1.5 justify-center bg-red-50 py-2 rounded-lg">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>{{ errorMessage }}</span>
          </p>

          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="backToDetail"
              class="transition-custom w-full py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              class="transition-custom w-full py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-dark shadow-md"
            >
              확인
            </button>
          </div>
        </form>
      </section>
    </main>

    <div
      v-if="toast.show"
      class="fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-0 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl max-w-sm border bg-white border-slate-100"
    >
      <span class="flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-xs bg-brand/10 text-brand">
        <i class="fa-solid fa-check"></i>
      </span>
      <p class="text-xs sm:text-sm font-semibold text-slate-800">{{ toast.message }}</p>
    </div>

    <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
      <div class="max-w-3xl mx-auto px-5 space-y-1">
        <p class="font-bold text-slate-500">익명 자유게시판</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import RecommendCard from './components/RecommendCard.vue'
import './App.css'
import { getBannerView, getBannerPlay, fetchPost, fetchPostDetail, createPost, deletePost, updatePost } from './api/endpoints'

const storageKey = 'cleanboard_posts'
const initialPosts = [
  {
    id: 1,
    title: '환영합니다! 익명 자유게시판입니다.',
    content:
      '이 게시판은 번거로운 회원가입 절차 없이 제목, 내용, 그리고 비밀번호만 지정하면 편리하게 이용하실 수 있습니다.\n\n글 작성 시 설정하신 비밀번호는 본인의 글을 수정하거나 삭제하고 싶을 때 유용하게 쓰입니다. 잊지 않도록 잘 보관하시기를 바랍니다.\n\n가독성 높은 프리미엄 고딕 폰트로 구성된 쾌적한 화면에서 자유로운 대화를 나누어보세요.',
    password: '1234',
    views: 42,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  }
]

const posts = ref([])
const view = ref('list')
const selectedPostId = ref(null)
const action = ref(null)
const passwordCheck = ref('')
const errorMessage = ref('')

const form = reactive({
  title: '',
  content: '',
  password: ''
})

const toast = reactive({
  show: false,
  message: ''
})

// Recommend card state
const recommendVisible = ref(false)
const recommendItems = ref([])
const activeRecommend = ref(null)

async function showRecommendFor(type) {
  if (activeRecommend.value === type) {
    closeRecommend()
    return
  }
  activeRecommend.value = type
  recommendVisible.value = true
  if (type === 'watch') {
    try {
      const data = await getBannerView()
      const image = data?.image || data?.image2 || '/images/fallback.jpg'
      const title = data?.title || '제목 없음'
      const address = data?.address || ''
      recommendItems.value = [{ title, image, address }]
    } catch (err) {
      console.error('getBannerView error', err)
      recommendItems.value = [
        { title: '한강공원', image: '/images/fallback.jpg', address: '서울 대표 관광지' }
      ]
    }
  } else {
    try {
      const data = await getBannerPlay()
      // getBannerPlay may return an array; map first item if present
      const item = Array.isArray(data) ? data[0] : data
      const image = item?.image || item?.image2 || '/images/fallback.jpg'
      const title = item?.title || '제목 없음'
      const address = item?.address || ''
      recommendItems.value = [{ title, image, address }]
    } catch (err) {
      console.error('getBannerPlay error', err)
      recommendItems.value = [
        { title: '광화문', image: "https://tong.visitkorea.or.kr/cms/resource_photo/46/3551346_image2_1.jpg", address: '역사와 문화의 중심지' }
      ]
    }
  }
}

const sortedPosts = computed(() => {
  return [...posts.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(post => ({
      ...post,
      preview: post.content.length > 80 ? post.content.slice(0, 80) + '...' : post.content
    }))
})

const selectedPost = computed(() => {
  return posts.value.find(post => post.id === selectedPostId.value) || {}
})

onMounted(async () => {
  await loadPosts()
  const bannerViewData = await getBannerView()
  recommendItems.value = bannerViewData
})

async function loadPosts() {
  const postData = await fetchPost()

  posts.value = Array.isArray(postData)
    ? postData.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        views: post.view_count,
        createdAt: post.created_at,
        comments: post.comments
      }))
    : []
}

function savePostsToStorage() {
  localStorage.setItem(storageKey, JSON.stringify(posts.value))
}

function showToast(message) {
  toast.message = message
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 2800)
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

function goHome() {
  closeRecommend()
  resetState()
  view.value = 'list'
}

function showCreate() {
  closeRecommend()
  resetForm()
  view.value = 'create'
}

async function openDetail(post) {
  closeRecommend()
  const detailData = await fetchPostDetail(post.id)
  const index = posts.value.findIndex(
    item => item.id === post.id
  )

  if (index !== -1) {
    posts.value[index] = {
      ...posts.value[index],
      id: detailData.id,
      title: detailData.title,
      content: detailData.content,
      views: detailData.view_count,
      createdAt: detailData.created_at,
      comments: detailData.comments
    }
  }

  selectedPostId.value = post.id
  view.value = 'detail'
}

function backToList() {
  closeRecommend()
  resetState()
  view.value = 'list'
}

function cancelForm() {
  if (view.value === 'edit') {
    view.value = 'detail'
    return
  }

  view.value = 'list'
  resetForm()
}

function backToDetail() {
  view.value = 'detail'
  errorMessage.value = ''
  passwordCheck.value = ''
}

function requestEdit() {
  action.value = 'edit'
  passwordCheck.value = ''
  errorMessage.value = ''
  const post = selectedPost.value
  if (!post) return

  form.title = post.title
  form.content = post.content
  form.password = post.password
  view.value = 'edit'
}

function requestDelete() {
  action.value = 'delete'
  passwordCheck.value = ''
  errorMessage.value = ''
  view.value = 'confirm'
}

async function verifyPassword() {
  const post = selectedPost.value
  if (!post) return
   try {
    await deletePost(post.id, passwordCheck.value)

    await loadPosts()
    showToast('게시글이 삭제되었습니다.')
    backToList()

  } catch (err) {
    const status = err.response?.status

    if (status === 403) {
      errorMessage.value = '비밀번호가 일치하지 않습니다.'
    } else {
      errorMessage.value = '삭제 중 오류가 발생했습니다.'
    }
  }
}

async function submitCreate() {
  const newPost = {
    title: form.title.trim(),
    content: form.content.trim(),
    password: form.password
  }
  
  await createPost(newPost)
  await loadPosts()
  showToast('게시글이 등록되었습니다.')
  view.value = 'list'
}

async function submitEdit() {
  const post = selectedPost.value

  if (!post) return

  const updateData = {
    title: form.title.trim(),
    content: form.content.trim(),
    password: form.password
  }

   try {
    await updatePost(post.id, updateData)
    await loadPosts()

    showToast('수정 사항이 저장되었습니다.')
    view.value = 'detail'

  } catch (err) {
    const status = err.response?.status

    if (status === 403) {
      errorMessage.value = '비밀번호가 일치하지 않습니다.'
    } else {
      errorMessage.value = '수정 중 오류가 발생했습니다.'
    }
  }
}

function resetForm() {
  form.title = ''
  form.content = ''
  form.password = ''
}

function resetState() {
  selectedPostId.value = null
  action.value = null
  passwordCheck.value = ''
  errorMessage.value = ''
  resetForm()
}

function closeRecommend() {
  recommendVisible.value = false
  activeRecommend.value = null
  recommendItems.value = []
}
</script>
