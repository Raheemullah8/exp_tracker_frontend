import api from './axiosConfig';

// 🧠 Fetch Dashboard Data
const getDashboard = async () => {
  try {
    // Protected route -> token auto-added by axios interceptor (in axiosConfig)
    const res = await api.get('/dashboard');
    return res.data; // ✅ Directly returning parsed data
  } catch (err) {
    console.error('Dashboard API Error:', err);
    // Server-side message return
    throw err?.response?.data?.message || 'Failed to load dashboard data';
  }
};

export default {
  getDashboard,
};
