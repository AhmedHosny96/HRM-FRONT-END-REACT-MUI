import http from "./httpService";

const API_URL = process.env.REACT_APP_API_URL;

export function getEmployees() {
  return http.get(API_URL + "employees");
}

export function getActiveEmployees() {
  return http.get(API_URL + "employees/active");
}

export function getEmployee(id) {
  return http.get(API_URL + "employees/" + id);
}
export function saveEmployee(employee) {
  if (employee._id) {
    const body = { ...employee };
    delete body._id;
    return http.put(API_URL + "employees/" + employee._id, body);
  }
  return http.post(API_URL + "employees/", employee);
}

export function deleteEmployee(id) {
  return http.delete(API_URL + "employees/" + id);
}

export function getEmployeeByBranch(id) {
  return http.get(API_URL + "employee/branch/" + id);
}

// OTHER EMPLOYEE INFO

export function getEmployeesOtherInfo() {
  return http.get(API_URL + "employee/otherInfo");
}

export function saveEmployeeOtherInfo(employee) {
  if (employee._id) {
    const body = { ...employee };
    delete body._id;
    delete body.employee;
    delete body.createdAt;
    delete body.updatedAt;
    delete body.__v;
    return http.put(API_URL + "employee/otherInfo/" + employee._id, body);
  }
  return http.post(API_URL + "employee/otherInfo", employee);
}

export function deleteEmployeeOtherInfo(id) {
  return http.delete(API_URL + "employee/otherInfo/" + id);
}
