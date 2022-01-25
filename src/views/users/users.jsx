import React, { useState, useEffect } from "react";
import {
  Paper,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  makeStyles,
  InputAdornment,
} from "@material-ui/core";
import UserForm from "./userForm";
import Controls from "../../views/controls/controls";
import { useTable } from "views/common/useTable";
import { getUsers, saveUser } from "./../../services/userService";
import Popup from "../../views/controls/Popup";
import Notifications from "../../views/controls/Notifications";
import {
  EditOutlined,
  DeleteOutlined,
  Add,
  LockOpenOutlined,
  Search,
} from "@material-ui/icons";

//custom styles
const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "40%",
    position: "absolute",
    right: "10px",
  },
  newButton: {
    marginRight: theme.spacing(6),
    textTransform: "none",
  },
}));

// column header configurations

const headCells = [
  { id: "username", label: "username" },
  { id: "employee", label: "employee" },
  { id: "phone", label: "phone number" },
  { id: "action ", label: "Action", disableSort: true },
];

export default function Users() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [openPopup, setOpenPopup] = useState(false);
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

  const postData = async (user) => {
    const data = { ...user };
    // save the user to db
    await saveUser(data);
    //close the pop up
    setOpenPopup(false);
    // notify sucess
    setNotify({
      isOpen: true,
      message: "An Email has been sent to the user email with the OTP",
      type: "success",
    });
    // refresh the table

    fetchData();
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
        <Toolbar>
          <Controls.Input
            label="Search..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            className={classes.searchInput}
            onChange={handleSearch}
          ></Controls.Input>
          <Controls.Button
            text="Add user"
            variant="outlined"
            size="medium"
            startIcon={<Add />}
            className={classes.newButton}
            onClick={() => setOpenPopup(true)}
          />
        </Toolbar>
        <TableContainer>
          <TableHeader />
          <TableBody>
            {recordsAfterPagingAndSorting().map((record) => (
              <TableRow key={record._id}>
                <TableCell>{record.employee.fullName}</TableCell>
                <TableCell>{record.email}</TableCell>
                <TableCell>{record.isAdmin}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => setOpenPopup(true)}
                  >
                    <EditOutlined />
                  </Controls.ActionButton>
                  <Controls.ActionButton color="primary">
                    <LockOpenOutlined />
                  </Controls.ActionButton>
                  <Controls.ActionButton color="secondary">
                    <DeleteOutlined />
                  </Controls.ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
        <Pagination />
      </Paper>
      <Popup
        title="User Registration form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UserForm postData={postData} />
      </Popup>
      <Notifications notify={notify} setNotify={setNotify} />
    </div>
  );
}
