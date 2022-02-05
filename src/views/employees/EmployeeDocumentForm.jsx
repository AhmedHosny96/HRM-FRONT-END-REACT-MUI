import React, { useEffect, useState } from "react";
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
import app from "./../common/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginLeft: theme.spacing(3),
  },
}));

const initialValues = {
  // employeeId: "",
  // documentType: "",
  // details: "",
  attachment: "",
};
export default function EmployeeDocumentForm(props) {
  const classes = useStyles();

  const [attachment, setAttachment] = useState(null);
  const [downloadURL, setDownloadURL] = useState();

  const { postData, recordForEdit, setNotify } = props;

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
  const { values, setValues, errors, setErrors } = useForm(
    initialValues,
    true,
    validate
  );
  const [employee, setEmployee] = useState("");

  //populating data into form

  const populateEmployees = async () => {
    const { data: employees } = await getEmployees();
    setEmployee(employees);
  };

  useEffect(() => {
    //populate if there are records

    // populateEmployees();

    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
        employeeId: recordForEdit.employee.fullName,
      });
  }, [recordForEdit]);

  const handleOnChange = (files) => {
    // console.log(files[0]);
    setAttachment(files[0]);
  };

  //saving data to db

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fileName = new Date().getTime() + attachment.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, `documents/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, attachment);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        () => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadLink) => {
            setDownloadURL(downloadLink);
            const img = document.getElementById("img-preview");
            img.setAttribute("src", downloadLink);
          });
        }
      );
      alert("success");
    } catch (error) {
      alert("error occured" + error);
    }
  };

  const showImage = () => {
    // const storage = getStorage(app);
    // getDownloadURL(ref(storage, `documents/${attachment.name}`)).then((url) => {
    //   const img = document.getElementById("img-preview");
    //   img.setAttribute("src", url);
    // });
  };

  return (
    <div className={classes.root}>
      <Form onSubmit={handleSubmit}>
        {/* <Autocomplete
          disablePortal
          id="employeeId"
          options={employee}
          size="small"
          sx={{ width: 300 }}
          getOptionLabel={(employee) => employee.fullName}
          renderInput={(params) => (
            <Controls.Input
              {...params}
              label="Employee"
              value={values.employeeId}
              onChange={handleOnChange}
            />
          )}
          onChange={(event, selectedValue) => {
            setValues({ employeeId: selectedValue._id });
          }}
        />
        <Controls.Input
          name="documentType"
          label="Document Type"
          value={values.documentType}
          onChange={handleOnChange}
          error={errors.documentType}
        />

        <Controls.Input
          name="details"
          label="Detail info"
          value={values.details}
          onChange={handleOnChange}
          error={errors.details}
        /> */}

        <Controls.Input
          name="attachment"
          type="file"
          onChange={(e) => handleOnChange(e.target.files)}
          error={errors.attachment}
        />
        <Controls.Button text="Submit" type="submit" />
        <Controls.Button text="download image" onClick={showImage} />
        <img id="img-preview" />
      </Form>
    </div>
  );
}
