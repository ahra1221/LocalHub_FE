<template>
  <div
    class="flex-grow flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased"
    v-cloak
  >
    <header
      class="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm"
    >
      <div
        class="relative max-w-[1800px] mx-auto px-12 h-16 flex items-center justify-center"
      >
        <span class="font-bold text-2xl sm:text-4xl text-brand tracking-tight">
          SeoulHub
        </span>
      </div>
    </header>

    <main
      class="flex-1 w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-8"
    >
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <aside class="lg:col-span-6">
          <div
            class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4"
          >
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
              <CategoryButton
                v-for="category in categories"
                :key="category.id"
                :category="category"
                :active="selectedCategory?.id === category.id"
                @click="selectCategory"
              />
            </div>

            <div class="mt-5">
              <CategoryMapView :category="selectedCategory" />
            </div>
          </div>
        </aside>

        <section class="lg:col-span-6">
          <div
            v-if="view === 'list'"
            class="mb-6 flex items-center justify-between gap-2"
          >
            <div class="flex flex-wrap gap-2">
              <button
                @click="changeSort('latest')"
                :class="
                  sortType === 'latest'
                    ? 'bg-brand text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                "
                class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition"
              >
                최신순
              </button>

              <button
                @click="changeSort('views')"
                :class="
                  sortType === 'views'
                    ? 'bg-brand text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                "
                class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition"
              >
                조회순
              </button>

              <button
                @click="changeSort('comments')"
                :class="
                  sortType === 'comments'
                    ? 'bg-brand text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                "
                class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition"
              >
                댓글순
              </button>
            </div>

            <button
              @click="showCreate"
              class="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-brand border border-brand text-xs sm:text-sm font-semibold rounded-xl hover:bg-brand hover:text-white shadow-md transition"
            >
              <i class="fa-solid fa-pen-nib text-xs"></i>
              <span>글쓰기</span>
            </button>
          </div>

          <section v-if="view === 'list'" class="space-y-4">
            <div
              class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div
                v-if="posts.length === 0"
                class="flex flex-col items-center justify-center py-16 px-4 text-center"
              >
                <div
                  class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3"
                >
                  <i class="fa-regular fa-folder-open text-xl"></i>
                </div>
                <h3 class="font-bold text-slate-700 mb-1">
                  게시글이 존재하지 않습니다
                </h3>
                <p class="text-slate-400 text-xs">
                  첫 게시글을 지금 등록해보세요.
                </p>
              </div>

              <div v-else class="divide-y divide-slate-150">
                <article
                  v-for="post in sortedPosts"
                  :key="post.id"
                  @click="openDetail(post)"
                  class="transition-custom p-6 hover:bg-slate-50 cursor-pointer flex flex-col gap-2 group"
                >
                  <div
                    class="flex items-center justify-between text-xs text-slate-400"
                  >
                    <div class="flex items-center gap-1.5">
                      <span
                        class="font-medium text-slate-600 flex items-center gap-1"
                      >
                        <i
                          class="fa-solid fa-user-secret text-slate-400 text-[10px]"
                        ></i>
                        익명
                      </span>
                      <span>•</span>
                      <span>{{ post.createdAt }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div
                        class="flex items-center gap-1 text-slate-400 bg-slate-100/75 px-2 py-0.5 rounded-full text-[11px]"
                      >
                        <i class="fa-regular fa-eye text-[10px]"></i>
                        <span>{{ post.views || 0 }}</span>
                      </div>

                      <div
                        class="flex items-center gap-1 text-slate-400 bg-slate-100/75 px-2 py-0.5 rounded-full text-[11px]"
                      >
                        <i class="fa-regular fa-comment text-[10px]"></i>
                        <span>{{ post.commentCount || 0 }}</span>
                      </div>
                    </div>
                  </div>
                  <h3
                    class="font-bold text-slate-900 group-hover:text-brand transition-custom text-base leading-snug"
                  >
                    {{ post.title }}
                  </h3>
                  <p
                    class="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed"
                  >
                    {{ post.preview }}
                  </p>
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

            <article
              class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div class="border-b border-slate-100 pb-5 space-y-2">
                <div class="flex items-center gap-2 text-xs text-slate-400">
                  <span class="font-semibold text-slate-600">익명</span>
                  <span>•</span>
                  <span>{{ selectedPost.createdAt }}</span>
                  <span>•</span>
                  <span
                    class="flex items-center gap-1 text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100"
                  >
                    <i class="fa-regular fa-eye text-[11px] text-brand"></i>
                    <span>조회수 {{ selectedPost.views || 0 }}</span>
                  </span>
                </div>
                <h2
                  class="text-xl sm:text-2xl font-bold text-slate-950 leading-snug"
                >
                  {{ selectedPost.title }}
                </h2>
              </div>

              <p
                class="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words min-h-[150px]"
              >
                {{ selectedPost.content }}
              </p>
            </article>

            <CommentSection
              :comments="selectedPost.comments || []"
              @submit="submitComment"
            />
          </section>

          <section
            v-if="view === 'create' || view === 'edit'"
            class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div
              class="flex items-center justify-between border-b border-slate-100 pb-4"
            >
              <h2
                class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2"
              >
                <i
                  class="fa-solid"
                  :class="
                    view === 'create'
                      ? 'fa-pen-to-square text-brand'
                      : 'fa-pen text-brand'
                  "
                ></i>
                <span>{{
                  view === "create" ? "새로운 글 작성하기" : "글 수정하기"
                }}</span>
              </h2>
              <button
                @click="cancelForm"
                class="text-slate-400 hover:text-slate-600 transition-custom"
              >
                <i class="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form
              @submit.prevent="
                view === 'create' ? submitCreate() : submitEdit()
              "
              class="space-y-5"
            >
              <div>
                <label
                  class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2"
                  >글 제목</label
                >
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
                <label
                  class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2"
                  >상세 내용</label
                >
                <textarea
                  v-model="form.content"
                  placeholder="내용을 자유롭게 입력하세요."
                  rows="10"
                  required
                  class="transition-custom w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label
                  class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2"
                  >비밀번호</label
                >
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
                  <span
                    >비밀번호는 본인의 작성물 권한 확인을 위해서만 사용되며 평문
                    데이터로 내부 저장됩니다.</span
                  >
                </p>
              </div>

              <div
                class="pt-4 border-t border-slate-100 flex justify-end gap-2.5"
              >
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
                  {{ view === "create" ? "등록" : "저장" }}
                </button>
              </div>
            </form>
          </section>

          <section
            v-if="view === 'confirm'"
            class="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div class="text-center space-y-2">
              <div
                class="w-12 h-12 rounded-2xl bg-indigo-50 text-brand flex items-center justify-center mx-auto text-lg"
              >
                <i class="fa-solid fa-lock"></i>
              </div>
              <h2 class="text-lg font-bold text-slate-900">비밀번호 확인</h2>
              <p class="text-xs sm:text-sm text-slate-500 leading-normal">
                선택하신 게시글을 삭제하려면 비밀번호를 입력해주세요.
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

              <p
                v-if="errorMessage"
                class="text-xs text-red-500 flex items-center gap-1.5 justify-center bg-red-50 py-2 rounded-lg"
              >
                <i class="fa-solid fa-circle-exclamation"></i>
                <span>{{ errorMessage }}</span>
              </p>

              <div class="flex flex-wrap gap-2">
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
        </section>
      </div>
    </main>

    <AIChat />

    <div
      v-if="toast.show"
      class="fixed top-6 right-6 z-50 transition-all duration-300 transform translate-y-0 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl max-w-sm border bg-white border-slate-100"
    >
      <span
        class="flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-xs bg-brand/10 text-brand"
      >
        <i class="fa-solid fa-check"></i>
      </span>
      <p class="text-xs sm:text-sm font-semibold text-slate-800">
        {{ toast.message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";

import AIChat from "./components/AIChat.vue";
import CommentSection from "./components/CommentSection.vue";
import CategoryButton from "./components/CategoryButton.vue";
import CategoryMapView from "./components/CategoryMapView.vue";
import { categories } from "./components/categories";

import "./App.css";
import {
  fetchPost,
  fetchPostPopular,
  fetchPostPopular2,
  fetchPostDetail,
  createPost,
  deletePost,
  updatePost,
  createComment,
} from "./api/endpoints";

const posts = ref([]);
const sortType = ref("latest");
const view = ref("list");
const selectedPostId = ref(null);
const passwordCheck = ref("");
const errorMessage = ref("");

const form = reactive({
  title: "",
  content: "",
  password: "",
});

const toast = reactive({
  show: false,
  message: "",
});

const sortedPosts = computed(() => {
  return [...posts.value].map((post) => ({
    ...post,
    preview:
      post.content.length > 80
        ? post.content.slice(0, 80) + "..."
        : post.content,
  }));
});

const selectedPost = computed(() => {
  return posts.value.find((post) => post.id === selectedPostId.value) || {};
});

onMounted(async () => {
  await changeSort("latest");
});

async function changeSort(type) {
  sortType.value = type;

  let data = [];

  switch (type) {
    case "latest":
      data = await fetchPost();
      break;

    case "views":
      data = await fetchPostPopular();
      break;

    case "comments":
      data = await fetchPostPopular2();
      break;
  }

  posts.value = mapPosts(data);
}

function mapPosts(data = []) {
  return data.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    views: post.view_count,
    commentCount: post.comment_count,
    createdAt: post.created_at,
    comments: post.comments,
  }));
}

