import http from "./httpService";

const API_URL = process.env.REACT_APP_API_URL;

export function getMedicals() {
  return http.get(API_URL + "medicalExpenses");
}

export function saveMedical(medical) {
  if (medical._id) {
    const body = { ...medical };
    delete body._id;
    //update
    return http.put(API_URL + "medicalExpenses/" + medical._id, body);
  }
  return http.post(API_URL + "medicalExpenses", medical);
}

export function deleteMedical(id) {
  return http.delete(API_URL + "medicalExpenses/" + id);
}

export function getMedicalRequests() {
  return http.get(API_URL + "employee/medicalExpenseRequest");
}

export function saveMedicalRequest(medical) {
  if (medical._id) {
    const body = { ...medical };
    delete body._id;
    //update
    return http.put(
      API_URL + "employee/medicalExpenseRequest/" + medical._id,
      body
    );
  }
  return http.post(API_URL + "employee/medicalExpenseRequest", medical);
}

export function deletMedicalRequest(id) {
  return http.delete(API_URL + "employee/medicalExpenseRequest/" + id);
}
