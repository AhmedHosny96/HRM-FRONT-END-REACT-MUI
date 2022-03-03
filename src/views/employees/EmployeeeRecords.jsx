import React from "react";
import Employees from "../employees/Employees.jsx";
import OtherRecords from "../employees/OtherRecords";
import EmployeesDocuments from "../employees/EmployeeDocuments.jsx";
import Tabs from "../common/useTabs";

const EmployeeRecords = ({ user }) => {
  // console.log(user);
  const tabs = [
    {
      label: "Employee basic info",
      Component: <Employees user={user} />,
    },
    {
      label: "Employee documents",
      Component: <EmployeesDocuments user={user} />,
    },
    {
      label: "Other information",
      Component: <OtherRecords user={user} />,
    },
  ];
  return <Tabs tabs={tabs} />;
};

export default EmployeeRecords;
