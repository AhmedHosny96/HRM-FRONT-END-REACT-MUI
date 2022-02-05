import React, { useState, useEffect } from "react";
import { useForm, Form } from "../../views/common/useForm";

import Controls from "../../views/controls/controls";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getEmployees } from "./../../services/employeeService";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginLeft: theme.spacing(3),
  },
}));

const roles = ["Admin", "User"];

const initialValues = {
  employeeId: "",
  username: "",
  email: "",
  // userRole: "",
};

export default function userForm(props) {
  const { postData, setNotify, recordForEdit } = props;
  const classes = useStyles();

  // form validation

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("username" in fieldValues)
      temp.username = fieldValues.username ? "" : "username is required";
    if ("email" in fieldValues)
      temp.email = /&^|.+@.+..+/.test(fieldValues.email)
        ? ""
        : "Invalid email address";

    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };
  const { values, errors, setValues, setErrors, handleOnChange } = useForm(
    initialValues,
    true,
    validate
  );
  //handle submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      await postData(values);
    }
  };
  const [employee, setEmployee] = useState("");

  const populateValues = async () => {
    const { data: employees } = await getEmployees();
    setEmployee(employees);
  };

  useEffect(() => {
    populateValues();
    if (recordForEdit != null) {
      setValues({
        ...recordForEdit,
      });
    }
  }, []);

  return (
    <div className={classes.root}>
      <Form onSubmit={handleSubmit}>
        <Autocomplete
          disablePortal
          id="employeeId"
          options={employee}
          noOptionsText="No employee data"
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
          name="username"
          label="Username"
          values={values.username}
          onChange={handleOnChange}
          error={errors.username}
        />
        <Controls.Input
          name="email"
          label="Email"
          values={values.email}
          onChange={handleOnChange}
          error={errors.email}
        />

        {/* <Controls.Select
          name="userRole"
          label="User role"
          value={values.userRole}
          options={roles}
          onChange={handleOnChange}
          error={errors.userRole}
        ></Controls.Select> */}
        <Controls.Button text="Submit" type="submit" />
      </Form>
    </div>
  );
}
