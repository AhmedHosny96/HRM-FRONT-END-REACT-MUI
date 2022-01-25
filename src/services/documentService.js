import http from "./httpService";
const api = "http://localhost:5000/api/employee/documents";

export function getDocuments() {
  return http.get(api);
}

export function getDocumentByEmployee(id) {
  return http.get(api + "/" + id);
}

export function saveDocument(document) {
  if (document._id) {
    const body = { ...document };
    delete body._id;
    //update
    return http.put(api + "/" + document._id, body);
  }
  return http.post(api, document);
}

export function deleteDocument(id) {
  return http.delete(api + "/" + id);
}
