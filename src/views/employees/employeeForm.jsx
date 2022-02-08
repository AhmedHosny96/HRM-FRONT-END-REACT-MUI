import React, { useEffect, useState } from "react";
import { useForm, Form } from "../common/useForm";
import {
  Gender,
  employeeStatus,
  employmentType,
} from "../../views/common/dropDownValues.js";

import { getActiveBranches } from "../../services/branchService";
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
  employmentStatus: "",
  startDate: new Date(),
  status: "Active",
  branch: [],
  job: [],
};

export default function employeeForm(props) {
  const { recordForEdit, postData, setNotify } = props;

  const [branches, setBranches] = useState([]);
  const [jobs, setJobs] = useState([]);

  // extends the reusable form

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("employeeId" in fieldValues)
      temp.employeeId = /^RMF/.test(fieldValues.employeeId)
        ? ""
        : "Invalid ID code ";

    if ("fullName" in fieldValues)
      temp.fullName = fieldValues.fullName ? "" : "Full name is required";
    if ("email" in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email) ? "" : "Invalid email";
    if ("phoneNumber" in fieldValues)
      temp.phoneNumber = /^2519.{8}$/.test(fieldValues.phoneNumber)
        ? ""
        : "Invalid phone number";
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
    handleOnChange;
    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, errors, setErrors, handleOnChange } = useForm(
    initialValues,
    true,
    validate
  );

  // populate drop downs from db

  const populateValues = async () => {
    const { data: branch } = await getActiveBranches();
    const { data: jobs } = await getJobs();

    setBranches(branch);

    console.log(branch);
    setJobs(jobs);
  };

  useEffect(() => {
    // populate select from backend
    // await populateValues();

    populateValues();
    if (recordForEdit != null) {
      setValues({
        ...recordForEdit,
        branchId: recordForEdit.branch._id,
        jobId: recordForEdit.job._id,
      });
    }
  }, [recordForEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        await postData(values);
        console.log(values);
      } catch (error) {}
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Controls.Input
        name="employeeId"
        label="Employee Id"
        value={values.employeeId}
        onChange={handleOnChange}
        error={errors.employeeId}
        required
      />
      <Controls.Input
        name="fullName"
        label="Full Name"
        value={values.fullName}
        onChange={handleOnChange}
        error={errors.fullName}
        required
      />
      <Controls.Input
        name="email"
        label="Email"
        value={values.email}
        onChange={handleOnChange}
        error={errors.email}
        required
      />
      <Controls.Input
        name="phoneNumber"
        label="Phone"
        type="number"
        value={values.phoneNumber}
        onChange={handleOnChange}
        error={errors.phoneNumber}
        required
      />
      <Controls.Select
        name="gender"
        label="Gender"
        value={values.gender}
        options={Gender}
        onChange={handleOnChange}
        error={errors.gender}
        required
      />

      <Controls.Select
        name="branchId"
        label="Branch"
        value={values.branchId}
        options={branches}
        onChange={handleOnChange}
        error={errors.branchId}
        required
      />

      <Controls.Select
        name="jobId"
        label="Job Title"
        value={values.jobId}
        options={jobs}
        onChange={handleOnChange}
        error={errors.jobId}
        required
      />
      <Controls.Date
        name="startDate"
        label="Start date"
        value={values.startDate}
        onChange={handleOnChange}
        required
      />
      <Controls.Input
        name="salary"
        label="Salary"
        type="number"
        value={values.salary}
        onChange={handleOnChange}
        error={errors.salary}
        required
      />
      <Controls.Select
        name="employmentStatus"
        label="Employment Type"
        value={values.employmentStatus}
        options={employmentType}
        onChange={handleOnChange}
        error={errors.employmentStatus}
        required
      />
      {recordForEdit && (
        <Controls.Select
          name="status"
          label="Status"
          value={values.status}
          options={employeeStatus}
          onChange={handleOnChange}
          error={errors.status}
          required
        />
      )}

      {recordForEdit && <Controls.Button text="Update " type="submit" />}
      {!recordForEdit && <Controls.Button text="Submit" type="submit" />}
    </Form>
  );
}
