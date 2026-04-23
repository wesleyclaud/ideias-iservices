import api, { setAccessToken } from './api';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  setAccessToken(data.accessToken);
  return data;
};

export const logout = async () => {
  await api.post('/auth/logout');
  setAccessToken(null);
};

export const refresh = async () => {
  const { data } = await api.post('/auth/refresh');
  setAccessToken(data.accessToken);
  return data;
};
