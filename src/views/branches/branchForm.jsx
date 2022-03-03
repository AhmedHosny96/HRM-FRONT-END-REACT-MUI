import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, Form } from "../common/useForm";
import Controls from "../../views/controls/controls";
import { Locations } from "../../views/common/dropDownValues.js";
// import axios from "axios";
//custom stylings
// const api = "http://localhost:5000/api/branches/";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginLeft: theme.spacing(3),
  },
}));

const statuses = ["Open", "Closed"];

const initialValues = {
  name: "",
  region: "",
  city: "",
  status: "Open",
};

export default function branchForm(props) {
  const classes = useStyles();
  const { postData, recordForEdit, setNotify, inputDisabled } = props;

  //validation

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "Branch name is required";
    if ("region" in fieldValues)
      temp.region = fieldValues.region ? "" : "Location is required";
    if ("city" in fieldValues)
      temp.city = fieldValues.city ? "" : "City name is required";

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
          label="Branch name"
          value={values.name}
          onChange={handleOnChange}
          error={errors.name}
          InputProps={{ readOnly: inputDisabled }}
        />
        <Controls.Select
          name="region"
          label="Region"
          value={values.region}
          options={Locations}
          onChange={handleOnChange}
          error={errors.region}
          inputProps={{ readOnly: inputDisabled }}
        />
        <Controls.Input
          name="city"
          label="city"
          value={values.city}
          onChange={handleOnChange}
          error={errors.city}
          InputProps={{ readOnly: inputDisabled }}
        />
        {recordForEdit && (
          <Controls.Select
            name="status"
            label="Status"
            value={values.status}
            options={statuses}
            onChange={handleOnChange}
            error={errors.status}
            InputProps={{ readOnly: inputDisabled }}
          />
        )}

        <Controls.Button text="Submit" type="submit" disabled={inputDisabled} />
      </Form>
    </div>
  );
}
