import React, { useState, useEffect } from "react";
import { Grid, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import brand from "../../../src/ha.jpg";
import logo from "../../../src/rays.png";

import { Lock, Email } from "@material-ui/icons";
import Controls from "../controls/controls";
import { useForm, Form } from "../common/useForm";
import { loginUser } from "../../services/authService";
// import { getUser } from "../../services/userService";
import Popup from "../controls/Popup";
// import { useParams } from "react-router-dom";
import UserConfirm from "./userConfirm";

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
  const [openPopup, setOpenPopup] = useState(false);
  const [popUpClose, setpopUpClose] = useState(false);
  // const [, setDisabled] = useState(false);
  //field validations

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
  //check if user signed Up

  const userID = props.match.params.id;
  useEffect(() => {
    // setDisabled();

    if (userID) {
      setOpenPopup(true);
      setpopUpClose(true);
    }
    // if params.id
  }, []);
  // const { id } = useParams();
  // console.log("param id : ", id);
  //login request to server

  const login = async () => {
    const data = { ...values };
    await loginUser(data.email, data.password);
  };

  // handling submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        await login();
        //   window.alert("Logged in");
        props.history.push("/dashboard");
      } catch (ex) {
        // window.alert(ex.response.data);
      }
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
              {/* <Controls.Button
              text="test confirmation"
              color="outlined"
              onClick={() => setOpenPopup(true)}
            /> */}

              <div />
              {/* <Button color="default" variant="contained">
            Rays Microfinance Instituition
          </Button> */}
            </Form>
          </div>
          <div />
        </Grid>
      </Grid>

      <Popup
        title="User Confirmation"
        openPopup={openPopup}
        popUpClose={popUpClose}
        setpopUpClose={setpopUpClose}
        setOpenPopup={setOpenPopup}
      >
        <UserConfirm></UserConfirm>
      </Popup>
    </div>
  );
}
