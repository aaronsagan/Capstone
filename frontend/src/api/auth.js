import http from './http';

export const login = async (email, password) => {
  const { data } = await http.post('/auth/login', { email, password });
  return data; // { token, user? } depending on your controller
};

export const me = async () => {
  const { data } = await http.get('/me');
  return data; // user object
};

export const logout = async () => {
  await http.post('/auth/logout'); // ignores errors
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};
