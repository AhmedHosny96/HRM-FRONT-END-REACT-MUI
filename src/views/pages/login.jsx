import React, { useState, useEffect } from "react";
import {
  Grid,
  InputAdornment,
  Avatar,
  Typography,
  Button,
  Link,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";
import brand from "../../../src/www.jpg";
import logo from "../../../src/www.jpg";

import { Lock, Email } from "@material-ui/icons";
import Controls from "../controls/controls";
import { useForm, Form } from "../common/useForm";
import { loginUser } from "../../services/authService";
import Notifications from "../../views/controls/Notifications";

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100vh",
    "& .MuiFormControl-root": {
      margin: theme.spacing(),
      maxWidth: 400,
      minWidth: 350,
    },

    "& .MuiButtonBase-root": {
      maxWidth: 400,
      minWidth: 350,
    },
    "& .MuiButton-label": {
      textTransform: "uppercase",
    },
  },

  inputContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: "-50px",
    maxWidth: 400,
    minWidth: 350,
  },
  brandImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

//initial values

const initialValues = {
  email: "",
  password: "",
};

export default function login(props) {
  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("email" in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email) ? "" : "Invalid email";

    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };
  // useForm definitions
  const { values, handleOnChange, errors, setErrors } = useForm(
    initialValues,
    true,
    validate
  );
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  //check if user signed Up

  // handling submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { email, password } = { ...values };
      await loginUser(email, password);
      window.location = "/admin/dashboard";
    } catch (ex) {
      setNotify({
        isOpen: true,
        message: ex.response.data,
        type: "error",
      });
    }
  };
  //useStyles
  const classes = useStyles();

  return (
    <div>
      <Grid container className={classes.container}>
        <Grid item xs={12} sm={6}>
          <img src={brand} className={classes.brandImage} />
        </Grid>
        <Grid
          container
          xs={12}
          sm={6}
          alignItems="center"
          direction="column"
          justify="space-between"
        >
          <div />
          <div className={classes.inputContainer}>
            <Grid container justify="center">
              <Avatar sx={{ m: 1, bgcolor: "purple" }}>
                <LockOutlined />
              </Avatar>
            </Grid>
            <Typography
              component="h1"
              variant="h5"
              style={{ textAlign: "center", marginTop: "5px" }}
            >
              Sign in
            </Typography>
            <Form onSubmit={handleSubmit} history={props.history}>
              <Controls.Input
                autoFocus
                name="email"
                label="Email"
                variant="standard"
                values={values.email}
                onChange={handleOnChange}
                error={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              <Controls.Input
                name="password"
                label="Password"
                type="password"
                variant="standard"
                values={values.password}
                onChange={handleOnChange}
                error={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment>
                      <Lock />
                    </InputAdornment>
                  ),
                }}
              />

              <Controls.Button
                text="login"
                type="submit"
                disabled={(validate && !values.email) || !values.password}
              />

              <div style={{ height: 20, marginLeft: "5px" }}>
                {/* <Button color="default" variant="contained">
                  Rays Microfinance Instituition
                </Button> */}
              </div>

              <Notifications notify={notify} setNotify={setNotify} />
            </Form>
          </div>
          <div />
          {/* <Grid item spacing={2}>
            <Button>Forgot password ?</Button>
          </Grid>
          <Grid item>
            <Button>Rays microfinance institution</Button>
          </Grid> */}
        </Grid>
      </Grid>
    </div>
  );
}
