import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core";

//button styling

export function useForm(initialValues, validateOnChange = false, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  // const [branches, setBranches] = useState([]);

  //handle input onChange
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
    // console.log(values);
    if (validateOnChange) validate({ [name]: value });
  };

  // const handleSelectWithValueChange = (e) => {
  //   const { name, value } = e.target;
  //   const selectedBranch = branches.filter((branch) => branch._id == value)[0];
  //   // console.log(selectedBranch[0]);

  //   setValues({
  //     ...values,
  //     ...selectBranch,
  //     [name]: value,
  //   });
  //   // console.log(values);
  //   if (validateOnChange) validate({ [name]: value });
  // };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleOnChange,
    // branches,
    // setBranches,
    // handleSelectWithValueChange,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(0.5),
    },
  },
}));

export function Form(props) {
  const classes = useStyles();
  const { children, ...rest } = props;

  return (
    <form className={classes.root} {...rest}>
      {children}
    </form>
  );
}

Form.propTypes = {
  children: PropTypes.object.isRequired,
};
