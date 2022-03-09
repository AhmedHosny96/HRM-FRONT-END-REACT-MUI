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
import Spin from "../common/useSpin";
import Controls from "../controls/controls";
import {
  EditOutlined,
  DeleteOutline,
  ZoomInOutlined,
} from "@material-ui/icons/";
import Popup from "../controls/Popup";
import ConfirmDialog from "../controls/ConfirmDialog";
import {
  getRecruitments,
  saveRecruitment,
  deleteRecruitment,
} from "../../services/recruitmentService";

import { getAdminUsers } from "../../services/userService";
import { Empty } from "antd";

import Notifications from "views/controls/Notifications";
import RecruitmentForm from "./RecruitmentForm";

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
  },
}));

//table header column configurations

const headCells = [
  { id: "jobId", label: "Position" },
  { id: "branchId", label: "Branch" },
  { id: "requiredNumber", label: "Required no" },
  { id: "employementType", label: "Employment Type" },
  { id: "createdAt", label: "Date" },
  { id: "status", label: "Status" },

  { id: "action", label: "Action", disableSort: true },
];
export default function Recruitments({ user, socket }) {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [adminUser, setAdminUser] = useState("");

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

  // get admin user
  const getAdminUser = () => {
    getAdminUsers().then((data) => setAdminUser(data.data[0]));
  };
  useEffect(() => {
    setIsFetching(true);
    fetchData();
    getAdminUser();
  }, []);

  // posting and update data into db for branchesform
  const postData = async (recruitment) => {
    const data = { ...recruitment };
    await saveRecruitment(data);

    //close the pop
    setOpenPopup(false);

    //send notification

    // send  alert
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
            item.job.name.toLowerCase().includes(target.value)
          );
      },
    });
  };

  //handle delete

  const handleDelete = async (recruitment) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    records.filter((b) => b._id != recruitment._id);
    await deleteRecruitment(recruitment._id);

    setNotify({
      isOpen: true,
      message: "Deleted Successfully!",
      type: "error",
    });
    fetchData();
  };

  // populate the data into form

  const openInPopupEdit = (item) => {
    //set the fields to be populated
    setRecordForEdit(item);
    //open in dailog popup
    setOpenPopup(true);
    //stop enable input fields
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
      const { data } = await getRecruitments();
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
            text="+ Recruitment request"
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
                <TableCell>{record.job.name}</TableCell>
                <TableCell>{record.branch.name}</TableCell>
                <TableCell>{record.requiredNumber}</TableCell>
                <TableCell>{record.employementType}</TableCell>
                <TableCell>
                  {record.createdAt.length > 11
                    ? record.createdAt.slice(0, 10)
                    : ""}
                </TableCell>
                <TableCell style={{}}>{record.status}</TableCell>

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
                      openInPopupEdit(record);
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
        title="Recruitment request form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <RecruitmentForm
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
