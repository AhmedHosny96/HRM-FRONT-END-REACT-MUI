import React from "react";
import PropTypes from "prop-types";

import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

export default function DatePicker(props) {
  //convert to different event parameter
  const { name, label, value, onChange } = props;

  const convertParam = (name, value) => ({
    target: {
      name,
      value,
    },
  });

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        autoOk
        variant="inline"
        inputVariant="outlined"
        size="small"
        format="MMM/dd/yyyy"
        value={value}
        name={name}
        label={label}
        onChange={(date) => onChange(convertParam(name, date))}
      ></KeyboardDatePicker>
    </MuiPickersUtilsProvider>
  );
}

DatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.object.isRequired,
};

// import * as React from "react";
// import TextField from "@mui/material/TextField";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";

// import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
// import Stack from "@mui/material/Stack";

// export default function DatePicker() {
//   const [value, setValue] = React.useState(new Date());

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Stack spacing={3}>
//         <DesktopDatePicker
//           size="small"
//           label="For desktop"
//           value={value}
//           minDate={new Date("2017-01-01")}
//           onChange={(newValue) => {
//             setValue(newValue);
//           }}
//           renderInput={(params) => <TextField {...params} />}
//         />
//       </Stack>
//     </LocalizationProvider>
//   );
// }
