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
  Language,
  Unarchive,
  Dashboard,
  LibraryBooks,
  Notifications,
  HomeWork,
  Work,
  TimeToLeave,
  SupervisorAccount,
} from "@material-ui/icons";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";
// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";
import Employees from "views/employees/employees";
import Branches from "views/branches/branches";
import Jobs from "views/jobs/jobs";
import Leaves from "views/leaves/leaves";
import Users from "views/users/users";
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
    component: Employees,
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
    name: "Job Details",
    icon: Work,
    component: Jobs,
    layout: "/admin",
  },
  {
    path: "/leaves",
    name: "Leave Management",
    icon: TimeToLeave,
    component: Leaves,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Users",
    icon: SupervisorAccount,
    component: Users,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    rtlName: "إخطارات",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/admin",
  },
  {
    path: "/rtl-page",
    name: "RTL Support",
    rtlName: "پشتیبانی از راست به چپ",
    icon: Language,
    component: RTLPage,
    layout: "/rtl",
  },
  {
    path: "/upgrade-to-pro",
    name: "Upgrade To PRO",
    rtlName: "التطور للاحترافية",
    icon: Unarchive,
    component: UpgradeToPro,
    layout: "/admin",
  },
];

export default dashboardRoutes;
