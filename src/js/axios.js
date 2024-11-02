
import axios from 'axios';

/**
 * @brief 创建Axios实例，并配置url选项和请求超时参数
 * */


const axiosInstance = axios.create({
    // baseURL: `http://localhost:8081/api`,
    baseURL: '/api',
    timeout: 5000,
    // proxy:{
    //     protocol: 'http',
    //     port: 80,
    //     host: "http://localhost" // 代理服务器地址
    // },
    // withCredentials: true
});

/**
 * @brief 添加请求拦截器，设置请求前的动作，设置请求错误的动作
 * */

axiosInstance.interceptors.request.use(
    config => {

        const token = sessionStorage.getItem('token');
        console.log("请求中的token"+token)
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

        // const token = response.headers['token'];
        // if (token) {
        //     sessionStorage.setItem('token', token);
        // }
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