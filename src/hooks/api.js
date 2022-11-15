import { http } from "@tauri-apps/api";

class api {
    constructor() {
        this.token = '';
        this.tokenA = '';
        if (localStorage.getItem("tokenA")) {
            this.token = localStorage.getItem("tokenA");
        }
        if (localStorage.getItem("token")) {
            this.tokenA = localStorage.getItem("token");
        } 
    }

    get = (url, data) => {
        return http.fetch("http://www.redmove.top/" + url, {
            headers: {
                token: this.token,
                tokena: this.tokenA
            },
            method: 'GET',
            // get请求的参数值必须为字符串
            query: data
        })
    }

    post = (url, data) => {
        return http.fetch("http://www.redmove.top/" + url, {
            headers: {
                token: this.token,
                tokena: this.tokenA
            },
            method: 'POST',
            // 常规的json格式请求体发送
            body: http.Body.json(data)
        })
    }

    put = (url, data) => {
        return http.fetch("http://www.redmove.top/" + url, {
            headers: {
                token: this.token,
                tokena: this.tokenA
            },
            method: 'PUT',
            // 常规的json格式请求体发送
            body: http.Body.json(data)
        })
    }

    delete = (url, data) => {
        return http.fetch("http://www.redmove.top/" + url, {
            headers: {
                token: this.token,
                tokena: this.tokenA
            },
            method: 'Delete',
            // 常规的json格式请求体发送
            body: http.Body.json(data)
        })
    }

}
export default new api()
