import React from "react";
import Leaves from "./Leaves.jsx";
import LeaveRequests from "./LeaveRequests.jsx";
import Tabs from "../common/useTabs";

export default function JobsRecruitments({ user }) {
  const tabs = [
    {
      label: "Leave details",
      Component: <Leaves user={user} />,
    },
    {
      label: "Employee leave request",
      Component: <LeaveRequests user={user} />,
    },
  ];
  return <Tabs tabs={tabs} />;
}
