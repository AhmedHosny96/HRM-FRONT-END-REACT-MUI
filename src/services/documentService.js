import http from "./httpService";

const API_URL = process.env.REACT_APP_API_URL;

export function getDocuments() {
  return http.get(API_URL + "employee/documents");
}

export function getDocumentByEmployee(id) {
  return http.get(API_URL + "employee/documents/" + id);
}

export function saveDocument(document) {
  if (document._id) {
    const body = { ...document };
    delete body._id;
    //update
    return http.put(API_URL + "employee/documents/" + document._id, body);
  }
  return http.post(API_URL + "employee/documents", document);
}

export function deleteDocument(id) {
  return http.delete(API_URL + "employee/documents/" + id);
}
