import http from "../services/httpService";

const api = "http://localhost:5000/api/login";

export async function loginUser(email, password) {
  await http.post(api, { email, password });
}
