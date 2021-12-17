import React from "react";
import { useForm, Form } from "../../views/common/useForm";

import Controls from "../../views/controls/controls";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginLeft: theme.spacing(3),
  },
}));

const roles = ["HR admin", "HR officer"];

const initialValues = {
  name: "",
  email: "",
  phone: "",
  userRole: "",
  password: "",
};

export default function userForm(props) {
  const { postData } = props;
  const classes = useStyles();

  // form validation

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "Name is required";
    if ("email" in fieldValues)
      temp.email = /&^|.+@.+..+/.test(fieldValues.email)
        ? ""
        : "Invalid email address";
    if ("phone" in fieldValues)
      temp.phone = fieldValues.phone ? "" : "Phone number is required";
    if ("userRole" in fieldValues)
      temp.userRole = fieldValues.userRole ? "" : "User role is required";

    if ("password" in fieldValues)
      temp.password = fieldValues.password ? "" : "Password is required";

    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };
  const { values, errors, setErrors, handleOnChange } = useForm(
    initialValues,
    true,
    validate
  );
  //handle submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        await postData(values);
      } catch (ex) {
        window.alert(ex.response.data);
      }
    }
  };

  return (
    <div className={classes.root}>
      <Form onSubmit={handleSubmit}>
        <Controls.Input
          name="name"
          label="Name"
          values={values.name}
          onChange={handleOnChange}
          error={errors.name}
        />
        <Controls.Input
          name="email"
          label="Email"
          values={values.email}
          onChange={handleOnChange}
          error={errors.email}
        />
        <Controls.Input
          name="phone"
          label="Phone"
          values={values.phone}
          onChange={handleOnChange}
          error={errors.phone}
        />
        <Controls.Input
          name="password"
          label="Password"
          type="password"
          values={values.password}
          onChange={handleOnChange}
          error={errors.password}
        />
        <Controls.Select
          name="userRole"
          label="User role"
          value={values.userRole}
          options={roles}
          onChange={handleOnChange}
          error={errors.userRole}
        ></Controls.Select>
        <Controls.Button text="Submit" type="submit" />
      </Form>
    </div>
  );
}
