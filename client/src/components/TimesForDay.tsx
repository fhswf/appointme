import React, { useEffect, useState } from "react";
import { FormGroup, FormLabel, Grid, TextField } from "@material-ui/core";
import { useStyles } from "../pages/AddEvent";

export const TimesForDay = (props) => {
  const classes = useStyles();
  const [start, setStart] = useState(props.start);
  const [end, setEnd] = useState(props.end);
  console.log("TimeForDay: props: %o start=%o, end=%o", props, start, end);

  useEffect(() => {
    if (props.start) setStart(props.start);
    if (props.end) setEnd(props.end);
  });

  const cbStartTime = (event) => {
    setStart(event.target.value);
    props.cbStartTime(event);
  };

  const cbEndTime = (event) => {
    setEnd(event.target.value);
    props.cbEndTime(event);
  };

  // TODO: Add Stepper
  return (
    <>
      <Grid item xs={6}>
        <FormLabel className={classes.label}>{props.day}</FormLabel>
        <FormGroup row className={classes.row}>
          <TextField
            type="time"
            margin="normal"
            placeholder="Starttime"
            onChange={cbStartTime}
            value={start}
          />
          <span className={classes.sep}>&nbsp;–&nbsp;</span>
          <TextField
            type="time"
            margin="normal"
            placeholder="Endtime"
            onChange={cbEndTime}
            value={end}
          />
        </FormGroup>
      </Grid>
    </>
  );
};
