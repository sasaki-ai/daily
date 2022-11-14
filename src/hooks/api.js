import { http } from "@tauri-apps/api";

class api {
    constructor() {
        if (localStorage.getItem("token")) {
            this.token = localStorage.getItem("token");
        } else if (localStorage.getItem("tokenA")) {
            this.token = localStorage.getItem("tokenA");
        } else {
            this.token = '';
        }
    }

    get = (url, data) => {
        return http.fetch("http://www.redmove.top/" + url, {
            headers: {
                token: this.token
            },
            method: 'GET',
            // get请求的参数值必须为字符串
            query: data
        })
    }

    post = (url, data) => {
        return http.fetch("http://www.redmove.top/" + url, {
            headers: {
                token: this.token
            },
            method: 'POST',
            // 常规的json格式请求体发送
            body: http.Body.json(data)
        })
    }

    put = (url, data) => {
        return http.fetch("http://www.redmove.top/" + url, {
            headers: {
                token: this.token
            },
            method: 'PUT',
            // 常规的json格式请求体发送
            body: http.Body.json(data)
        })
    }

    delete = (url, data) => {
        return http.fetch("http://www.redmove.top/" + url, {
            headers: {
                token: this.token
            },
            method: 'Delete',
            // 常规的json格式请求体发送
            body: http.Body.json(data)
        })
    }

}
export default new api()
