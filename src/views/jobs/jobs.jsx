import React, { useState, useEffect } from "react";
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTable } from "../common/useTable";
import { Empty } from "antd";
import UseAvatar from "views/common/useAvatar";
import JobForm from "./jobForm";

import Controls from "../controls/controls";
import {
  EditOutlined,
  DeleteOutline,
  ZoomInOutlined,
} from "@material-ui/icons/";
import Popup from "../controls/Popup";
import ConfirmDialog from "../controls/ConfirmDialog";
import { saveJob, getJobs, deleteJob } from "../../services/jobService";
import Notifications from "views/controls/Notifications";
import Spin from "../common/useSpin";
import Tab from "../common/useTabs";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(0),
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

//table header column configurations

const headCells = [
  { id: "code", label: "Job title code" },
  { id: "name", label: "Job title" },
  { id: "department", label: "Department" },

  { id: "action", label: "Action", disableSort: true },
];

export default function Jobs({ user, socket }) {
  console.log(socket, user);
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
  //
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

  // posting and update data into db for branchesform
  const postData = async (job) => {
    const data = { ...job };
    await saveJob(data);

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

  //handle delete

  const handleDelete = async (job) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    records.filter((b) => b._id != job._id);
    await deleteJob(job._id);

    setNotify({
      isOpen: true,
      message: "Deleted Successfully!",
      type: "error",
    });
    fetchData();
  };

  // populate the data into form

  const openInPopup = (item) => {
    //set the fields to be populated
    setRecordForEdit(item);
    //open in dailog popup
    setOpenPopup(true);

    //
    setInputDisabled(false);
  };
  const openInPopupView = (item) => {
    //set the fields to be populated
    setRecordForEdit(item);
    //open in dailog popup
    setOpenPopup(true);
    //set the fields to read-only
    setInputDisabled(true);
  };

  const fetchData = async () => {
    try {
      const { data } = await getJobs();
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
            label="search..."
            variant="outlined"
            className={classes.searchInput}
            onChange={handleSearch}
          />
          <Controls.Button
            text="+ Add Job"
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
                  <UseAvatar>{record.code.toUpperCase()}</UseAvatar>
                </TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.department}</TableCell>
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
                      openInPopup(record), console.log(record);
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
                          title: "Are you sure you want to delete this ?",
                          subTitle: "",
                          onConfirm: () => handleDelete(record),
                        })
                      }
                      title="delete"
                    >
                      <DeleteOutline fontSize="small" />
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
        title="Add new Job"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <JobForm
          postData={postData}
          recordForEdit={recordForEdit}
          setNotify={setNotify}
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
