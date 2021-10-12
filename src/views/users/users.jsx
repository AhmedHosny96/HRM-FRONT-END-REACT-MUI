import React, { useState, useEffect } from "react";
import {
  Paper,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  Grid,
  makeStyles,
  InputAdornment,
} from "@material-ui/core";
// import UserForm from "./userForm";

import Controls from "../../views/controls/controls";
import { Search } from "@material-ui/icons/";

import { useTable } from "views/common/useTable";
import { getUsers } from "./../../services/userService";

//custom styles
const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    display: "flex",
    width: "40%",
  },
}));

// column header configurations

const headCells = [
  { id: "name", label: "name" },
  { id: "emal", label: "email" },
];

export default function users() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const {
    TableContainer,
    TableHeader,
    Pagination,
    recordsAfterPagingAndSorting,
  } = useTable(records, headCells, filterFn);
  // handling search

  const handleSearch = (e) => {
    let target = e.target;
    //
    setFilterFn({
      fn: (items) => {
        //search input == ""
        if (target.value == "") return items;
        //do the filter
        else
          return items.filter((item) =>
            item.name.toLowerCase().includes(target.value)
          );
      },
    });
  };

  // fetching data into table

  const fetchData = async () => {
    const { data } = await getUsers();
    setRecords(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Paper className={classes.pageContent}>
        {/* <UserForm /> */}
        <Toolbar>
          <Grid container xs={12} sm={6}></Grid>
          <Controls.Input
            label="Search ..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
            className={classes.searchInput}
            onChange={handleSearch}
          ></Controls.Input>
        </Toolbar>
        <TableContainer>
          <TableHeader />
          <TableBody>
            {recordsAfterPagingAndSorting().map((record) => (
              <TableRow key={record._id}>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
        <Pagination />
      </Paper>
    </div>
  );
}
