import React, { useEffect, useState } from "react";
import { FormGroup, FormLabel, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";

export const TimesForDay = (props) => {
  const [start, setStart] = useState(props.start);
  const [end, setEnd] = useState(props.end);
  console.log("TimeForDay: props: %o start=%o, end=%o", props, start, end);

  useEffect(() => {
    if (props.start) setStart(props.start);
    if (props.end) setEnd(props.end);
  }, [props.start, props.end]);

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
    <Grid xs={6}>
      <FormLabel>{props.day}</FormLabel>
      <FormGroup row>
        <TextField
          type="time"
          margin="normal"
          placeholder="Starttime"
          onChange={cbStartTime}
          value={start}
        />
        <span>&nbsp;–&nbsp;</span>
        <TextField
          type="time"
          margin="normal"
          placeholder="Endtime"
          onChange={cbEndTime}
          value={end}
        />
      </FormGroup>
    </Grid>

  );
};
