import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, Form } from "../common/useForm";
import Controls from "../../views/controls/controls";
import { getLocations } from "../../views/common/dropDownValues.js";
// import axios from "axios";
//custom stylings
// const api = "http://localhost:5000/api/branches/";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginLeft: theme.spacing(3),
  },
}));

const initialValues = {
  name: "",
  region: "",
  city: "",
  status: "",
};

const statuses = ["Open", "Closed"];

export default function branchForm(props) {
  const classes = useStyles();
  const { postData, recordForEdit, setNotify } = props;
  
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
        setNotify({
          isOpen: true,
          message: ex.response.data,
          type: "warning",
        });
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
        />
        <Controls.Select
          name="region"
          label="Region"
          value={values.region}
          options={getLocations()}
          onChange={handleOnChange}
          error={errors.region}
        />
        <Controls.Input
          name="city"
          label="city"
          value={values.city}
          onChange={handleOnChange}
          error={errors.city}
        />
        <Controls.Select
          name="status"
          label="Status"
          value={values.status}
          options={statuses}
          onChange={handleOnChange}
          error={errors.status}
        />

        <Controls.Button text="Submit" type="submit" />
      </Form>
    </div>
  );
}
