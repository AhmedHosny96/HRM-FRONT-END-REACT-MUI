import React, { useEffect, useState } from "react";
import { Button, CircularProgress, LinearProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, Form } from "../common/useForm";
import Controls from "../../views/controls/controls";
import { getEmployees } from "./../../services/employeeService";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "./../../services/firebase";
import Spin from "./../common/useSpin";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginLeft: theme.spacing(3),
  },
}));

const initialValues = {
  employeeId: "",
  documentType: "",
  details: "",
  attachment: "",
};
export default function EmployeeDocumentForm(props) {
  const classes = useStyles();

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);

  const { postData, recordForEdit, setNotify, inputDisabled } = props;

  //validation

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("code" in fieldValues)
      temp.code = fieldValues.code ? "" : "Code is required";
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "Title is required";
    if ("department" in fieldValues)
      temp.department = fieldValues.department ? "" : "Department is required";

    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };
  const { values, setValues, errors, setErrors, handleOnChange } = useForm(
    initialValues,
    true,
    validate
  );
  const [employee, setEmployee] = useState("");
  const [inputValue, setInputValue] = useState("");

  //populating data into form

  const populateEmployees = async () => {
    const { data: employees } = await getEmployees();
    setEmployee(employees);
  };

  useEffect(() => {
    //populate if there are records

    populateEmployees();

    if (recordForEdit != null) {
      setValues({
        ...recordForEdit,
      });
      // populate auto select value
      setInputValue(recordForEdit.employee.fullName);
      // preview the document
      setPreview(recordForEdit.attachment);
      setIsImageLoading(false);
    }
  }, [recordForEdit]);

  const handleAttachmentChange = (files) => {
    setAttachment(files[0]);
    //preview the image before upload

    if (files[0].type.includes("image")) {
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setPreview("");
    }

    // console.log(files[0].type);
  };

  //saving data to db

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPreview(null);

    const fileName = new Date().getTime() + attachment.name;
    const storage = getStorage(app);
    try {
      // get employee name

      //TODO: get employee name
      const metadata = {
        customMetadata: {
          employeeId: values.employeeId,
          documentType: values.documentType,
          details: values.details,
        },
      };
      // console.log(metadata);
      const storageRef = ref(storage, `employee documents/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, attachment, metadata);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setIsFetching(true);
          // console.log("Uploading " + progress + " % done ...");
          setProgress(progress);
        },
        () => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadLink) => {
            // setImageUrl(downloadLink);
            setAttachment(downloadLink);
            const fields = { ...values, attachment: downloadLink };
            postData(fields);

            setIsFetching(false);
          });
        }
      );
    } catch (ex) {
      setNotify({
        isOpen: true,
        message: ex,
        type: "error",
      });
    }
  };

  return (
    <div className={classes.root}>
      {isFetching && (
        <LinearProgress
          variant="buffer"
          value={progress}
          valueBuffer={buffer}
        />
      )}
      <br />
      <Form onSubmit={handleSubmit}>
        {recordForEdit ? (
          <Autocomplete
            disablePortal
            options={employee}
            size="small"
            inputValue={inputValue}
            sx={{ width: 300 }}
            getOptionLabel={(employee) => employee.fullName}
            renderInput={(params) => (
              <Controls.Input
                {...params}
                id="employeeId"
                label="Employee"
                name="employeeId"
                value={values.employeeId}
                onChange={handleOnChange}
              />
            )}
            onChange={(event, selectedValue) => {
              setValues({ ...values, employeeId: selectedValue._id });
            }}
            InputProps={{ readOnly: inputDisabled }}
          />
        ) : (
          <Autocomplete
            disablePortal
            options={employee}
            size="small"
            noOptionsText="No employee found"
            sx={{ width: 300 }}
            getOptionLabel={(employee) => employee.fullName}
            renderInput={(params) => (
              <Controls.Input
                {...params}
                id="employeeId"
                label="Employee"
                name="employeeId"
                value={values.employeeId}
                onChange={handleOnChange}
              />
            )}
            onChange={(event, selectedValue) => {
              setValues({
                ...values,
                employeeId: selectedValue._id,
              });
            }}
          />
        )}
        <Controls.Input
          name="documentType"
          label="Document Type"
          value={values.documentType}
          onChange={handleOnChange}
          error={errors.documentType}
          InputProps={{ readOnly: inputDisabled }}
        />
        <Controls.Input
          name="details"
          label="Detail info"
          value={values.details}
          onChange={handleOnChange}
          error={errors.details}
          multiline
          rows={4}
          maxRows={10}
          InputProps={{ readOnly: inputDisabled }}
        />
        {!inputDisabled && (
          <Controls.Input
            name="attachment"
            type="file"
            filena
            onChange={(e) => handleAttachmentChange(e.target.files)}
            error={errors.attachment}
            required="false"
            InputProps={{ readOnly: inputDisabled }}
          />
        )}
        <Controls.Button
          text="Submit"
          type="submit"
          endIcon={isFetching && <CircularProgress size={20} />}
          disabled={isFetching || inputDisabled}
        ></Controls.Button>
        <br />

        {isImageLoading ? <Spin /> : <img id="img-preview" src={preview} vis />}
      </Form>
    </div>
  );
}
