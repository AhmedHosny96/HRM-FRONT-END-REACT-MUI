import React from "react";
import PropTypes from "prop-types";
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@material-ui/core";

export default function Select(props) {
  const { name, label, value, onChange, options, error, ...rest } = props;
  return (
    <FormControl
      size="small"
      variant="outlined"
      {...(error && { error: true })}
    >
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        required
        {...rest}
      >
        <MenuItem value=""></MenuItem>
        {options.map((option) => (
          <MenuItem key={option._id || option.id} value={option._id || option}>
            {option.name || option}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
};
