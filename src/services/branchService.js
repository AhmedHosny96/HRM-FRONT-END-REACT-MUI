import http from "./httpService";
const api = "http://localhost:5000/api/branches/";

export function getBranches() {
  return http.get(api);
}

export function getBranch(id) {
  return http.get(api + "/" + id);
}

export function saveBranch(branch) {
  return http.post(api, branch);
}

export function deleteBranch(id) {
  return http.delete(api + "/" + id);
}
