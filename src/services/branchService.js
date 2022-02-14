import http from "./httpService";

const API_URL = process.env.REACT_APP_API_URL;

export function getBranches() {
  return http.get(API_URL + "branches");
}

export function getActiveBranches() {
  return http.get(API_URL + "branches/" + "open");
}

export function getBranch(id) {
  return http.get(API_URL + "branches/" + id);
}

export function saveBranch(branch) {
  if (branch._id) {
    const body = { ...branch };
    delete body._id;
    //update
    return http.put(API_URL + "branches/" + branch._id, body);
  }
  return http.post(API_URL + "branches", branch);
}

export function deleteBranch(id) {
  return http.delete(API_URL + "branches/" + id);
}
