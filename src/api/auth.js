import api from './axiosConfig';

// Assumptions: backend auth routes are mounted under /api/auth
// Common endpoints (adjust if your backend differs):
// POST /auth/register  -> register user
// POST /auth/login     -> login user (returns cookies / token)
// POST /auth/logout    -> logout (invalidate cookie/token)
// GET  /auth/me        -> get current user/profile

export const signup = async (payload) => {
  try {
    const res = await api.post('/auth/register', payload);
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

export const login = async (payload) => {
  try {
    const res = await api.post('/auth/login', payload);
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

export const logout = async () => {
  try {
    const res = await api.post('/auth/logout');
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

// Server exposes GET /api/auth/users (protected)
export const getUser = async () => {
  try {
    const res = await api.get('/auth/users');
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

export default {
  signup,
  login,
  logout,
  getUser,
};