let toastTimer;

function showToast(message) {
  toast.message = message;
  toast.show = true;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.show = false;
  }, 2800);
}

function showCreate() {
  resetForm();
  view.value = "create";
}

async function openDetail(post) {
  const detailData = await fetchPostDetail(post.id);
  const index = posts.value.findIndex((item) => item.id === post.id);

  if (index !== -1) {
    posts.value[index] = {
      ...posts.value[index],
      id: detailData.id,
      title: detailData.title,
      content: detailData.content,
      views: detailData.view_count,
      createdAt: detailData.created_at,
      comments: detailData.comments,
    };
  }

  selectedPostId.value = post.id;
  view.value = "detail";
}

function backToList() {
  resetState();
  view.value = "list";
}

function cancelForm() {
  if (view.value === "edit") {
    view.value = "detail";
    return;
  }

  view.value = "list";
  resetForm();
}

function backToDetail() {
  view.value = "detail";
  errorMessage.value = "";
  passwordCheck.value = "";
}

function requestEdit() {
  passwordCheck.value = "";
  errorMessage.value = "";
  const post = selectedPost.value;
  if (!post) return;

  form.title = post.title;
  form.content = post.content;
  form.password = "";
  view.value = "edit";
}

function requestDelete() {
  passwordCheck.value = "";
  errorMessage.value = "";
  view.value = "confirm";
}

