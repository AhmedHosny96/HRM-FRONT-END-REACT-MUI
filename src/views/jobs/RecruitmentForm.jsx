import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, Form } from "../common/useForm";
import Controls from "../../views/controls/controls";
import { getJobs } from "../../services/jobService";
import { employmentType, statuses } from "../../views/common/dropDownValues";
import { getActiveBranches } from "./../../services/branchService";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginLeft: theme.spacing(3),
  },
}));

const initialValues = {
  branchId: "",
  jobId: "",
  requiredNumber: "",
  jobDescription: "",
  employementType: "",
  status: "Pending",
};

export default function RecruitmentForm(props) {
  const classes = useStyles();
  const { postData, recordForEdit, setNotify, inputDisabled } = props;

  //validation

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    // if ("jobId" in fieldValues)
    //   temp.jobId = fieldValues.jobId ? "" : "Position is required";
    // if ("requiredNumber" in fieldValues)
    //   temp.requiredNumber = fieldValues.requiredNumber
    //     ? ""
    //     : "Required no is required";
    // if ("department" in fieldValues)
    //   temp.department = fieldValues.department ? "" : "Department is required";

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

  const [job, setJob] = useState([]);
  const [branch, setBranch] = useState([]);

  //populating data into form

  const populateValues = async () => {
    const { data: jobs } = await getJobs();
    const { data: branch } = await getActiveBranches();
    setJob(jobs);
    setBranch(branch);
  };

  useEffect(async () => {
    //populate if there are records

    populateValues();

    if (recordForEdit != null)
      setValues({
        branchId: recordForEdit.branch._id,
        jobId: recordForEdit.job._id,
        ...recordForEdit,
      });
  }, [recordForEdit]);

  //saving data to db

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
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
    }
  };
  return (
    <div className={classes.root}>
      <Form onSubmit={handleSubmit}>
        <Controls.Select
          name="branchId"
          label="Branch"
          value={values.branchId}
          options={branch}
          onChange={handleOnChange}
          error={errors.department}
          disabled={inputDisabled}
          required
        />
        <Controls.Select
          name="jobId"
          label="Position"
          value={values.jobId}
          options={job}
          onChange={handleOnChange}
          error={errors.department}
          disabled={inputDisabled}
          required
        />

        <Controls.Input
          name="requiredNumber"
          label="Required number"
          value={values.requiredNumber}
          onChange={handleOnChange}
          error={errors.name}
          disabled={inputDisabled}
          required
        />
        <Controls.Select
          name="employementType"
          label="Employement Type"
          value={values.employementType}
          options={employmentType}
          onChange={handleOnChange}
          error={errors.department}
          disabled={inputDisabled}
          required
        />
        <Controls.Input
          name="jobDescription"
          label="Job description"
          value={values.jobDescription}
          onChange={handleOnChange}
          error={errors.name}
          type="textArea"
          disabled={inputDisabled}
          multiline
          rows={2}
          maxRows={4}
        />
        {recordForEdit && (
          <Controls.Select
            name="status"
            label="Status"
            value={values.status}
            options={statuses}
            onChange={handleOnChange}
            error={errors.department}
            disabled={inputDisabled}
            required
          />
        )}
        <Controls.Button text="Submit" type="submit" disabled={inputDisabled} />
      </Form>
    </div>
  );
}
