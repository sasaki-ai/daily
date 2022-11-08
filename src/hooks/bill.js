import api from "./api";
export function paying(uidAndDate) {
    return api.post(`/sasa/user/paying`, uidAndDate);
}