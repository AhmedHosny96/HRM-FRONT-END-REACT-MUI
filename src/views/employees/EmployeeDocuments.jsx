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
import "antd/dist/antd.css";

import EmployeeDocumentForm from "./EmployeeDocumentForm";

import Controls from "../controls/controls";
import { Edit, Delete, CloudDownload } from "@material-ui/icons/";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { Empty } from "antd";
import Popup from "../controls/Popup";
import ConfirmDialog from "../controls/ConfirmDialog";
import {
  saveDocument,
  getDocuments,
  deleteDocument,
} from "../../services/documentService";
import Notifications from "views/controls/Notifications";
import Spin from "./../common/useSpin";
import app from "./../common/firebase";

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
  { id: "employeeId", label: "Employee" },
  { id: "branchId", label: "Branch" },
  { id: "documentType", label: "Document type" },
  { id: "details", label: "Details" },

  { id: "action", label: "Action", disableSort: true },
];

export default function EmployeeDocuments() {
  const classes = useStyles();
  const [isFetching, setIsFetching] = useState(false);

  const [records, setRecords] = useState([]);

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

  // posting and update data into db for branchesform
  const postData = async (document) => {
    try {
      const data = { ...document };
      await saveDocument(data);
      setOpenPopup(false);

      setNotify({
        isOpen: true,
        message: "Successfull !",
        type: "success",
      });
      fetchData();
    } catch (ex) {
      setNotify({
        isOpen: true,
        message: ex.response.data,
        type: "error",
      });
    }
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
        else if (target.value)
          return items.filter((item) =>
            item.employee.fullName.toLowerCase().includes(target.value)
          );
      },
    });
  };

  //handle delete

  const handleDelete = async (document) => {
    setIsFetching(true);
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    records.filter((b) => b._id != document._id);

    const storage = getStorage(app);
    //image reference storage: firebase , url : mongodb
    const imageRef = ref(storage, document.attachment);
    // delete
    await deleteObject(imageRef)
      .then(() => {
        deleteDocument(document._id);
        setNotify({
          isOpen: true,
          message: "Deleted Successfully!",
          type: "error",
        });
      })
      .catch((err) => {
        alert("error occured" + err);
      });
    fetchData();
  };

  // populate the data into form

  const openInPopup = (item) => {
    //set the fields to be populated
    setRecordForEdit(item);
    //open in dailog popup
    setOpenPopup(true);
    //stop populating
  };

  const fetchData = async () => {
    const { data } = await getDocuments();
    setRecords(data);
    setIsFetching(false);
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
            text="+ Add new documents"
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
                <TableCell>{record.documentType}</TableCell>
                <TableCell>{record.details}</TableCell>

                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      window.open(record.attachment, "_blank");
                    }}
                  >
                    <CloudDownload />
                  </Controls.ActionButton>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      openInPopup(record);
                    }}
                  >
                    <Edit />
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
                    <Delete />
                  </Controls.ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
        {isFetching && <Spin />}

        {count === 0 && !isFetching && (
          <Empty description="No documents found" />
        )}

        <Pagination />
      </Paper>
      <Popup
        title="Employee document form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <EmployeeDocumentForm
          postData={postData}
          recordForEdit={recordForEdit}
          setNotify={setNotify}
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
