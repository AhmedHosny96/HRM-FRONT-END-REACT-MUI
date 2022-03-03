import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { useForm, Form } from "../common/useForm";
import Controls from "../../views/controls/controls";
import { patient } from "../../views/common/dropDownValues";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginLeft: theme.spacing(3),
  },
}));

const initialValues = {
  name: "",
  allowedFor: [],
  allowedAmount: "",
};
export default function MedicalForm(props) {
  const classes = useStyles();
  const { postData, recordForEdit, setNotify, inputDisabled } = props;

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

  //populating data into form

  useEffect(() => {
    //populate if there are records

    if (recordForEdit != null)
      setValues({
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
        <Controls.Input
          name="name"
          label="Type"
          value={values.name}
          onChange={handleOnChange}
          error={errors.name}
          InputProps={{ readOnly: inputDisabled }}
        />

        <Controls.Select
          name="allowedFor"
          label="Allowed for "
          options={patient}
          value={values.allowedFor}
          onChange={handleOnChange}
          error={errors.allowedFor}
          inputProps={{ readOnly: inputDisabled }}
          multiple
        />
        <Controls.Input
          name="allowedAmount"
          label="Allowed amount"
          value={values.allowedAmount}
          onChange={handleOnChange}
          error={errors.allowedAmount}
          InputProps={{ readOnly: inputDisabled }}
        />

        <Controls.Button text="Submit" type="submit" disabled={inputDisabled} />
      </Form>
    </div>
  );
}
