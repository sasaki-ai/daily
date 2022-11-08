import axios from 'axios'
const api = axios.create()

api.interceptors.request.use(
    config => {
        if (localStorage.getItem('token')) {
            config.headers.token = localStorage.getItem('token');
        }else if (localStorage.getItem('tokenA')) {
            config.headers.token = localStorage.getItem('tokenA');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)
export default api
