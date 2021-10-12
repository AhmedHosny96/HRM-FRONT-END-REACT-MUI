import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, Form } from "../common/useForm";
import Controls from "../../views/controls/controls";
import { saveBranch } from "../../services/branchService";

// import axios from "axios";
//custom stylings
// const api = "http://localhost:5000/api/branches/";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    margin: theme.spacing(5),
    padding: theme.spacing(2),
  },
}));

const locations = [
  "Addis Abeba",
  "Dire Dawa",
  "Fafan",
  "Afdher",
  "Jarar",
  "Korahey",
  "Dollo",
  "Shabelle ",
  "Liban",
  "Dawa",
  "Nogob",
  "Erer",
];

const initialValues = {
  name: "",
  region: "",
  city: "",
};

export default function branchForm() {
  //validation

  const validate = () => {
    let temp = {};

    temp.name = values.name ? "" : "Branch name is required";
    temp.region = values.region ? "" : "Location is required";
    temp.city = values.city ? "" : "City name is required";

    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x == "");
  };

  const { values, errors, setErrors, handleOnChange } = useForm(initialValues);
  const classes = useStyles();

  //saving data to db
  const postData = async () => {
    const data = { ...values };
    await saveBranch(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate())
      try {
        await postData();
        window.alert("Sucess !");
      } catch (ex) {
        window.alert(ex.response.data);
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
          options={locations}
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

        <Controls.Button text="Submit" type="submit" />
      </Form>
    </div>
  );
}
