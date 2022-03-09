import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { useForm, Form } from "../common/useForm";
import Controls from "../../views/controls/controls";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Gender,
  medicalStatus,
  patient,
} from "../../views/common/dropDownValues";
import {
  getActiveEmployees,
  getEmployees,
} from "./../../services/employeeService";
import { getMedicals } from "./../../services/medicalService";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginLeft: theme.spacing(3),
  },
}));

const initialValues = {
  medicalExpenseId: "",
  employeeId: "",
  patient: "",
  name: "",
  gender: "",
  age: "",
  hospitalName: "",
  location: "",
  amount: "",
  status: "",
  //   card: "",
  //   prescription: "",
};
export default function MedicalRequestForm(props) {
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
  const [medical, setMedical] = useState([]);

  //populating data into form

  const populateValues = async () => {
    const { data: employees } = await getActiveEmployees();
    setEmployee(employees);
  };

  const populateMedical = async () => {
    const { data: medicals } = await getMedicals();
    setMedical(medicals);
  };

  useEffect(() => {
    //populate if there are records

    populateValues();
    populateMedical();

    if (recordForEdit != null) {
      setValues({
        ...recordForEdit,
        medicalExpenseId: recordForEdit.medicalExpense._id,
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
            options={[employee]}
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
          name="medicalExpenseId"
          label="Medical claim"
          value={values.medicalExpenseId}
          options={medical}
          onChange={handleOnChange}
          inputProps={{ readOnly: inputDisabled }}
        />
        {/* <Autocomplete
          disablePortal
          id="medicalExpenseId"
          options={medical}
          size="small"
          sx={{ width: 300 }}
          getOptionLabel={(medical) => medical.name}
          renderInput={(params) => (
            <Controls.Input
              {...params}
              label="Medical claim"
              value={values.medicalExpenseId}
              onChange={handleOnChange}
            />
          )}
          onChange={(event, selectedValue) => {
            setValues({ medicalExpenseId: selectedValue._id });
          }}
        /> */}

        <Controls.Select
          name="patient"
          label="patient"
          value={values.patient}
          options={patient}
          onChange={handleOnChange}
          inputProps={{ readOnly: inputDisabled }}
        />
        {values.patient != "staff" && (
          <Controls.Input
            name="name"
            label="name"
            value={values.name || values.employee}
            onChange={handleOnChange}
            inputProps={{ readOnly: inputDisabled }}
          />
        )}

        {values.patient != "staff" && (
          <Controls.Select
            name="gender"
            label="Gender"
            value={values.gender}
            options={Gender}
            onChange={handleOnChange}
            inputProps={{ readOnly: inputDisabled }}
          />
        )}
        {values.patient != "staff" && (
          <Controls.Input
            name="age"
            label="Age"
            value={values.age}
            onChange={handleOnChange}
            type="number"
            inputProps={{ readOnly: inputDisabled }}
          />
        )}

        <Controls.Input
          name="hospitalName"
          label="Hospital"
          value={values.hospitalName}
          onChange={handleOnChange}
          inputProps={{ readOnly: inputDisabled }}
        />
        <Controls.Input
          name="location"
          label="Location"
          value={values.location}
          onChange={handleOnChange}
          inputProps={{ readOnly: inputDisabled }}
        />
        <Controls.Input
          name="amount"
          label="Total amount"
          value={values.amount}
          onChange={handleOnChange}
          type="number"
          inputProps={{ readOnly: inputDisabled }}
        />
        {recordForEdit && (
          <Controls.Select
            name="status"
            label="Status"
            value={values.status}
            options={medicalStatus}
            onChange={handleOnChange}
            inputProps={{ readOnly: inputDisabled }}
          />
        )}
        <Controls.Button text="Submit" type="submit" disabled={inputDisabled} />
      </Form>
    </div>
  );
}
