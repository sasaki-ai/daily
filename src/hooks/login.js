import api from "./api";
import apiA from "./apiA.js";
export function userLogin(user) {
    return api.post(`/sasa/login/user`, user)
}
export function adminLogin(admin) {
    return apiA.post(`/sasa/login/admin`, admin)
}
