import { Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { useForm, Form } from "../common/useForm";

import { getBranches } from "../../services/branchService";
import { getJobs } from "../../services/jobService";
import Controls from "../../views/controls/controls";

const initialValues = {
  employeeId: "",
  fullName: "",
  email: "",
  phoneNumber: "",
  gender: "",
  branchId: "",
  jobId: "",
  salary: "",
  employementType: "",
  startDate: new Date(),
  status: "Active",
  image: "",

  branches: [],
  jobs: [],
  gendercollection: ["male", "female"],
  employments: [
    "Full Time permanent",
    "Full Time Contract ",
    "Part Time Contract",
  ],
};

export default function employeeForm(props) {
  const { recordForEdit } = props;

  // extends the reusable form

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("fullName" in fieldValues)
      temp.fullName = fieldValues.fullName ? "" : "Full name is required";
    if ("email" in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email) ? "" : "Invalid email";
    if ("phoneNumber" in fieldValues)
      temp.phoneNumber = fieldValues.phoneNumber
        ? ""
        : "Phone number is required";
    if ("gender" in fieldValues)
      temp.gender = fieldValues.gender ? "" : "Gender is required";
    if ("jobId" in fieldValues)
      temp.jobId = fieldValues.jobId ? "" : "Job Title is required";
    if ("branchId" in fieldValues)
      temp.branchId = fieldValues.branchId ? "" : "Branch is required";
    if ("salary" in fieldValues)
      temp.salary = fieldValues.salary ? "" : "Salary is required";

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

  // populate drop downs from db

  const populateValues = async () => {
    const { data: jobs } = await getJobs();
    const { data: branches } = await getBranches();

    setValues({
      jobs,
      branches,
    });
  };

  useEffect(async () => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });

    await populateValues();
  }, [recordForEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      window.alert("submmited");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            name="fullName"
            label="Full Name"
            value={values.fullName}
            onChange={handleOnChange}
            error={errors.fullName}
          />
          <Controls.Input
            name="email"
            label="Email"
            value={values.email}
            onChange={handleOnChange}
            error={errors.email}
          />
          <Controls.Input
            name="phoneNumber"
            label="Phone"
            type="number"
            value={values.phoneNumber}
            onChange={handleOnChange}
            error={errors.phoneNumber}
          />

          <Controls.Select
            name="branchId"
            label="Branch"
            value={values.branchId}
            options={values.branches}
            onChange={handleOnChange}
            error={errors.branchId}
          />
          <Controls.Select
            name="jobId"
            label="Job Title"
            value={values.jobId}
            options={values.jobs}
            onChange={handleOnChange}
            error={errors.jobId}
          />
          <Controls.Button text="Submit " type="submit" />
        </Grid>
        <Grid item xs={6}>
          <Controls.Date
            name="startDate"
            label="Start date"
            value={values.startDate}
            onChange={handleOnChange}
          />
          <Controls.Input
            name="salary"
            label="Salary"
            type="number"
            value={values.salary}
            onChange={handleOnChange}
            error={errors.salary}
          />
          {/* <Controls.Select
            name="employementType"
            label="Employment Type"
            value={values.employementType}
            options={initialValues.employments}
            onChange={handleOnChange}
            error={errors.employementType}
          /> */}
        </Grid>
      </Grid>
    </Form>
  );
}
