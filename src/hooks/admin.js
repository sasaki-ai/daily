import apiA from "./apiA.js";
export function getConfirmBills() {
    return apiA.get(`/sasa/admin/noBills`)
}
export function confirmBills(bids) {
    return apiA.put(`/sasa/admin/confirm`,bids)
}
export function delBills(bids) {
    return apiA.delete(`/sasa/admin/cancel`,{data: bids})
}