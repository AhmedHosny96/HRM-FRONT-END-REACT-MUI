import React, { useState, useEffect } from "react";
import {
  Paper,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  makeStyles,
} from "@material-ui/core";
import UserForm from "./userForm";
import Controls from "../../views/controls/controls";
import { useTable } from "views/common/useTable";
import { getUsers, saveUser, deleteUser } from "./../../services/userService";
import Popup from "../../views/controls/Popup";
import Notifications from "../../views/controls/Notifications";
import {
  EditOutlined,
  DeleteOutlined,
  LockOpenOutlined,
} from "@material-ui/icons";
import ConfirmDialog from "../controls/ConfirmDialog";
import { Empty } from "antd";
import Spin from "../common/useSpin";
import UseAvatar from "views/common/useAvatar";
//custom styles
const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(0),
    padding: theme.spacing(1),
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
  { id: "avatar", label: "" },
  { id: "employee", label: "Employee" },
  { id: "username", label: "username" },
  { id: "email", label: "Email" },
  { id: "", label: "Role" },
  { id: "status", label: "Status" },
  // { id: "role", label: "Role" },

  { id: "action ", label: "Action", disableSort: true },
];

export default function Users({ user }) {
  console.log(user);
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null); // for populating data into form
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

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
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
            item.username.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const openInPopup = (item) => {
    //set the fields to be populated
    setRecordForEdit(item);
    //open in dailog popup
    setOpenPopup(true);
    //stop populating
  };

  //handle delete

  const handleDelete = async (user) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    records.filter((u) => u._id != user._id);
    await deleteUser(user._id);

    setNotify({
      isOpen: true,
      message: "Deleted Successfully!",
      type: "error",
    });
    fetchData();
  };

  const postData = async (user) => {
    const data = { ...user };
    // save the user to db
    await saveUser(data);
    //close the pop up
    setOpenPopup(false);
    // notify sucess

    if (user.email) {
      setNotify({
        isOpen: true,
        message: ` One-time password  is sent to - ${user.email}`,
        type: "success",
      });
    } else {
      setNotify({
        isOpen: true,
        message: ` Successfull`,
        type: "success",
      });
    }
    // refresh the table

    fetchData();
  };

  // fetching data into table

  const fetchData = async () => {
    try {
      const { data } = await getUsers();
      setIsFetching(false);
      setRecords(data);
    } catch (err) {
      if (err.response && err.response.status >= 404) {
      } else {
        setNotify({
          isOpen: true,
          message:
            "Unexpected error occurred ,  Please Contact your system Admin. !",
          type: "error",
        });
      }
    }
  };

  useEffect(() => {
    setIsFetching(true);

    fetchData();
  }, []);
  const { length: count } = records;
  return (
    <div>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search..."
            size="small"
            className={classes.searchInput}
            onChange={handleSearch}
          ></Controls.Input>
          {user && user.role === "Admin" && (
            <Controls.Button
              text="+ Add new user"
              variant="outlined"
              size="medium"
              className={classes.newButton}
              onClick={() => {
                setOpenPopup(true);
                setRecordForEdit(null);
              }}
            />
          )}
        </Toolbar>
        <TableContainer>
          <TableHeader />
          <TableBody>
            {recordsAfterPagingAndSorting().map((record) => (
              <TableRow key={record._id}>
                <TableCell>
                  <UseAvatar>
                    {record.employee.fullName.charAt(0).toUpperCase()}
                    {record.employee.fullName.toUpperCase().match(/(?<= )./)}
                  </UseAvatar>
                </TableCell>
                <TableCell>{record.employee.fullName}</TableCell>
                <TableCell>{record.username}</TableCell>
                <TableCell>{record.email}</TableCell>
                <TableCell>{record.role}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>
                  {user && user.role === "Admin" && (
                    <Controls.ActionButton
                      color="primary"
                      title="reset password"
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          title: `Are you sure you want to reset ${record.employee.fullName}'s password ?`,
                          subTitle: "",
                          text: "send",
                          onConfirm: () => handleDelete(record),
                        })
                      }
                    >
                      <LockOpenOutlined fontSize="small" />
                    </Controls.ActionButton>
                  )}

                  {user && user.role === "Admin" && (
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => {
                        openInPopup(record);
                      }}
                      title="edit"
                    >
                      <EditOutlined fontSize="small" />
                    </Controls.ActionButton>
                  )}

                  {user && user.role === "Admin" && (
                    <Controls.ActionButton
                      color="secondary"
                      color="secondary"
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          title: "Are you sure you want to delete this ?",
                          subTitle: "",
                          onConfirm: () => handleDelete(record),
                        })
                      }
                      title="delete"
                    >
                      <DeleteOutlined fontSize="small" />
                    </Controls.ActionButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
        {isFetching && <Spin />}
        {count === 0 && !isFetching && <Empty description="No data found" />}
        <Pagination />
      </Paper>
      <Popup
        title="User Registration form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UserForm
          postData={postData}
          setNotify={setNotify}
          recordForEdit={recordForEdit}
        />
      </Popup>
      <Notifications notify={notify} setNotify={setNotify} />

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
}
