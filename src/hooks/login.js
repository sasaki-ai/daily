import api from "./api";
export function userLogin(user) {
    return api.post('login/user', user)
}
export function adminLogin(admin) {
    return api.post('login/admin', admin)
}
