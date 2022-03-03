import React, { useState, useEffect } from "react";
import {
  Grid,
  InputAdornment,
  Avatar,
  Typography,
  CircularProgress,
  Link,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";
import { Snackbar } from "@material-ui/core";
import brand from "../../../src/www.jpg";

import { Lock, Email } from "@material-ui/icons";
import Controls from "../controls/controls";
import { useForm, Form } from "../common/useForm";
import auth from "../../services/authService";
import Notifications from "../../views/controls/Notifications";
import Alert from "@material-ui/lab/Alert";

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
  console.log(props.user);
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
  const [isFetching, setIsFetching] = useState(false);
  const [alertVisible, setAlertVisible] = useState({
    open: false,
    message: "",
    type: "",
  });

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  //check if user signed Up

  // handling submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);

    setTimeout(() => {
      alert("done");
    }, 1000);

    try {
      //
      const { email, password } = { ...values };
      await auth.loginUser(email, password);
      const user = auth.getCurrentUser();
      if (user.firstLogin == 1) {
        props.history.push(`/change-password/${user._id}/${user.token}`);
      } else {
        const { state } = props.location;

        window.location = state ? state.from.pathname : "/admin/dashboard";
        // props.history.push("/admin/dashboard");
      }

      // if (currentUser.firstLogin === 0) window.location = "/admin/dashboard";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        setIsFetching(false);
        setAlertVisible({
          open: true,
          message: ex.response.data,
          type: "error",
        });
      } else {
        setIsFetching(false);

        setAlertVisible({
          open: true,
          message:
            "Unexpected error occurred ,  Please Contact your system Admin. !",
          type: "error",
        });
      }
    }
  };

  //

  //useStyles
  const classes = useStyles();

  return (
    <div>
      <Grid container className={classes.container}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
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
          <Snackbar
            open={alertVisible.open}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            onClose={() => setAlertVisible(false)}
            autoHideDuration={50000}
          >
            <Alert severity="error">{alertVisible.message}</Alert>
          </Snackbar>

          <div />
          <div className={classes.inputContainer}>
            <Grid container justify="center"></Grid>
            <Grid container justify="center">
              <Avatar
                style={{
                  backgroundColor: "darkBlue",
                  marginBottom: "20px",
                  width: 56,
                  height: 56,
                }}
              >
                <LockOutlined fontSize="large" />
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

              {isFetching ? (
                <Controls.Button
                  text={<CircularProgress size={20} disableShrink />}
                  type="submit"
                  disabled={isFetching}
                />
              ) : (
                <Controls.Button
                  disabledRipple
                  text="Sign in"
                  type="submit"
                  disabled={(validate && !values.email) || !values.password}
                />
              )}

              <div style={{ height: 20, marginLeft: "5px" }}>
                {/* <Button color="default" variant="contained">
                  Rays Microfinance Instituition
                </Button> */}
              </div>
              <Notifications notify={notify} setNotify={setNotify} />
            </Form>
          </div>

          <Grid item>
            <Link href="http://www.raysmfi.com" target="_blank" variant="body2">
              {`Copyright © Rays microfinance institution ${new Date().getFullYear()}`}
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
