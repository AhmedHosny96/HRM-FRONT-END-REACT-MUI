import http from "./httpService";
const api = "http://localhost:5000/api/leaves/";

export function getLeaves() {
  return http.get(api);
}

// export function getActiveBranches() {
//   return http.get(api + "open");
// }

export function getLeave(id) {
  return http.get(api + "/" + id);
}

export function saveLeave(leaves) {
  if (leaves._id) {
    const body = { ...leaves };
    delete body._id;
    //update
    return http.put(api + "/" + leaves._id, body);
  }
  return http.post(api, leaves);
}

export function deleteLeave(id) {
  return http.delete(api + "/" + id);
}
