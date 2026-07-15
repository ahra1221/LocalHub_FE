import api from "./client";

export const getBannerView = () => api.get("/banner/view").then((r) => r.data);
export const getBannerPlay = () => api.get("/banner/play").then((r) => r.data);

export const fetchPost = () => api.get("/posts").then((r) => r.data);
export const fetchPostPopular = () =>
  api.get("/posts/popular").then((r) => r.data);
export const fetchPostPopular2 = () =>
  api.get("/posts/popular2").then((r) => r.data);
export const fetchPostDetail = (id) =>
  api.get(`/posts/${id}`).then((r) => r.data);
export const createPost = (content) =>
  api.post("/posts", content).then((r) => r.data);
export const updatePost = (id, payload) =>
  api.put(`/posts/${id}`, payload).then((r) => r.data);
export const deletePost = (id, password) =>
  api
    .delete(`/posts/${id}`, {
      data: {
        password,
      },
    })
    .then((r) => r.data);

export const fetchChat = (message) =>
  api
    .post("/chat", {
      message,
    })
    .then((r) => r.data);

export function createComment(postId, content) {
  return api.post(`/posts/${postId}/comments`, content);
}

export const fetchCategory = (contentType) =>
  api.get(`/place/${contentType}`).then((r) => r.data);
