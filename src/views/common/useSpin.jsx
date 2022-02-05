import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Spin } from "antd";
const useStyles = makeStyles((theme) => ({
  spin: {
    margin: "20px 0",
    marginBottom: "20px",
    padding: "30px 50px",
    textAlign: "center",
    borderRadius: "4px",
  },
}));
const UseSpin = () => {
  const classes = useStyles();
  return (
    <div className={classes.spin}>
      <Spin size="large" />
    </div>
  );
};

export default UseSpin;
