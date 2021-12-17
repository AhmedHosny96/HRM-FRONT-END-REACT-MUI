import React, { useState } from "react";
import { makeStyles, Snackbar } from "@material-ui/core";
import { Grid, Button } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import brand from "../../../src/ha.jpg";
import logo from "../../../src/rays.png";
import Controls from "../../views/controls/controls";
import { useForm, Form } from "../../views/common/useForm";
// import { saveUser } from "services/userService";
import axios from "axios";
const api = "http://localhost:5000/api/users";
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
  alert: {
    display: "absolute",
    right: "-15px",
  },
}));

const initialValues = {
  // otp : ''
  password: "",
};

export default function userConfirm(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  // validation

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
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

  const id = props.match.params.id;
  const token = props.match.params.token;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // await saveUser(id, token, values);
    axios
      .post(api + "/" + id + "/" + token, values)
      .then(() => window.alert("Success"))
      .catch((err) => window.alert(err.response.data));

    props.push.history("/login");
    // if (validate()) {
    // }

    // save the password to db
  };
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
            <Snackbar
              open={open}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              className={classes.alert}
            >
              <Alert
                severity="warning"
                action={
                  <Button
                    disableRipple
                    size="small"
                    aria-label="close"
                    onClick={() => {
                      setOpen(false);
                    }}
                    style={{ backgroundColor: "transparent" }}
                  >
                    X
                  </Button>
                }
              >
                To verify please submit your password!
              </Alert>
            </Snackbar>
            <Grid container justify="center">
              <img src={logo} width={200} style={{ borderRadius: "100px" }} />
            </Grid>
            <Form onSubmit={handleSubmit}>
              <Controls.Input
                required
                name="password"
                label="Password"
                variant="outlined"
                type="password"
                values={values.email}
                onChange={handleOnChange}
                error={errors.email}
              />
              <Controls.Input
                required
                name="password"
                label="Confirm Password"
                type="password"
                variant="outlined"
                values={values.password}
                onChange={handleOnChange}
                error={errors.password}
              />

              <Controls.Button text="Submit" type="submit" />
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
    </div>
  );
}
