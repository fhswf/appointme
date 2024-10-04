import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
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

import Grid from '@mui/material/Grid2';

import { Add, Delete } from "@mui/icons-material";
import { EventFormProps } from "../pages/EditEvent";
import { Day, DayNames, Event, Slot } from "common";
import { t } from "i18next";

/*
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
*/

type EditSlotProps = {
  day: Day;
  slots: Slot[];
  onChange: (slots: Slot[]) => void;
};

const EditSlot = (props: EditSlotProps) => {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    setSlots(
      props.slots.filter(
        (slot) =>
          (slot.start && slot.start.length > 0 && slot.end && slot.end.length > 0)
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

  console.log("EditSlot: %o", slots);
  return (
    <>
      <Grid container xs={12}>
        <Grid xs={2}>
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox checked={slots.length > 0} onChange={handleCheck} />
              }
              label={DayNames[props.day]}
            />
          </FormControl>
        </Grid>
        <Grid xs={9}>
          <Grid container>
            {slots.map((slot, index) => (

              <FormGroup row key={slot.start} style={{ "alignItems": "baseline" }}>
                <Grid xs={4} textAlign="end">
                  <Input
                    type="time"
                    placeholder="Starttime"
                    onChange={changeTime("start", index)}
                    value={slot.start}
                  />
                </Grid>
                <Grid xs={2} textAlign="center">
                  –
                </Grid>
                <Grid xs={4} textAlign="start">
                  <Input
                    type="time"
                    placeholder="Endtime"
                    onChange={changeTime("end", index)}
                    value={slot.end}
                  />
                </Grid>
                <Grid xs={2}>
                  <Button onClick={deleteSlot(index)}>
                    <Delete />
                  </Button>
                </Grid>
              </FormGroup >

            ))}
          </Grid>
        </Grid>
        <Grid xs={1}>
          {slots.length > 0 ?
            <Button onClick={addSlot} hidden={slots.length <= 0}>
              <Add />
            </Button> : null}
        </Grid>
      </Grid >
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
        console.log("onChange: %o %s", evt, key);
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
    let event: Event = { ...formData };
    event.available[day] = slots;
    setFormData(event);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <Box>
        <Typography component="h2" variant="h5">
          {t("these_zesty_duck_nudge")}
        </Typography>
        <div>
          <TextField
            id="event-title"
            type="text"
            label={t("lazy_just_duck_spin")}
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
            label={t("these_moving_fox_create")}
            helperText={t("north_least_gopher_burn")}
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
            label={t("honest_weak_iguana_rest")}
            placeholder={t("tired_whole_bumblebee_type")}
            helperText={t("tiny_factual_platypus_pave")}
            defaultValue="Online via Zoom"
            margin="normal"
            variant="filled"
            onChange={handleOnChange("location")}
            value={formData.location}
          />
        </div>

        <div>
          <TextField
            label={t("quiet_male_yak_slurp")}
            margin="normal"
            variant="filled"
            placeholder={t("dizzy_quiet_walrus_hush")}
            helperText={t("less_equal_octopus_dine")}
            onChange={handleOnChange("url")}
            value={formData.url}
          />
        </div>
      </Box>

      <Box pt="1em">
        <Typography component="h2" variant="h5">
          {t("jumpy_tasty_rook_trust")}
        </Typography>

        <Grid container spacing={3}>
          <Grid xs={12} sm={4}>
            <FormControl margin="normal" variant="filled">
              <InputLabel id="duration-label">{t("ideal_this_coyote_inspire")}</InputLabel>
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
              <FormHelperText>{t("elegant_early_boar_accept")}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid xs={12} sm={4}>
            <FormControl component="span" margin="normal" variant="filled">
              <InputLabel id="buffer-before-label">{t("mealy_happy_ray_flop")}</InputLabel>
              <Select
                labelId="buffer-before-label"
                id={t("left_aloof_stork_leap")}
                value={formData.bufferbefore}
                onChange={handleSelect("bufferbefore")}
              >
                <MenuItem value={0}>none</MenuItem>
                <MenuItem value={5}>5 min</MenuItem>
                <MenuItem value={15}>15 min</MenuItem>
                <MenuItem value={30}>30 min</MenuItem>
                <MenuItem value={60}>60 min</MenuItem>
              </Select>
              <FormHelperText>{t("real_big_crow_push")}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid xs={12} sm={4}>
            <FormControl component="span" margin="normal" variant="filled">
              <InputLabel id="buffer-after-label">{t("close_actual_deer_boil")}</InputLabel>
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
              <FormHelperText>{t("keen_zippy_bulldog_gaze")}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box pt="1em">
        <Typography component="h2" variant="h5" gutterBottom>
          {t("seemly_fine_octopus_slurp")}
        </Typography>

        <Grid container spacing={3}>
          <Grid xs={12} sm={4}>
            <TextField
              id="maxFuture"
              label={t("Maximum days in advance")}
              value={formData.maxFuture / 86400}
              type="number"
              variant="filled"
              onChange={handleOnChange("maxFuture", 86400)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">Days</InputAdornment>
                ),
              }}
              helperText={t("How many days in advance is this event available?")}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="rangedays"
              label={t("quaint_known_wasp_view")}
              value={formData.minFuture / 86400}
              type="number"
              variant="filled"
              onChange={handleOnChange("minFuture", 86400)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">Days</InputAdornment>
                ),
              }}
              helperText={t("pretty_grand_cuckoo_arrive")}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="maxPerDay"
              label={t("grand_wacky_ox_flow")}
              value={formData.maxPerDay}
              type="number"
              variant="filled"
              onChange={handleOnChange("maxPerDay")}
              helperText={t("slow_maroon_spider_praise")}
            />
          </Grid>
        </Grid>
      </Box>

      <Box pt="1em">
        <Typography component="h2" variant="h5">
          {t("Daily availability")}
        </Typography>

        <Stack
          width="fit-content"
          margin="auto"
          spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <EditSlot
              key={day}
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
