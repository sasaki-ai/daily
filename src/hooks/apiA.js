import axios from 'axios'
const apiA = axios.create()

apiA.interceptors.request.use(
    config => {
        if (localStorage.getItem('tokenA')) {
            config.headers.tokenA = localStorage.getItem('tokenA');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)
export default apiA