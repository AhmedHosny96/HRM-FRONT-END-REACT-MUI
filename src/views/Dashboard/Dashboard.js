import React, { useEffect, useState } from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Person from "@material-ui/icons/Person";
import Work from "@material-ui/icons/Work";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { getEmployees } from "../../services/employeeService";
import { getBranches } from "../../services/branchService";
import { getJobs } from "../../services/jobService";
import { getUsers } from "../../services/userService";

const useStyles = makeStyles(styles);

export default function Dashboard({ user }) {
  const classes = useStyles();

  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);

  // fetch employees

  const getStaffs = async () => {
    try {
      const { data } = await getEmployees();
      setEmployees(data);
    } catch (ex) {}
  };
  // fetch branches
  const getBranch = async () => {
    try {
      const { data } = await getBranches();
      setBranches(data);
    } catch (ex) {}
  };

  // fetch job roles
  const getJD = async () => {
    try {
      const { data } = await getJobs();
      setJobs(data);
    } catch (ex) {}
  };

  // fetch users
  const getUser = async () => {
    try {
      const { data } = await getUsers();
      setUsers(data);
    } catch (ex) {}
  };

  useEffect(() => {
    getStaffs();
    getBranch();
    getJD();
    getUser();
  }, []);

  const { length: staffNumber } = employees;
  const { length: branchNumber } = branches;
  const { length: jobRoleNumber } = jobs;
  const { length: userNumber } = users;

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Employees</p>
              <h3 className={classes.cardTitle}>
                {staffNumber} <small></small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}></div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Branches</p>
              <h3 className={classes.cardTitle}>{branchNumber}</h3>
            </CardHeader>
            <CardFooter stats></CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Work />
              </CardIcon>
              <p className={classes.cardCategory}>Job roles</p>
              <h3 className={classes.cardTitle}>{jobRoleNumber}</h3>
            </CardHeader>
            <CardFooter stats></CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Person />
              </CardIcon>
              <p className={classes.cardCategory}>Users</p>
              <h3 className={classes.cardTitle}>{userNumber}</h3>
            </CardHeader>
            <CardFooter stats></CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
