import http from "./httpService";
const api = "http://localhost:5000/api/jobs";

export function getJobs() {
  return http.get(api);
}

export function saveJob(job) {
  return http.post(api, job);
}
