import React, { useState, useEffect } from "react";
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTable } from "../common/useTable";
import { getBranches } from "../../services/branchService";
import BranchForm from "./branchForm";
import Controls from "../../views/controls/controls";
import { Search, Add } from "@material-ui/icons/";
import Popup from "views/controls/Popup";
const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(3),
    padding: theme.spacing(2),
  },
  searchInput: {
    marginTop: theme.spacing(5),
    width: "40%",
    position: "absolute",
    right: "10px",
  },
  newButton: {
    "& .MuiButton-label": {
      textTransform: "none",
    },

    top: "20px",
  },
}));

//table header column configurations

const headCells = [
  { id: "name", label: "Branch name" },
  { id: "region", label: "Region" },
  { id: "city", label: "City" },
];

export default function branches() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);

  //filter function initially no filter operation
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  // state variables for dialog pop up\

  const [openPopup, setOpenPopup] = useState(false);

  const {
    TableContainer,
    TableHeader,
    Pagination,
    recordsAfterPagingAndSorting,
  } = useTable(records, headCells, filterFn);

  //handling search

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
  const fetchData = async () => {
    const { data } = await getBranches();
    setRecords(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search ..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            className={classes.searchInput}
            onChange={handleSearch}
          />
          <Controls.Button
            text="Add Branch"
            variant="outlined"
            className={classes.newButton}
            startIcon={<Add />}
            onClick={() => setOpenPopup(true)}
          />
        </Toolbar>

        <TableContainer>
          <TableHeader />
          <TableBody>
            {recordsAfterPagingAndSorting().map((record) => (
              <TableRow key={record._id}>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.region}</TableCell>
                <TableCell>{record.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
        <Pagination />
      </Paper>
      <Popup
        title="Branch Form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <BranchForm />
      </Popup>
    </div>
  );
}
