import jwtDecode from "jwt-decode";
import http from "../services/httpService";

const API_URL = process.env.REACT_APP_API_URL;

// token key
const tokenKey = "token";

http.setJwt(getJwt());

export async function loginUser(email, password) {
  const { data: token } = await http.post(API_URL + "auth", {
    email,
    password,
  });

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

export function changePassword(token, user) {
  return http.post(API_URL + "auth/change-password/" + token, user);
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  loginUser,
  logout,
  getCurrentUser,
  changePassword,
  loginWithJwt,
  getJwt,
};
