import React from "react";
import { Grid, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import brand from "../../../src/ha.jpg";
import logo from "../../../src/rays.png";

import { Lock, Email } from "@material-ui/icons";
import Controls from "../../views/controls/controls";
import { useForm, Form } from "../common/useForm";
import { loginUser } from "../../services/authService";
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
  const { values, handleOnChange } = useForm(initialValues);

  //field validations

  //login request to server

  const login = async () => {
    const data = { ...values };
    await loginUser(data.email, data.password);
  };

  // handling submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login();
      //   window.alert("Logged in");
      props.history.push("/dashboard");
    } catch (ex) {
      window.alert(ex.response.data);
    }
  };
  //useStyles
  const classes = useStyles();

  return (
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
            <img src={logo} width={200} style={{ borderRadius: "100px" }} />
          </Grid>
          <Form onSubmit={handleSubmit}>
            <Controls.Input
              autoFocus
              name="email"
              label="Email"
              variant="standard"
              values={values.email}
              onChange={handleOnChange}
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
              type="submit "
              validate={values.email}
            />
            <div />
            {/* <Button color="default" variant="contained">
              Rays Microfinance Instituition
            </Button> */}
          </Form>
        </div>
        <div />
      </Grid>
    </Grid>
  );
}
