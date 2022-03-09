import React from "react";
import { Box, Typography, Tabs, Tab } from "@material-ui/core";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  tab: {
    marginTop: theme.spacing(-7),
  },
  tabText: {
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
          <Typography component={'span'}> {children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function UseTabs({ tabs, user, socket }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          className={classes.tab}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          textColor="primary"
          indicatorColor="primary"
          wrapped ={value ? 1 : 0}
        >
          {tabs.map(({ label }, i) => (
            <Tab label={label} key={i} className={classes.tabText} />
          ))}
        </Tabs>
      </Box>
      {tabs.map(({ Component }, i) => (
        <TabPanel value={value} index={i} key={i} user={user} >
          {Component}
        </TabPanel>
      ))}
    </Box>
  );
}
