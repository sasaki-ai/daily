import api from "./api";
export function paying(uidAndDate) {
    return api.post('user/paying', uidAndDate);
}