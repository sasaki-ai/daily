import api from "./api";
export function search(uidAndDate,pageNum) {
    return api.post(`user/search/${pageNum}`, uidAndDate);
}
export function create(bill) {
    return api.post('user/create', bill);
}