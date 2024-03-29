import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import Controls from "../../views/controls/controls";

// import { PropTypes } from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    marginLeft: theme.spacing(7),

    "& .MuiDialog-paper": {
      padding: theme.spacing(2),
      position: "absolute",
      top: theme.spacing(0),
    },
  },
}));

export default function Popup(props) {
  const { title, children, openPopup, setOpenPopup, popUpClose } = props;
  const classes = useStyles();
  return (
    <Dialog open={openPopup} className={classes.dialogWrapper}>
      <DialogTitle>
        <div style={{ display: "flex" }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Controls.ActionButton
            disabled={popUpClose}
            color="primary"
            onClick={() => setOpenPopup(false)}
            title="Close"
          >
            <Close />
          </Controls.ActionButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
