import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { AdminEventDay } from "./admin.eventday";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
  },
}));

export function AdminEvent() {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h5" gutterBottom={true} color="textPrimary">
        Eventi degli ultimi 30 giorni:
      </Typography>
      <Box className={classes.root}>
        <AdminEventDay />
      </Box>
    </div>
  );
}
