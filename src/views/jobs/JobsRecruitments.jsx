import React from "react";
// import { Box, Typography, Tabs, Tab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Jobs from "../jobs/Jobs.jsx";
import Recruitments from "./Recruitments.jsx";
import Tabs from "../common/useTabs";

const tabs = [
  {
    label: "Job details",
    Component: <Jobs />,
  },
  {
    label: "Recruitments",
    Component: <Recruitments />,
  },
];
export default function JobsRecruitments() {
  return (
    <div>
      <Tabs tabs={tabs}></Tabs>
    </div>
  );
}
