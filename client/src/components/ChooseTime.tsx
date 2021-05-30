import React, { useState } from "react";

import { Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { IntervalSet, TimeRange } from "@fhswf/bookme-common";
import { addMinutes } from "date-fns";

export const useStyles = makeStyles((theme) => ({
  delete: {
    marginLeft: "auto",
  },
}));

type ChooseTimeProps = {
  slots: IntervalSet;
  duration: number;
  step?: number;
  language: string;
  onSelect?: (time: TimeRange) => void;
};

const ChooseTime = (props: ChooseTimeProps) => {
  const [selected, setSelected] = useState<TimeRange | null>(null);

  if (!props.step) props.step = 30;

  console.log("ChooseTime: %o", props.slots);

  const handleClick = (time: Date) => () => {
    setSelected({ start: time, end: addMinutes(time, props.duration) });
    props.onSelect({ start: time, end: addMinutes(time, props.duration) });
  };

  const getTimes = (slot: TimeRange) => {
    let times = [];
    for (
      let time = slot.start;
      addMinutes(time, props.duration) <= slot.end;
      time = addMinutes(time, props.step)
    ) {
      times.push(time);
    }
    return times.map((time) => (
      <Chip
        label={time.toLocaleTimeString(props.language, {
          hour: "2-digit",
          minute: "2-digit",
        })}
        onClick={handleClick(time)}
        color={
          selected && time.getTime() === selected.start.getTime()
            ? "primary"
            : "default"
        }
      />
    ));
  };

  return <>{props.slots.map((slot) => getTimes(slot))}</>;
};

export default ChooseTime;
