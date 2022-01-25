import React from "react";
import PropTypes from "prop-types";

import { TextField, TextareaAutosize } from "@material-ui/core";
// import { TextField } from "@mui/material";

export default function useInput(props) {
  const { name, label, value, onChange, error = null, ...rest } = props;
  return (
    <TextField
      // required
      variant="outlined"
      name={name}
      label={label}
      size="small"
      value={value}
      onChange={onChange}
      {...(error && { error: true, helperText: error })}
      {...rest}
      required
    />
  );
}

useInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
