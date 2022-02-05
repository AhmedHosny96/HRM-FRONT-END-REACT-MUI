import jwtDecode from "jwt-decode";
import http from "../services/httpService";

const api = "http://localhost:5000/api/auth";

// token key
const tokenKey = "token";

export async function loginUser(email, password) {
  const { data: token } = await http.post(api, { email, password });

  localStorage.setItem(tokenKey, token);
}

// log out
export function logout() {
  //logging out by removing the token key in the local storage
  localStorage.removeItem(tokenKey);
}

// login with jwt

// get current logged in user

export function getCurrentUser() {
  try {
    // getting the token key in the local storage
    const token = localStorage.getItem(tokenKey);
    // decoding the payload and getting the logged in user name

    return jwtDecode(token);
  } catch (ex) {
    return null;
  }
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
  window.location = "/admin/dashboard";
}

export function changePassword(id, user) {
  return http.post(api + "/change-password/" + id, user);
}

export default {
  loginUser,
  logout,
  getCurrentUser,
  changePassword,
  loginWithJwt,
};
