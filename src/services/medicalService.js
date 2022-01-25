import http from "./httpService";
const api = "http://localhost:5000/api/medicalExpenses";

export function getMedicals() {
  return http.get(api);
}

export function saveMedical(medical) {
  if (medical._id) {
    const body = { ...medical };
    delete body._id;
    //update
    return http.put(api + "/" + medical._id, body);
  }
  return http.post(api, medical);
}

export function deleteMedical(id) {
  return http.delete(api + "/" + id);
}

const URL = "http://localhost:5000/api/employee/medicalExpenseRequest/";
export function getMedicalRequests() {
  return http.get(URL);
}

export function saveMedicalRequest(medical) {
  if (medical._id) {
    const body = { ...medical };
    delete body._id;
    //update
    return http.put(URL + "/" + medical._id, body);
  }
  return http.post(URL, medical);
}

export function deletMedicalRequest(id) {
  return http.delete(URL + "/" + id);
}
