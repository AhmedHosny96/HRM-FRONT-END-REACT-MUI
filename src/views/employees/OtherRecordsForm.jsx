import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { useForm, Form } from "../common/useForm";
import Controls from "../../views/controls/controls";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Gender,
  statuses,
  maritalStatus,
} from "../../views/common/dropDownValues";
import {
  getActiveEmployees,
  getEmployees,
} from "./../../services/employeeService";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginLeft: theme.spacing(3),
  },
}));

const initialValues = {
  employeeId: "",
  maritalStatus: "",
  spouseName: "",
  children: "",
  contactPersonName: "",
  contactPersonPhone: "",

  //   card: "",
  //   prescription: "",
};
export const OtherRecordsForm = (props) => {
  const classes = useStyles();
  const { postData, recordForEdit, inputDisabled, setNotify } = props;

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
  const [inputValue, setInputValue] = useState("");
  const [employee, setEmployee] = useState("");

  //populating data into form

  const populateValues = async () => {
    const { data: employees } = await getActiveEmployees();
    setEmployee(employees);
  };

  useEffect(() => {
    //populate if there are records

    populateValues();

    if (recordForEdit != null) {
      setValues({
        ...recordForEdit,
      });
      setInputValue(recordForEdit.employee.fullName);
    }
  }, [recordForEdit]);

  //saving data to db

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await postData(values);
    } catch (ex) {
      if (ex.response && ex.response.status < 404) {
        setNotify({
          isOpen: true,
          message: ex.response.data,
          type: "warning",
        });
      } else {
        setNotify({
          isOpen: true,
          message: "SERVER ERROR - please contact your sytem admin !",
          type: "error",
        });
      }
    }
  };

  return (
    <div className={classes.root}>
      <Form onSubmit={handleSubmit}>
        {recordForEdit ? (
          <Autocomplete
            disablePortal
            id="employeeId"
            options={employee}
            size="small"
            inputValue={inputValue}
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
        ) : (
          <Autocomplete
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
        )}

        <Controls.Select
          name="maritalStatus"
          label="marital status"
          value={values.maritalStatus}
          options={maritalStatus}
          onChange={handleOnChange}
          inputProps={{ readOnly: inputDisabled }}
        />
        {[
          values.maritalStatus === "Married" && [
            <Controls.Input
              name="spouseName"
              label="spouse name"
              value={values.spouseName || values.employee}
              onChange={handleOnChange}
              inputProps={{ readOnly: inputDisabled }}
            />,
            <Controls.Input
              name="children"
              label="No of children"
              value={values.children}
              onChange={handleOnChange}
              type="number"
              inputProps={{ readOnly: inputDisabled }}
            />,
          ],
        ]}

        <Controls.Input
          name="contactPersonName"
          label="contact person"
          value={values.contactPersonName}
          onChange={handleOnChange}
          inputProps={{ readOnly: inputDisabled }}
          multiline
          rows={2}
        />
        <Controls.Input
          name="contactPersonPhone"
          label="contact person phone"
          value={values.contactPersonPhone}
          onChange={handleOnChange}
          type="number"
          inputProps={{ readOnly: inputDisabled }}
          multiline
          rows={3}
        />

        <Controls.Button text="Submit" type="submit" disabled={inputDisabled} />
      </Form>
    </div>
  );
};
