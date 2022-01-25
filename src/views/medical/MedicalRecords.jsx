import React from "react";
import { Box, Typography, Tabs, Tab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Medical from "./Medical";
import MedicalRequests from "./MedicalRequests.jsx";
import UserProfile from "./../UserProfile/UserProfile";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginTop: theme.spacing(-6),
  },

  searchInput: {
    width: "42%",
    position: "absolute",
    right: "10px",
  },
  tabText: {
    textTransform: "none",
  },
  newButton: {
    marginRight: theme.spacing(6),
    textTransform: "none",
  },
}));
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MedicalRecords = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const classes = useStyles();
  return (
    <div className={classes.pageContent}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        textColor="black"
      >
        <Tab
          className={classes.tabText}
          label="Medical claim details"
          {...a11yProps(0)}
        />
        <Tab
          className={classes.tabText}
          label="Employee medical request"
          {...a11yProps(1)}
        />
        <Tab
          className={classes.tabText}
          label="user profile"
          {...a11yProps(2)}
        />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Medical />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MedicalRequests />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <UserProfile />
      </TabPanel>
    </div>
  );
};

export default MedicalRecords;
