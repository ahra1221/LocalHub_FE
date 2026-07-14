import api from './client'

export const getBannerView = () => api.get('/banner/view').then(r => r.data)
export const getBannerPlay = () => api.get('/banner/play').then(r => r.data)

export const fetchPost = () => api.get('/posts').then(r => r.data)
export const fetchPostDetail = id => api.get(`/posts/${id}`).then(r => r.data)
export const createPost = content => api.post('/posts', content).then(r => r.data)
export const updatePost = (id, payload) => api.put(`/posts/${id}`, payload).then(r => r.data)
export const deletePost = (id, password) =>
  api.delete(`/posts/${id}`, {
    data: {
      password
    }
  }).then(r => r.data)
