import http from "./httpService";

const API_URL = process.env.REACT_APP_API_URL;

//get user by id
export function getUser(id) {
  return http.get(API_URL + "auth/create/" + id);
}

//signing up users
export function saveUser(user) {
  if (user._id) {
    const body = { ...user };
    delete body.employee;
    delete body._id;
    delete body.password;
    delete body.firstLogin;
    delete body.__v;
    return http.put(API_URL + "users/" + user._id, body);
  }
  // return http.post(API_URL + "/" + id + "/" + token, user) || http.post(API_URL, user);
  return http.post(API_URL + "auth/create", user);
}

// reset user password

export function resetPassword(id) {
  return http.post(API_URL + "auth/reset-password/" + id);
}

//fetching all users

export function getUsers() {
  return http.get(API_URL + "users");
}
export function getAdminUsers() {
  return http.get(API_URL + "users/admin");
}
export function deleteUser(id) {
  return http.delete(API_URL + "users/" + id);
}
