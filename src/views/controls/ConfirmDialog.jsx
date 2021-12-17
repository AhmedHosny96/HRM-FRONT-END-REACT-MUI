import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import Controls from "../../views/controls/controls";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  confirmDialog: {
    position: "absolute",
    top: theme.spacing(10),
  },
  dialogContent: {
    textAlign: "center",
  },
  dialogAction: {
    justifyContent: "center",
  },
}));

export default function ConfirmDialog(props) {
  const classes = useStyles();
  const { confirmDialog, setConfirmDialog } = props;

  return (
    <Dialog
      open={confirmDialog.isOpen}
      classes={{ paper: classes.confirmDialog }}
    >
      <DialogTitle></DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="h8">{confirmDialog.title}</Typography>
        <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
      </DialogContent>
      <DialogActions className={classes.dialogAction}>
        <Controls.Button
          text="No"
          color="default"
          size="small"
          onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        />
        <Controls.Button
          text="Yes"
          size="small"
          color="primary"
          onClick={() => confirmDialog.onConfirm()}
        />
      </DialogActions>
    </Dialog>
  );
}
