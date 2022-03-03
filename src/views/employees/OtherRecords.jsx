import React, { useState, useEffect } from "react";
import {
  Paper,
  Toolbar,
  TableBody,
  TableCell,
  TableRow,
  Badge,
} from "@material-ui/core";
import { OtherRecordsForm } from "./OtherRecordsForm";
import { makeStyles } from "@material-ui/core/styles";
import { useTable } from "../common/useTable";
import { Empty } from "antd";
import {
  getEmployeesOtherInfo,
  saveEmployeeOtherInfo,
  deleteEmployeeOtherInfo,
} from "../../services/employeeService";
import Controls from "../controls/controls";
import {
  EditOutlined,
  DeleteOutlined,
  ZoomInOutlined,
} from "@material-ui/icons/";
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
  // { id: "avatar", label: "" },
  { id: "employeeId", label: "Employee" },

  { id: "email", label: "Email" },
  // { id: "email", label: "Email" },
  { id: "maritalStatus", label: "Marital status" },
  { id: "jobId", label: "Contact name" },
  { id: "phoneNumber", label: "Contact phone " },
  { id: "action", label: "Action " },
];

export default function OtherRecords({ user }) {
  console.log(user);
  const classes = useStyles();
  const [inputDisabled, setInputDisabled] = useState(false);
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
    await saveEmployeeOtherInfo(data);

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
    setInputDisabled(false);
  };

  const openInPopupView = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
    setInputDisabled(true);
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
            item.employee.fullName.toLowerCase().includes(target.value)
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
    await deleteEmployeeOtherInfo(employee._id);

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
      const { data } = await getEmployeesOtherInfo();
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
            text="+ Additional info"
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
                <TableCell>{record.employee.fullName}</TableCell>
                <TableCell> {record.employee.email}</TableCell>
                <TableCell>{record.maritalStatus}</TableCell>
                {/* <TableCell>{record.email}</TableCell> */}
                <TableCell>
                  {record.contactPersonName.length > 12
                    ? record.contactPersonName.slice(0, 11) + "..."
                    : ""}
                </TableCell>
                <TableCell>
                  {record.contactPersonPhone.length > 13
                    ? record.contactPersonPhone.slice(0, 12) + "..."
                    : ""}
                </TableCell>

                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      openInPopupView(record);
                    }}
                    title="view"
                  >
                    <ZoomInOutlined fontSize="small" />
                  </Controls.ActionButton>
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
                          title: `Are you sure you want to delete ${record.employee.fullName} ?`,
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
          <OtherRecordsForm
            recordForEdit={recordForEdit}
            postData={postData}
            setNotify={setNotify}
            inputDisabled={inputDisabled}
          />
        </Popup>
      )}
      {!recordForEdit && (
        <Popup
          title="Other employee info"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <OtherRecordsForm
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
