import React from "react";
import Employees from "../employees/Employees.jsx";
import EmployeesDocuments from "../employees/EmployeeDocuments.jsx";
import Tabs from "../common/useTabs";

const tabs = [
  {
    label: "Employee basic info",
    Component: <Employees />,
  },
  {
    label: "Employee documents",
    Component: <EmployeesDocuments />,
  },
  {
    label: "Other information",
    Component: <p>hi</p>,
  },
];
const EmployeeRecords = ({ user }) => {
  // console.log(user);

  return <Tabs tabs={tabs} />;
};

export default EmployeeRecords;
