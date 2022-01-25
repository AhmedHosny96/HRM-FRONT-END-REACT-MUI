import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, Form } from "../common/useForm";
import Controls from "../controls/controls";
import {
  getEmployeeByBranch,
  getEmployees,
} from "../../services/employeeService";
import { getBranches } from "../../services/branchService";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: theme.spacing(3),
  },
}));

// const employees = ["Ahmed ", "Hosny"];

const leaves = ["Anual leave ", "Sick Leave"];

const initialValues = {
  branchId: "",
  employeeId: "",
  type: "",
  department: "",
  startDate: "",
  returnDate: "",
};
export default function leaveForm(props) {
  const classes = useStyles();
  const { recordForEdit, setNotify } = props;

  //validation

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("branchId" in fieldValues)
      temp.branchId = fieldValues.branchId ? "" : "select your branch";
    if ("employeeId" in fieldValues)
      temp.employeeId = fieldValues.employeeId ? "" : "employee is required";
    if ("type" in fieldValues)
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

  const [branches, setBranches] = useState([]);

  //populating data into form

  // const onChangeCombo = (e) => {
  //   const selectId = e.target.value;

  //   const selectedBranch = branches.filter(
  //     (branch) => branch._id == selectId
  //   )[0];
  //   console.log(selectedBranch);
  //   const selectedEmpoyee = employees.filter(
  //     (employee) => employee._id == selectId
  //   );

  //   setValues({
  //     branchId: selectedBranch._id,
  //     employeeId: selectedEmpoyee._id,
  //   });

  //   setBranches(selectedBranch);
  // };

  // const populateVales = async () => {
  //   const { data: branch } = await getBranches();

  //   setBranches(branch);

  //   // const { response } = await getEmployeeByBranch(values.branchId);
  //   // setEmployees(response);

  //   console.log("popu" + branch[1][0]);
  // };
  //

  useEffect(async () => {
    const { data: branch } = await getBranches();
    setBranches(branch);

    if (values != null) {
      setValues({
        branchId: branches.filter((brId) => brId._id),
        ...values,
      });

      // setValues({branchId : branches.filter})
    }

    //populate if there are records
  });

  //saving data to db

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (validate()) {
    //   try {
    //     // await postData(values);
    //   } catch (ex) {
    //     setNotify({
    //       isOpen: true,
    //       message: ex.response.data,
    //       type: "warning",
    //     });
    //   }
    // }
  };

  return (
    <div className={classes.root}>
      {/* {console.log("branchId " + values.branchId)} */}
      {/* {console.log("branchId " + values.branchId)} */}

      <Form onSubmit={handleSubmit}>
        <Controls.Select
          name="branchId"
          label="branch"
          value={values.branchId}
          options={branches}
          onChange={handleOnChange}
          error={errors.branchId}
        />
        {/* {getEmployeeByBranch(values.branchId)} */}

        {/* <Controls.Select
          name="employeeId"
          label="Employee"
          value={values.employeeId}
          options={employees}
          onChange={handleOnChange}
          error={errors.employeeId}
        /> */}

        {/* <Controls.Select
          name="type"
          label="Leave type"
          value={values.type}
          options={leaves}
          onChange={handleOnChange}
          error={errors.type}
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
        />
      </Form>

      <Controls.Button text="Apply" type="submit" />
    </div>
  );
}
