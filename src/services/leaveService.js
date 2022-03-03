import http from "./httpService";

const API_URL = process.env.REACT_APP_API_URL;

export function getLeaves() {
  return http.get(API_URL + "leaves");
}

export function getLeave(id) {
  return http.get(API_URL + "leaves/" + id);
}

export function saveLeave(leaves) {
  if (leaves._id) {
    const body = { ...leaves };
    delete body._id;
    //update
    return http.put(API_URL + "leaves/" + leaves._id, body);
  }
  return http.post(API_URL + "leaves", leaves);
}

export function deleteLeave(id) {
  return http.delete(API_URL + "leaves/" + id);
}

export function getLeaveRequests() {
  return http.get(API_URL + "employee/leave");
}

export function getLeaveRequest(id) {
  return http.get(API_URL + "employee/leave/" + id);
}

export function saveLeaveRequest(leaveRequest) {
  if (leaveRequest._id) {
    const body = { ...leaveRequest };
    delete body._id;
    delete body.employee;
    delete body.leave;
    delete body.requestedDays;
    delete body.__v;
    //update
    return http.put(API_URL + "employee/leave/" + leaveRequest._id, body);
  }
  return http.post(API_URL + "employee/leave", leaveRequest, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export function deleteLeaveRequest(id) {
  return http.delete(API_URL + "employee/leave/" + id);
}
