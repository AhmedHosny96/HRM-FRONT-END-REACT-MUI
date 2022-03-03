import React, { useState, useEffect } from "react";
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
} from "@material-ui/core";
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
  getMedicalRequests,
  deletMedicalRequest,
  saveMedicalRequest,
} from "./../../services/medicalService";

import ConfirmDialog from "../controls/ConfirmDialog";
import Notifications from "views/controls/Notifications";
import MedicalRequestForm from "./MedicalRequestForm";
import { Empty } from "antd";
import Spin from "../common/useSpin";
const useStyles = makeStyles((theme) => ({
  pagecontent: {
    margin: theme.spacing(2),
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
  { id: "branch", label: "Branch" },
  { id: "name", label: "Patient name" },
  // { id: "patientName", label: "relation " },
  { id: "amount", label: "Amount" },
  { id: "createdAt", label: "Date" },
  { id: "status", label: "Status" },
  { id: "action", label: "Action", disableSort: true },
];

const MedicalRequests = ({ user, socket }) => {
  console.log(socket);
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);

  const [openPopup, setOpenPopup] = useState(false); // state variables for dialog pop up\
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

  // view pop up

  const openInPopupView = (item) => {
    //set the fields to be populated
    setRecordForEdit(item);
    //open in dailog popup
    setOpenPopup(true);
    //set the fields to read-only
    setInputDisabled(true);
  };

  //handle delete

  const handleDelete = async (request) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    records.filter((b) => b._id != request._id);
    await deletMedicalRequest(request._id);

    setNotify({
      isOpen: true,
      message: "Deleted Successfully!",
      type: "error",
    });
    fetchData();
  };

  // posting and update data into db for branchesform
  const postData = async (medicalRequest) => {
    const data = { ...medicalRequest };
    await saveMedicalRequest(data);

    // if request is made send notification

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
      const { data } = await getMedicalRequests();
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
            text="+ Medical request claim"
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
                <TableCell>{record.employee.fullName}</TableCell>
                <TableCell>{record.employee.branch.name}</TableCell>
                <TableCell>
                  {!record.name ? record.employee.fullName : record.name}
                </TableCell>
                {/* <TableCell>{record.patient}</TableCell> */}
                <TableCell>{record.amount}</TableCell>
                <TableCell>
                  {record.createdAt.length > 11
                    ? record.createdAt.slice(0, 10)
                    : ""}
                </TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      openInPopupView(record);
                    }}
                    title="View"
                  >
                    <ZoomInOutlined fontSize="small" />
                  </Controls.ActionButton>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      openInPopup(record);
                    }}
                    title="Edit"
                  >
                    <EditOutlined fontSize="small" />
                  </Controls.ActionButton>
                  {user && user.role == "Admin" && (
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
                      title="Delete"
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
        title="medical expense request "
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <MedicalRequestForm
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
};

export default MedicalRequests;
