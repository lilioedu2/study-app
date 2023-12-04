import axios from 'axios';

export function configureAxios() {
  axios.interceptors.response.use(
    response => {
      if (response.data.error === 'Token inválido') {
        localStorage.removeItem('token');
        window.location.href = '/login'
      }
      return response;
    },
  );
}