async function verifyPassword() {
  const post = selectedPost.value;
  if (!post) return;
  try {
    await deletePost(post.id, passwordCheck.value);

    await changeSort(sortType.value);
    showToast("게시글이 삭제되었습니다.");
    backToList();
  } catch (err) {
    const status = err.response?.status;

    if (status === 403) {
      errorMessage.value = "비밀번호가 일치하지 않습니다.";
    } else {
      errorMessage.value = "삭제 중 오류가 발생했습니다.";
    }
  }
}

async function submitCreate() {
  const newPost = {
    title: form.title.trim(),
    content: form.content.trim(),
    password: form.password,
  };

 try {
    await createPost(newPost);
    await changeSort(sortType.value);
    showToast("게시글이 등록되었습니다.");
    view.value = "list";
  } catch(err) {
    showToast("등록 중 오류가 발생했습니다.");
  }
}

async function submitEdit() {
  const post = selectedPost.value;

  if (!post) return;

  const updateData = {
    title: form.title.trim(),
    content: form.content.trim(),
    password: form.password,
  };

  try {
    await updatePost(post.id, updateData);
    await changeSort(sortType.value);

    showToast("수정 사항이 저장되었습니다.");
    view.value = "detail";
  } catch (err) {
    const status = err.response?.status;

    if (status === 403) {
      errorMessage.value = "비밀번호가 일치하지 않습니다.";
    } else {
      errorMessage.value = "수정 중 오류가 발생했습니다.";
    }
  }
}

function resetForm() {
  form.title = "";
  form.content = "";
  form.password = "";
}

function resetState() {
  selectedPostId.value = null;
  passwordCheck.value = "";
  errorMessage.value = "";
  resetForm();
}

async function submitComment(comment) {
  try {
    await createComment(selectedPostId.value, comment);
    const detailData = await fetchPostDetail(selectedPostId.value);

    const index = posts.value.findIndex(
      (post) => post.id === selectedPostId.value,
    );

    if (index !== -1) {
      posts.value[index] = {
        ...posts.value[index],
        comments: detailData.comments,
      };
    }

    showToast("댓글이 등록되었습니다.");
  } catch (err) {
    showToast(err);
  }
}

const selectedCategory = ref(categories[0]);

function selectCategory(category) {
  selectedCategory.value = category;
}
</script>
