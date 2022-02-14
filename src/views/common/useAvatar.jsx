import React from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  avatarSize: {},
}));

const UseAvatar = (props) => {
  const { children, ...rest } = props;
  function randomColor() {
    let hex = Math.floor(Math.random() * 0xffffff);
    let color = "#" + hex.toString(16);

    return color;
  }

  const classes = useStyles();
  return (
    <Avatar
      style={{ backgroundColor: randomColor() }}
      className={classes.avatarSize}
    >
      {children}
    </Avatar>
  );
};

export default UseAvatar;
