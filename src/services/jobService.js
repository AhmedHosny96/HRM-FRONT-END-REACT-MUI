import http from "./httpService";

const API_URL = process.env.REACT_APP_API_URL;

export function getJobs() {
  return http.get(API_URL + "jobs");
}

export function saveJob(job) {
  if (job._id) {
    const body = { ...job };
    delete body._id;
    //update
    return http.put(API_URL + "jobs/" + job._id, body);
  }
  return http.post(API_URL + "jobs", job);
}

export function deleteJob(id) {
  return http.delete(API_URL + "jobs/" + id);
}
