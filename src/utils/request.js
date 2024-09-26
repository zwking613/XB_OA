import axios from 'axios'
import router from '@/router'

const request = axios.create({
    baseURL: '/api',
    timeout: 50000
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 可以在这里添加 token 等通用逻辑
        // 让请求自动携带cookie
        const token = localStorage.getItem('token');
        
        // 如果token存在，将其添加到请求头中
        if (token) {
            config.headers['token'] = token;
        }
        return config
    },
    error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        const { status, data } = response;
        switch (status) {
            case 200:
                // 请求成功
                return data;
            case 201:
                // 创建成功
                return data;
            case 204:
                // 删除成功
                return data;
            default:
                // 其他状态码
                console.error('Unexpected status:', status, data);
                ElMessage.error('未知错误，请联系管理员');
                throw new Error('未知错误，请联系管理员');
        }
    },
    error => {
        if (!error.response) {
            console.log(error);
            ElMessage.error('未知错误，请联系管理员');
            throw new Error('未知错误，请联系管理员');
        }
        switch (error.response.status) {
            case 400:
                // 请求错误
                console.error('Bad Request:', error.response.data);
                ElMessage.error('请求错误，请检查输入');
                throw new Error('请求错误，请检查输入');
            case 401:
                // 未授权，可能是未登录或token过期
                console.error('Unauthorized:', error.response.data);
                if (router.currentRoute.value.path !== '/login') {
                    router.push('/login');  // 重定向到登录页面
                }
                localStorage.removeItem('token');
                ElMessage.error('未授权，请重新登录');
                throw new Error('未授权，请重新登录');
            case 403:
                // 禁止访问
                console.error('Forbidden:', error.response.data);
                ElMessage.error('禁止访问该资源');
                throw new Error('禁止访问该资源');
            case 404:
                // 资源不存在
                console.error('Not Found:', error.response.data);
                ElMessage.error('请求的资源不存在');
                throw new Error('请求的资源不存在');
            case 500:
                // 服务器错误
                console.error('Internal Server Error:', error.response.data);
                ElMessage.error(error.response.data.message || '服务器错误，请稍后再试');
                throw new Error('服务器错误，请稍后再试');
            default:
                // 其他状态码
                console.error('Unexpected status:', error.response.status, error.response.data);
                ElMessage.error('未知错误，请联系管理员');
                throw new Error('未知错误，请联系管理员');
        }
    }
)

// 封装 GET 请求
export function get(url, params = {}) {
    return request({
        method: 'get',
        url,
        params,
        responseType: 'blob'
    })
}

// 封装 POST 请求
export function post(url, data = {}) {
    return request({
        method: 'post',
        url,
        data: toFormData(data),
    })
}

// 封装 PUT 请求
export function put(url, data = {}) {
    const formData = new FormData()
    for (const key in data) {
        formData.append(key, data[key])
    }
    return request({
        method: 'put',
        url,
        data: formData,
        header: { 'Content-Type': 'multipart/form-data' }
    })
}

// 封装 DELETE 请求
export function del(url, params = {}) {
    return request({
        method: 'delete',
        url,
        params
    })
}

const toFormData = (data) => {
    const formData = new FormData();
    for (const name in data) {
        if ({}.hasOwnProperty.call(data, name)) {
            let param = data[name];
            if (param || param === 0 || param === false) {
                if (param.constructor === Array) {
                    let file = false;
                    param.forEach(v => {
                        if (v.constructor === File) {
                            formData.append(name, v);
                            file = true;
                        }
                    })
                    if (!file) {
                        formData.append(name, param.join());
                    }
                } else if (typeof param === 'object') {
                    if (Object.keys(param).length) {
                        param = JSON.stringify(data[name]);
                        formData.append(name, param);
                    }
                } else {
                    formData.append(name, param);
                }
            }
        }
    }
    return formData;
}

// 导出 request 实例
export default request