import React from "react";
import PropTypes from "prop-types";
import Medical from "./Medical";
import MedicalRequests from "./MedicalRequests.jsx";
import Tabs from "../common/useTabs";

const tabs = [
  {
    label: "Medical details",
    Component: <Medical />,
  },
  {
    label: "Employee medical expense request",
    Component: <MedicalRequests />,
  },
  {
    label: "Other information",
    Component: <p>hi</p>,
  },
];

const MedicalRecords = () => {
  return <Tabs tabs={tabs} />;
};

export default MedicalRecords;
