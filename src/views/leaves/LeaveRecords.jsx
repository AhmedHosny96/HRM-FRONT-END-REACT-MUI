import React from "react";
import Leaves from "./Leaves.jsx";
import LeaveRequests from "./LeaveRequests.jsx";
import Tabs from "../common/useTabs";

const tabs = [
  {
    label: "Leave details",
    Component: <Leaves />,
  },
  {
    label: "Employee leave request",
    Component: <LeaveRequests />,
  },
];

export default function JobsRecruitments() {
  return <Tabs tabs={tabs} />;
}
