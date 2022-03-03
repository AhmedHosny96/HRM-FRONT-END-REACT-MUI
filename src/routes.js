/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons

import {
  Dashboard,
  LibraryBooks,
  HomeWork,
  Work,
  TimeToLeave,
  SupervisorAccount,
  LocalHospital,
} from "@material-ui/icons";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import EmployeeRecords from "views/employees/EmployeeeRecords";
import Branches from "views/branches/Branches";
import JobsRecruitments from "views/jobs/JobsRecruitments";
import LeaveRecords from "views/leaves/LeaveRecords";
import Users from "views/users/users";
import MedicalRecords from "./views/medical/MedicalRecords";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/employees",
    name: "Employees",
    icon: LibraryBooks,
    component: EmployeeRecords,
    layout: "/admin",
  },
  {
    path: "/branches",
    name: "Branches",
    icon: HomeWork,
    component: Branches,
    layout: "/admin",
  },
  {
    path: "/jobs",
    name: "Job & recruitements",
    icon: Work,
    component: JobsRecruitments,
    layout: "/admin",
  },
  {
    path: "/leaves",
    name: "Leave Management",
    icon: TimeToLeave,
    component: LeaveRecords,
    layout: "/admin",
  },
  {
    path: "/medical",
    name: "Medical expense ",
    icon: LocalHospital,
    component: MedicalRecords,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Users",
    icon: SupervisorAccount,
    component: Users,
    layout: "/admin",
  },
];

export default dashboardRoutes;
