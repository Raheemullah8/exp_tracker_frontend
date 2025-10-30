import api from './axiosConfig';

// Income endpoints assumed under /api/income
export const createIncome = async (payload) => {
  try {
    // backend expects POST /api/income/add
    const res = await api.post('/income/add', payload);
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

export const getIncomes = async (params) => {
  try {
    // backend exposes GET /api/income/get
    const res = await api.get('/income/get', { params });
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

// NOTE: backend currently exposes DELETE /api/income/:id — keep delete
export const deleteIncome = async (id) => {
  try {
    const res = await api.delete(`/income/${id}`);
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

export const downloadIncome = async (params) => {
  try {
    const res = await api.get('/income/download', { params });
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

export default {
  createIncome,
  getIncomes,
  deleteIncome,
  downloadIncome,
};
