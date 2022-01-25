import http from "./httpService";
const api = "http://localhost:5000/api/jobs";

export function getJobs() {
  return http.get(api);
}

export function saveJob(job) {
  if (job._id) {
    const body = { ...job };
    delete body._id;
    //update
    return http.put(api + "/" + job._id, body);
  }
  return http.post(api, job);
}

export function deleteJob(id) {
  return http.delete(api + "/" + id);
}
