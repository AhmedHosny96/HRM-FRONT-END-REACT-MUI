import React, { useState } from "react";
import { Grid, Avatar, Typography } from "@material-ui/core";
import { VpnKeyTwoTone } from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";
import brand from "../../../src/www.jpg";

import Controls from "../controls/controls";
import { useForm, Form } from "../common/useForm";
import auth from "../../services/authService";
import Notifications from "../../views/controls/Notifications";
import Alert from "@material-ui/lab/Alert";
import * as Yup from "yup";
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
    marginTop: "-120px",
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
  password: "",
  confirmPassword: "",
};

export default function ChangePassword(props) {
  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("password" in fieldValues) {
      temp.password =
        fieldValues.password.length < 8
          ? "password should be minimum 8 characters"
          : "";
    }

    if ("confirmPassword" in fieldValues) {
      if (fieldValues.confirmPassword !== values.password) {
        temp.confirmPassword = "Password doesn't match";
      } else {
        temp.confirmPassword = "";
      }
    }

    setErrors({ ...temp });
    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  // useForm definitions
  const { values, handleOnChange, errors, setErrors } = useForm(
    initialValues,
    true,
    validate
  );
  const [isFetching, setIsFetching] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const id = props.match.params.id;
        const password = { ...values };
        await auth.changePassword(id, password);
        //
        setIsFetching(true);
        // props.history.push("/login");
        window.location = "/login";
        setNotify({
          isOpen: true,
          message: "User verified successfully",
          type: "success",
        });
      } catch (ex) {
        setNotify({
          isOpen: true,
          message: ex.response.data,
          type: "error",
        });
      }
    }
  };

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
          <Alert
            variant="outlined"
            severity="info"
            style={{ marginTop: "20px" }}
          >
            <div />
            To login please create new password for your account.
          </Alert>
          <div item>
            <Avatar
              style={{
                backgroundColor: "darkBlue",
                marginBottom: "20px",
                width: 56,
                height: 56,
              }}
            >
              <VpnKeyTwoTone />
            </Avatar>
          </div>
          <div className={classes.inputContainer}>
            <Typography
              component="h1"
              variant="h5"
              style={{ textAlign: "center", marginTop: "5px" }}
            ></Typography>
            <Form onSubmit={handleSubmit} history={props.history}>
              <Controls.Input
                autoFocus
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                values={values.password}
                onChange={handleOnChange}
                error={errors.password}
              />
              <Controls.Input
                name="confirmPassword"
                label="Confirm password"
                type="password"
                variant="outlined"
                values={values.confirmPassword}
                onChange={handleOnChange}
                error={errors.confirmPassword}
              />

              <Controls.Button
                text="change password"
                type="submit"
                disabled={!errors}
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
