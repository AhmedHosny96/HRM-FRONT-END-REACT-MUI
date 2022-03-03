import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, Form } from "../common/useForm";
import Controls from "../../views/controls/controls";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginLeft: theme.spacing(3),
  },
}));

const departments = ["Rays", "Sahay", "Both"];

const initialValues = {
  code: "",
  name: "",
  department: "",
  description: "",
  qualification: "",
};
export default function jobForm(props) {
  const classes = useStyles();
  const { postData, inputDisabled, recordForEdit, setNotify } = props;

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
          name="code"
          label="Job code"
          value={values.code}
          onChange={handleOnChange}
          error={errors.name}
          inputProps={{ readOnly: inputDisabled }}
        />
        <Controls.Input
          name="name"
          label="Job title"
          value={values.name}
          onChange={handleOnChange}
          error={errors.name}
          inputProps={{ readOnly: inputDisabled }}
        />
        <Controls.Input
          name="description"
          label=" Description"
          value={values.description}
          onChange={handleOnChange}
          error={errors.description}
          inputProps={{ readOnly: inputDisabled }}
          multiline
          rows={3}
          maxRows={4}
        />
        <Controls.Input
          name="qualification"
          label="Qualification"
          value={values.qualification}
          onChange={handleOnChange}
          error={errors.qualification}
          inputProps={{ readOnly: inputDisabled }}
          multiline
          rows={3}
          maxRows={4}
        />
        <Controls.Select
          name="department"
          label="Department"
          value={values.department}
          options={departments}
          onChange={handleOnChange}
          error={errors.department}
          inputProps={{ readOnly: inputDisabled }}
        />

        <Controls.Button text="Submit" type="submit" disabled={inputDisabled} />
      </Form>
    </div>
  );
}
