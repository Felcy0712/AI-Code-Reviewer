import axios from "axios";

const api = axios.create({
 baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

console.log("API URL:", import.meta.env.VITE_API_URL);

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

/*
|--------------------------------------------------------------------------
| Projects
|--------------------------------------------------------------------------
*/

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats");
  return response.data;
};

/*
|--------------------------------------------------------------------------
| Upload
|--------------------------------------------------------------------------
*/

export const uploadProject = async (formData) => {
  const response = await api.post("/upload", formData);
  return response.data;
};

/*
|--------------------------------------------------------------------------
| Reviews
|--------------------------------------------------------------------------
*/

export const getReview = async (reviewId) => {
  const response = await api.get(`/review/${reviewId}`);
  return response.data;
};

export const getReviews = async () => {
  const response = await api.get("/reviews");
  return response.data;
};

export default api;