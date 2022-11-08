import api from "./api";
export function search(uidAndDate,pageNum) {
    return api.post(`/sasa/user/search/${pageNum}`, uidAndDate);
}
export function create(bill) {
    return api.post(`/sasa/user/create`, bill);
}