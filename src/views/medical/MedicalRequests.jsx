import React, { useState, useEffect } from "react";
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { EditOutlined, DeleteOutlined } from "@material-ui/icons";
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
  { id: "patientName", label: "relation " },
  { id: "amount", label: "Amount" },
  { id: "status", label: "Status" },
  { id: "action", label: "Action", disableSort: true },
];

const MedicalRequests = () => {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  0;
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
            item.name.toLowerCase().includes(target.value)
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
    const { data } = await getMedicalRequests();
    setRecords(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

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
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.patient}</TableCell>
                <TableCell>{record.amount}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      openInPopup(record);
                    }}
                  >
                    <EditOutlined />
                  </Controls.ActionButton>
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
                  >
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
        title="medical expense request "
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <MedicalRequestForm
          recordForEdit={recordForEdit}
          setNotify={setNotify}
          postData={postData}
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
