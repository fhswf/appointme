import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Typography,
  Stack,
  Input,
  SelectChangeEvent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Add, Delete } from "@mui/icons-material";
import { EventFormProps } from "../pages/EditEvent";
import { Day, DayNames, Event, Slot } from "common";

export const useStyles = makeStyles((theme) => ({
  row: {
    alignItems: "center",
    width: "100%",
  },
  label: {
    fontSize: "0.7rem",
    display: "block",
    //marginBottom: "-1ex",
  },
  sep: {
    padding: "0.8ex",
  },
}));

type EditSlotProps = {
  day: Day;
  slots: Slot[];
  onChange: (slots: Slot[]) => void;
};

const EditSlot = (props: EditSlotProps) => {
  const classes = useStyles();
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    setSlots(
      props.slots.filter(
        (slot) =>
          slot.start && slot.start.length > 0 && slot.end && slot.end.length > 0
      )
    );
  }, [props.slots]);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // ensure at least one entry
      if (slots.length === 0) {
        const _slots = [{ start: "09:00", end: "17:00" }];
        setSlots(_slots);
        props.onChange(_slots);
      }
    } else {
      // ensure no entry
      if (slots.length > 0) {
        setSlots([]);
        props.onChange([]);
      }
    }
  };

  const addSlot = () => {
    console.log("add slot");
    let _slots = slots.slice();
    _slots.push({ start: "", end: "" });
    setSlots(_slots);
    props.onChange(_slots);
  };

  const deleteSlot = (index: number) => () => {
    console.log("delete slot %d", index);
    const _slots = slots.filter((slot, idx) => index !== idx);
    setSlots(_slots);
    props.onChange(_slots);
  };

  const changeTime =
    (key: keyof Slot, index: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("ChangeTime: %s %d %o", key, index, event.target.value);
      let _slots = slots.slice();
      _slots[index][key] = event.target.value;
      setSlots(_slots);
      props.onChange(_slots);
    };

  return (
    <>
      <Grid item container xs={12}>
        <Grid item xs={2}>
          <FormControl>
            <FormControlLabel
              className={classes.label}
              control={
                <Checkbox checked={slots.length > 0} onChange={handleCheck} />
              }
              label={DayNames[props.day]}
            />
          </FormControl>
        </Grid>
        <Grid item xs={9}>
          <Grid container>
            {slots.map((slot, index) => (
              <>
                <FormGroup row className={classes.row}>
                  <Grid item xs={4} textAlign="end">
                    <Input
                      type="time"
                      placeholder="Starttime"
                      onChange={changeTime("start", index)}
                      value={slot.start}
                    />
                  </Grid>
                  <Grid item xs={2} textAlign="center">
                    –
                  </Grid>
                  <Grid item xs={4} textAlign="start">
                    <Input
                      type="time"
                      placeholder="Endtime"
                      onChange={changeTime("end", index)}
                      value={slot.end}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button onClick={deleteSlot(index)}>
                      <Delete />
                    </Button>
                  </Grid>
                </FormGroup>
              </>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={1}>
          <Button onClick={addSlot}>
            <Add />
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export const EventForm = (props: EventFormProps): JSX.Element => {
  const [formData, setFormData] = useState<Event>(props.event);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setFormData(props.event);
  }, [props.event]);

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    props.handleOnSubmit(formData);
  };

  const generateSlug = (str: string) => {
    if (!str) return "";
    let slug = str.replace(" ", "_").toLocaleLowerCase();
    console.log("generateSlug: %s %s", str, slug);
    return slug;
  };

  const handleOnChange =
    (key: keyof Event, mult?: number) =>
    (evt: ChangeEvent<HTMLInputElement>) => {
      setChanged(true);
      console.log("onChange: %o", evt);
      if (key === "name" && formData.url === generateSlug(formData.name)) {
        setFormData({
          ...formData,
          [key]: mult
            ? mult * Number.parseInt(evt.target.value)
            : evt.target.value,
          url: generateSlug(evt.target.value),
        } as Event);
      } else {
        setFormData({ ...formData, [key]: evt.target.value } as Event);
      }
    };

  interface EvtType {
    value: number;
  }

  const handleSelect =
    (key: keyof Event) =>
    (evt: SelectChangeEvent<number>, child: React.ReactNode) => {
      setChanged(true);
      console.log("onChange: %o", evt);
      setFormData({ ...formData, [key]: evt.target.value } as Event);
    };

  const onChangeSlot = (day: Day) => (slots: Slot[]) => {
    setChanged(true);
    console.log("onChangeSlot: %d %o", day, slots);
    formData.available[day] = slots;
    setFormData(formData);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <Box>
        <Typography component="h2" variant="h5">
          Basic Information
        </Typography>
        <div>
          <TextField
            id="event-title"
            type="text"
            label="Event title"
            required
            fullWidth
            margin="normal"
            variant="filled"
            onChange={handleOnChange("name")}
            value={formData.name}
          />
        </div>

        <div>
          <TextField
            label="Description"
            helperText="What is the purpose of this appointment type?"
            multiline
            fullWidth
            margin="normal"
            variant="filled"
            onChange={handleOnChange("description")}
            value={formData.description}
          />
        </div>

        <div>
          <TextField
            label="Location"
            placeholder="Zoom Meeting"
            helperText="Where does the meeting take place?"
            defaultValue="Online via Zoom"
            margin="normal"
            variant="filled"
            onChange={handleOnChange("location")}
            value={formData.location}
          />
        </div>

        <div>
          <TextField
            label="Event Slug"
            margin="normal"
            variant="filled"
            placeholder="awesome-meeting"
            helperText="Customizable part of the URL"
            onChange={handleOnChange("url")}
            value={formData.url}
          />
        </div>
      </Box>

      <Box pt="1em">
        <Typography component="h2" variant="h5">
          Duration
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormControl margin="normal" variant="filled">
              <InputLabel id="duration-label">Duration</InputLabel>
              <Select
                labelId="duration-label"
                id="duration"
                value={formData.duration}
                onChange={handleSelect("duration")}
              >
                <MenuItem value={15}>15 min</MenuItem>
                <MenuItem value={30}>30 min</MenuItem>
                <MenuItem value={45}>45 min</MenuItem>
                <MenuItem value={60}>60 min</MenuItem>
              </Select>
              <FormHelperText>How long is this event?</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl component="span" margin="normal" variant="filled">
              <InputLabel id="buffer-before-label">Buffer before</InputLabel>
              <Select
                labelId="buffer-before-label"
                id="buffer-before"
                value={formData.bufferbefore}
                onChange={handleSelect("bufferbefore")}
              >
                <MenuItem value={0}>none</MenuItem>
                <MenuItem value={5}>5 min</MenuItem>
                <MenuItem value={15}>15 min</MenuItem>
                <MenuItem value={30}>30 min</MenuItem>
                <MenuItem value={60}>60 min</MenuItem>
              </Select>
              <FormHelperText>Buffer berfore this event</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl component="span" margin="normal" variant="filled">
              <InputLabel id="buffer-after-label">Buffer after</InputLabel>
              <Select
                labelId="buffer-after-label"
                id="buffer-after"
                value={formData.bufferafter}
                onChange={handleSelect("bufferafter")}
              >
                <MenuItem value={0}>none</MenuItem>
                <MenuItem value={5}>5 min</MenuItem>
                <MenuItem value={15}>15 min</MenuItem>
                <MenuItem value={30}>30 min</MenuItem>
                <MenuItem value={60}>60 min</MenuItem>
              </Select>
              <FormHelperText>Buffer after this event</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box pt="1em">
        <Typography component="h2" variant="h5" gutterBottom>
          Availability
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              id="maxFuture"
              label="Maximum days in advance"
              value={formData.maxFuture / 86400}
              type="number"
              variant="filled"
              onChange={handleOnChange("maxFuture", 86400)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">Days</InputAdornment>
                ),
              }}
              helperText="How many days in advance is this event available?"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="rangedays"
              label="Minimum days in advance"
              value={formData.minFuture / 86400}
              type="number"
              variant="filled"
              onChange={handleOnChange("minFuture", 86400)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">Days</InputAdornment>
                ),
              }}
              helperText="Events cannot be scheduled less than this time in advance"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="maxPerDay"
              label="Maximum per day"
              value={formData.maxPerDay}
              type="number"
              variant="filled"
              onChange={handleOnChange("maxPerDay")}
              helperText="Maximum number of events of this type per day"
            />
          </Grid>
        </Grid>
      </Box>

      <Box pt="1em">
        <Typography component="h2" variant="h5">
          Daily availability
        </Typography>

        <Stack
          width="fit-content"
          margin="auto"
          spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <EditSlot
              day={day}
              slots={formData.available[day as Day]}
              onChange={onChangeSlot(day)}
            />
          ))}
        </Stack>
      </Box>

      <Button
        variant="contained"
        type="submit"
        className="save"
        disabled={!changed}
      >
        Save
      </Button>
    </form>
  );
};
