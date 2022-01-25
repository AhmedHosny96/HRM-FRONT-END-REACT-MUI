import http from "./httpService";
const api = "http://localhost:5000/api/recruitments/";

export function getRecruitments() {
  return http.get(api);
}

export function getRecruitment(id) {
  return http.get(api + "/" + id);
}

export function saveRecruitment(recruitment) {
  if (recruitment._id) {
    const body = { ...recruitment };
    delete body._id;
    //update
    return http.put(api + "/" + recruitment._id, body);
  }
  return http.post(api, recruitment);
}

export function deleteRecruitment(id) {
  return http.delete(api + "/" + id);
}
