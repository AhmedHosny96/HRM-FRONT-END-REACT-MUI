import http from "./httpService";

const api = "http://localhost:5000/api/users";

export function getUsers() {
  return http.get(api);
}

export function getUser(id) {
  return http.get(api + "/" + id);
}
export function saveUser(user) {
  if (user._id) {
    const { body } = { ...user };
    delete body._id;
    return http.put(api + "/" + user._id, body);
  }

  // return http.post(api + "/" + id + "/" + token, user) || http.post(api, user);
  return http.post(api, user);
}

export function deleteUser(id) {
  return http.delete(api + "/" + id);
}
