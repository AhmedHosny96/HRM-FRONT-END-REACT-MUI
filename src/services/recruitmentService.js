import http from "./httpService";

const API_URL = process.env.REACT_APP_API_URL;

export function getRecruitments() {
  return http.get(API_URL + "recruitments");
}

export function getRecruitment(id) {
  return http.get(API_URL + "recruitments/" + id);
}

export function saveRecruitment(recruitment) {
  if (recruitment._id) {
    const body = { ...recruitment };
    delete body._id;
    delete body.createdAt;
    //update
    return http.put(API_URL + "recruitments/" + recruitment._id, body);
  }
  return http.post(API_URL + "recruitments", recruitment);
}

export function deleteRecruitment(id) {
  return http.delete(API_URL + "recruitments/" + id);
}
