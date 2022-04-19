import React, { useState, useEffect } from "react";
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  LinearProgress,
} from "@material-ui/core";
import LeaveRequestForm from "./LeaveRequestForm";
import { makeStyles } from "@material-ui/core/styles";
import {
  EditOutlined,
  DeleteOutlined,
  ZoomInOutlined,
} from "@material-ui/icons";
import Controls from "../controls/controls";
import Popup from "../controls/Popup";
import { useTable } from "../common/useTable";
import {
  getLeaveRequests,
  deleteLeaveRequest,
  saveLeaveRequest,
} from "../../services/leaveService";
import { Empty } from "antd";
import ConfirmDialog from "../controls/ConfirmDialog";
import Notifications from "views/controls/Notifications";
import Spin from "../common/useSpin";
const useStyles = makeStyles((theme) => ({
  pagecontent: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
  searchInput: {
    width: "42%",
    position: "absolute",
    right: "10px",
  },
  newButton: {
    marginRight: theme.spacing(6),
    textTransform: "none",

    // backgroundColor: "purple",
    // color: "white",
  },
}));
const headCells = [
  { id: "employeeId", label: "Employee" },
  { id: "branchId", label: "Branch" },
  { id: "leaveId", label: "Leave" },
  { id: "startDate", label: "From" },
  { id: "returnDate", label: "To" },
  { id: "requestedDays", label: "Days" },
  { id: "status", label: "Status" },
  { id: "action", label: "Action", disableSort: true },
];
export default function leaves({ user }) {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [openPopup, setOpenPopup] = useState(false); // state variables for dialog pop up\
  const [isFetching, setIsFetching] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);

  const [recordForEdit, setRecordForEdit] = useState(null); // for populating data into form
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  }); //for alert notifications
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [filterFn, setFilterFn] = useState({
    //filter function initially no filter operation
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
            item.employee.fullName.toLowerCase().includes(target.value)
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
    setInputDisabled(false);
  };
  const openInPopupView = (item) => {
    //set the fields to be populated
    setRecordForEdit(item);
    //open in dailog popup
    setOpenPopup(true);
    //stop populating
    setInputDisabled(true);
  };

  //handle delete

  const handleDelete = async (leave) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    records.filter((b) => b._id != leave._id);
    await deleteLeaveRequest(leave._id);

    setNotify({
      isOpen: true,
      message: "Deleted Successfully!",
      type: "error",
    });
    fetchData();
  };

  // posting and update data into db for branchesform
  const postData = async (leaveRequest) => {
    const data = { ...leaveRequest };
    await saveLeaveRequest(data);

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
  // fetching records from DB
  const fetchData = async () => {
    try {
      const { data } = await getLeaveRequests();
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
      <Paper className={classes.pagecontent}>
        <Toolbar>
          <Controls.Input
            label="search..."
            variant="outlined"
            className={classes.searchInput}
            onChange={handleSearch}
          />
          <Controls.Button
            text="+ Leave request"
            variant="outlined"
            size="medium"
            className={classes.newButton}
            // startIcon={<Add />}
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
            }}
          />
        </Toolbar>

        <TableContainer>
          <TableHeader />
          <TableBody>
            {recordsAfterPagingAndSorting().map((record) => (
              <TableRow key={record._id}>
                <TableCell>
                  {record.employee.fullName.length > 11
                    ? record.employee.fullName.slice(0, 11) + "..."
                    : record.employee.fullName}
                </TableCell>
                <TableCell>{record.employee.branch.name}</TableCell>
                <TableCell>{record.leave.leaveType}</TableCell>
                <TableCell>
                  {record.startDate.length > 11
                    ? record.startDate.slice(0, 10)
                    : ""}
                </TableCell>
                <TableCell>
                  {record.returnDate.length > 11
                    ? record.returnDate.slice(0, 10)
                    : ""}
                </TableCell>
                <TableCell>{record.requestedDays}</TableCell>
                <TableCell
                  style={{
                    color:
                      (record.status == "Pending" && "greenYellow") ||
                      (record.status == "Approved" && "darkBlue") ||
                      (record.status == "Cancelled" && "red"),
                    fontWeight: "450",
                  }}
                >
                  {record.status}
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
                  {user &&
                    user.role === "Admin" && [
                      <Controls.ActionButton
                        color="primary"
                        onClick={() => {
                          openInPopup(record);
                        }}
                        title="edit"
                      >
                        <EditOutlined fontSize="small" />
                      </Controls.ActionButton>,
                      <Controls.ActionButton
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
                      </Controls.ActionButton>,
                    ]}
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
        title="leave request "
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <LeaveRequestForm
          recordForEdit={recordForEdit}
          setNotify={setNotify}
          postData={postData}
          inputDisabled={inputDisabled}
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
