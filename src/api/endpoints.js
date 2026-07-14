import api from './client'

// Use leading slash so baseURL concatenation is correct.
// If VITE_API_BASE_URL is set to e.g. 'http://localhost:8000', this requests '/banner/view' on that host.
export const getBannerView = () => api.get('/banner/view').then(r => r.data)
export const getBannerPlay = () => api.get('/banner/play').then(r => r.data)

// export const fetchPosts = () => api.get('api/posts').then(r => r.data)
// export const fetchPost = id => api.get(`api/posts/${id}`).then(r => r.data)
// export const createPost = payload => api.post('api/posts', payload).then(r => r.data)
// export const updatePost = (id, payload) => api.put(`api/posts/${id}`, payload).then(r => r.data)
// export const deletePost = id => api.delete(`api/posts/${id}`).then(r => r.data)
