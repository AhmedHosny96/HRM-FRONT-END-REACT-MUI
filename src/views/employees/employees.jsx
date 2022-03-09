import React, { useState, useEffect } from "react";
import {
  Paper,
  Toolbar,
  TableBody,
  TableCell,
  TableRow,
  Badge,
} from "@material-ui/core";
import EmployeeForm from "./employeeForm";
import { makeStyles } from "@material-ui/core/styles";
import { useTable } from "../common/useTable";
import { Empty } from "antd";
import {
  getEmployees,
  saveEmployee,
  deleteEmployee,
} from "../../services/employeeService";
import Controls from "../controls/controls";
import UseAvatar from "views/common/useAvatar";
import { EditOutlined, DeleteOutlined } from "@material-ui/icons/";
import Popup from "../controls/Popup";
import Notifications from "../controls/Notifications";
import ConfirmDialog from "../controls/ConfirmDialog";
import Spin from "../common/useSpin";
const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(0),
    padding: theme.spacing(1),
  },
  search: {
    width: "40%",
    position: "absolute",
    right: "10px",
  },
  newButton: {
    textTransform: "none",
    marginRight: theme.spacing(6),
  },
}));

//column header configurations

const headCells = [
  { id: "avatar", label: "" },
  { id: "employeeId", label: "ID" },

  { id: "fullName", label: "Name" },
  // { id: "email", label: "Email" },
  { id: "branchId", label: "Branch" },
  { id: "jobId", label: "Job Title" },
  { id: "phoneNumber", label: "Phone" },
  { id: "status", label: "Status" },
  { id: "action", label: "Action" },
];

export default function Employees({ user }) {
  const classes = useStyles();
  const [isFetching, setIsFetching] = useState(false);
  const [records, setRecords] = useState([]);

  const [openPopup, setOpenPopup] = useState(false); // pop dialog

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [recordForEdit, setRecordForEdit] = useState(null); // for populate data into pop up dialog
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const {
    TableContainer,
    TableHeader,
    recordsAfterPagingAndSorting,
    Pagination,
  } = useTable(records, headCells, filterFn);

  // posting data to employees form

  const postData = async (employee) => {
    const data = { ...employee };
    await saveEmployee(data);

    //close the pop
    setOpenPopup(false);
    // send notify alert
    setNotify({
      isOpen: true,
      message: "Successfull !",
      type: "success",
    });

    fetchData();
  };
  //populate data into pop dialog

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  //handle search bar on change

  const handleSearch = (e) => {
    let target = e.target;

    setFilterFn({
      fn: (items) => {
        if (target.value == " ") {
          return items;
        } else {
          return items.filter((item) =>
            item.fullName.toLowerCase().includes(target.value)
          );
        }
      },
    });
  };

  //handling delete

  const handleDelete = async (employee) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    records.filter((b) => b._id != employee._id);
    await deleteEmployee(employee._id);

    setNotify({
      isOpen: true,
      message: "Deleted Successfully!",
      type: "error",
    });

    fetchData();
  };

  // fetching data into table
  const fetchData = async () => {
    try {
      const { data } = await getEmployees();
      setRecords(data);
      setIsFetching(false);
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
      <Paper elevation={2} className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search..."
            className={classes.search}
            onChange={handleSearch}
          />

          <Controls.Button
            text="+ Add employee"
            variant="outlined"
            size="medium"
            onClick={() => {
              setOpenPopup(true), setRecordForEdit(null);
            }}
            className={classes.newButton}
          />
        </Toolbar>
        {/* <hr style={{ borderTop: " 1px light lightGray" }} /> */}
        <TableContainer>
          <TableHeader />

          <TableBody>
            {recordsAfterPagingAndSorting().map((record) => (
              <TableRow key={record._id}>
                <TableCell>
                  <UseAvatar>
                    {record.fullName.charAt(0).toUpperCase()}
                    {record.fullName.toUpperCase().match(/(?<= )./)}
                  </UseAvatar>
                </TableCell>
                <TableCell> {record.employeeId}</TableCell>
                <TableCell>{record.fullName}</TableCell>
                {/* <TableCell>{record.email}</TableCell> */}
                <TableCell>{record.branch.name}</TableCell>
                <TableCell>{record.job.name}</TableCell>
                <TableCell>{record.phoneNumber}</TableCell>

                <TableCell
                  style={{
                    color: record.status === "Active" ? "blue" : "red",
                    fontWeight: "500",
                  }}
                >
                  {record.status}
                </TableCell>
                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      openInPopup(record);
                    }}
                    title="edit"
                  >
                    <EditOutlined fontSize="small" />
                  </Controls.ActionButton>
                  {user && user.role === "Admin" && (
                    <Controls.ActionButton
                      color="secondary"
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          title: `Are you sure you want to delete ${record.fullName} ?`,
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

      {recordForEdit && (
        <Popup
          title="Update employee"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <EmployeeForm
            recordForEdit={recordForEdit}
            postData={postData}
            setNotify={setNotify}
          />
        </Popup>
      )}
      {!recordForEdit && (
        <Popup
          title="Add new employee"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <EmployeeForm
            recordForEdit={recordForEdit}
            postData={postData}
            setNotify={setNotify}
          />
        </Popup>
      )}
      <Notifications notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
}
