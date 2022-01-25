import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, Form } from "../common/useForm";
import Controls from "../../views/controls/controls";
import { getEmployees } from "./../../services/employeeService";
import Autocomplete from "@material-ui/lab/Autocomplete";
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
  const { values, setValues, errors, setErrors, handleOnChange } = useForm(
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

    populateEmployees();

    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
        employeeId: recordForEdit.employee.fullName,
      });
  }, [recordForEdit]);

  //saving data to db

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (validate()) {
    try {
      const data = new FormData();

      // data.append("employeeId", values.employeeId);
      data.append("documentType", values.documentType);
      data.append("details", values.details);
      data.append("attachment", e.target.files[0]);

      console.log(e.target.files[0]);

      await postData(data);
    } catch (ex) {
      setNotify({
        isOpen: true,
        message: ex.response.data,
        type: "warning",
      });
    }
    // }
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
        /> */}
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
        />
        <Controls.Input
          name="attachment"
          type="file"
          value={values.attachment}
          onChange={handleOnChange}
          error={errors.attachment}
        />
        <Controls.Button text="Submit" type="submit" />
      </Form>
    </div>
  );
}
