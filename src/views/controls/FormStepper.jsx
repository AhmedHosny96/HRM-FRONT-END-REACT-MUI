import React from "react";
import { Stepper, Step, StepLabel } from "@material-ui/core";
const steps = ["Personal Info", "Job Details", "Documents & others"];

export default function FormStepper() {
  return (
    <Stepper>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
