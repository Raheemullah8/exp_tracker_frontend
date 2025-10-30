import api from './axiosConfig';

// Expense endpoints assumed under /api/expense
export const createExpense = async (payload) => {
  try {
    // backend expects POST /api/expense/add
    const res = await api.post('/expense/add', payload);
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

export const getExpenses = async (params) => {
  try {
    // backend exposes GET /api/expense/get
    const res = await api.get('/expense/get', { params });
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

export const deleteExpense = async (id) => {
  try {
    const res = await api.delete(`/expense/${id}`);
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

export const downloadExpense = async (params) => {
  try {
    const res = await api.get('/expense/download', { params });
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

export default {
  createExpense,
  getExpenses,
  deleteExpense,
  downloadExpense,
};
