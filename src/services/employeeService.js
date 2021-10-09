import http from './httpService'

const URL = 'http://localhost:5000/api/employees/'

export function getEmployees() {
  return http.get(URL)
}

export function getEmployee(id) {
  return http.get(URL + '/' + id)
}
export function saveEmployee(employee) {
  if (employee._id) {
    const body = { ...employee }
    delete body._id
    return http.put(URL + '/' + employee._id, body)
  }
  return http.post(URL, employee)
}

export function deleteEmployee(id) {
  return http.delete(URL + '/' + id)
}
