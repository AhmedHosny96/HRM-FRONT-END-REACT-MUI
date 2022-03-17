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
import axios from "axios";
import { TextFieldsTwoTone } from "@material-ui/icons";

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
      setPreview(
        `${process.env.PUBLIC_URL}/employee_documents/${recordForEdit.attachment}`
      );
      setIsImageLoading(false);
    }
  }, [recordForEdit]);

  const handleAttachmentChange = (files) => {
    setValues({
      ...values,
      attachment: files[0],
    });
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

    const formData = new FormData();
    const { employeeId, documentType, details, attachment } = values;

    formData.append("employeeId", employeeId);
    formData.append("documentType", documentType);
    formData.append("details", details);
    formData.append("attachment", attachment, attachment.name);

    try {
      await postData(formData);
    } catch (err) {}
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
              setValues({ ...values, employeeId: selectedValue?._id });
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
                employeeId: selectedValue?._id,
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
            onChange={(e) => handleAttachmentChange(e.target.files)}
            error={errors.attachment}
            required="false"
            inputProps={{
              readOnly: inputDisabled,
              accept: "rar",
            }}
          />
        )}
        <Controls.Button
          text="Submit"
          type="submit"
          endIcon={isFetching && <CircularProgress size={20} />}
          disabled={isFetching || inputDisabled}
        ></Controls.Button>
        <br />

        {isImageLoading ? <Spin /> : <img id="img-preview" src={preview} />}
      </Form>
    </div>
  );
}
