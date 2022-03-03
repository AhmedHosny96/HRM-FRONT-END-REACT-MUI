import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useForm, Form } from "../common/useForm";
import Controls from "../controls/controls";
import {
  getActiveEmployees,
  getEmployees,
} from "../../services/employeeService";
import { getLeaves } from "./../../services/leaveService";
import { getActiveBranches, getBranches } from "services/branchService";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: theme.spacing(3),
  },
}));

import { statuses } from "../common/dropDownValues";
// const employees = ["Ahmed ", "Hosny"];

const initialValues = {
  employeeId: "",
  leaveId: "",
  startDate: Date.now(),
  returnDate: new Date(),
  status: "",
};
export default function LeaveRequestForm(props) {
  const classes = useStyles();
  const { postData, recordForEdit, setNotify, isInputDisabled } = props;

  const [inputValue, setInputValue] = useState("");
  const [inputValueLeave, setInputValueLeave] = useState("");

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    // if ("branchId" in fieldValues)
    //   temp.branchId = fieldValues.branchId ? "" : "select your branch";
    if ("employeeId" in fieldValues)
      temp.employeeId = fieldValues.employeeId ? "" : "employee is required";
    if ("leaveId" in fieldValues)
      temp.type = fieldValues.type ? "" : "Leave type is required";
    if ("startDate" in fieldValues)
      temp.startDate = fieldValues.startDate ? "" : "Start date is required";
    if ("returnDate" in fieldValues)
      temp.returnDate = fieldValues.returnDate ? "" : "Return date is required";

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
  const [leaves, setLeaves] = useState([]);

  //populating data into form

  const populateValues = async () => {
    const { data: employees } = await getEmployees();
    setEmployee(employees);
  };
  const populateLeaves = async () => {
    const { data: leave } = await getLeaves();
    setLeaves(leave);
  };

  useEffect(async () => {
    populateLeaves();
    populateValues();

    if (recordForEdit != null) {
      setValues({
        ...recordForEdit,
        // employeeId: recordForEdit.employee._id,
      });
      setInputValue(recordForEdit.employee.fullName);
      setInputValueLeave(recordForEdit.leave.leaveType);
    }
  }, [recordForEdit]);

  //saving data to db

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (validate()) {
    try {
      await postData(values);
    } catch (ex) {
      setNotify({
        isOpen: true,
        message: ex.response.data,
        type: "warning",
      });
      // }
    }
  };

  return (
    <div className={classes.root}>
      <Form onSubmit={handleSubmit}>
        <Autocomplete
          disablePortal
          id="employeeId"
          options={employee}
          size="small"
          sx={{ width: 300 }}
          getOptionLabel={(employee) => employee.fullName || employee}
          renderInput={(params) => (
            <Controls.Input
              {...params}
              label="Employee"
              name="employeeId"
              value={values.employeeId}
              onChange={handleOnChange}
            />
          )}
          onChange={(event, selectedValue) => {
            setValues({ employeeId: selectedValue._id });
          }}
          inputValue={recordForEdit ? inputValue : undefined}
        />

        <Autocomplete
          disablePortal
          id="employeeId"
          options={leaves}
          size="small"
          sx={{ width: 300 }}
          getOptionLabel={(leave) => leave.leaveType || leave}
          renderInput={(params) => (
            <Controls.Input
              {...params}
              label="Leave type"
              name="leaveId"
              value={values.leaveId}
              onChange={handleOnChange}
            />
          )}
          onChange={(event, selectedValue) => {
            setValues({ ...values, leaveId: selectedValue._id });
          }}
          inputValue={recordForEdit ? inputValueLeave : undefined}
        />

        {/* <Controls.Select
          name="leaveId"
          label="Leave type"
          value={values.leaveId}
          options={leaves}
          onChange={handleOnChange}
          error={errors.leaveId}
        /> */}
        <Controls.Date
          name="startDate"
          label="Start date"
          value={values.startDate}
          onChange={handleOnChange}
        />
        <Controls.Date
          name="returnDate"
          label="Return date"
          value={values.returnDate}
          onChange={handleOnChange}
          required
        />
        {recordForEdit && (
          <Controls.Select
            name="status"
            label="Status"
            value={values.status}
            options={statuses}
            onChange={handleOnChange}
            required
          />
        )}
        <Controls.Button text="Submit" type="submit" />
      </Form>
    </div>
  );
}
