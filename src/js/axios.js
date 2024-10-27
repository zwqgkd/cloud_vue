
import axios from 'axios';

/**
 * @brief 创建Axios实例，并配置url选项和请求超时参数
 * */

const BASE_URL = "localhost"

const axiosInstance = axios.create({
    baseURL: `http://${BASE_URL}:8081/`,
    timeout: 5000,
});

/**
 * @brief 添加请求拦截器，设置请求前的动作，设置请求错误的动作
 * */

axiosInstance.interceptors.request.use(
    config => {

        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['token'] = token;
        }
        return config;
    },
    error => {

        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    response => {

        const token = response.headers['token'];
        if (token) {
            sessionStorage.setItem('token', token);
        }
        // 先解析一层数据
        return response;
    },
    error => {

        if (error.response.status === 401) {

            console.log("401返回")
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;