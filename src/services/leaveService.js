import http from "./httpService";
const api = "http://localhost:5000/api/leaves";

export function getLeaves() {
  return http.get(api);
}

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

const URL = "http://localhost:5000/api/employee/leave";

export function getLeaveRequests() {
  return http.get(URL);
}

export function getLeaveRequest(id) {
  return http.get(URL + "/" + id);
}

export function saveLeaveRequest(leaveRequest) {
  if (leaveRequest._id) {
    const body = { ...leaveRequest };
    delete body._id;
    //update
    return http.put(URL + "/" + leaveRequest._id, body);
  }
  return http.post(URL, leaveRequest);
}
export function deleteLeaveRequest(id) {
  return http.delete(URL + "/" + id);
}
