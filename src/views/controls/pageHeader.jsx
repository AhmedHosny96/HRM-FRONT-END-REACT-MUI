import React from "react";
import { Paper, Card } from "@material-ui/core";

export default function pageHeader(props) {
  const { title, subTitle, icon } = props;
  return (
    <Paper elevation={0} square>
      <Card></Card>
    </Paper>
  );
}
