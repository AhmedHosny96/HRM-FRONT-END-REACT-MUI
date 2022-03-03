import React from "react";
import PropTypes from "prop-types";
import Medical from "./Medical";
import MedicalRequests from "./MedicalRequests.jsx";
import Tabs from "../common/useTabs";

const MedicalRecords = ({ user }) => {
  const tabs = [
    {
      label: "Medical details",
      Component: <Medical user={user} />,
    },
    {
      label: "Medical expense request",
      Component: <MedicalRequests user={user} />,
    },
    {
      label: "Other information",
      Component: <p>hi</p>,
    },
  ];
  return <Tabs tabs={tabs} />;
};

export default MedicalRecords;
