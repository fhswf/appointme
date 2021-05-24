import { useState } from "react";
import { useHistory } from "react-router-dom";

import { Grid, TextField } from "@material-ui/core";
import { insertIntoGoogle } from "../helpers/services/google_services";
import { Event } from "@fhswf/bookme-common";

export type BookingFormData = {
  name: string;
  email: string;
  description: string;
};

export type BookDetailsProps = {
  start: Date;
  end: Date;
  userid: string;
  username: string;
  event: Event;
  onChange: (form: BookingFormData) => void;
};

const BookDetails = (props: BookDetailsProps) => {
  const history = useHistory();
  const start = props.start;
  const userid = props.userid;
  const username = props.username;
  const event = props.event;

  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    description: "",
  });

  const { name, email, description } = formData;
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      insertIntoGoogle(username, event, start, name, email, description).then(
        () => {
          //toast.success("Event successfully booked!");
          history.push({
            pathname: `/booked`,
            state: { userid: userid, event, time: start },
          });
        }
      );
    } else {
      //toast.error("Please fill in your name and email!");
    }
  };

  const handleOnChange = (text) => (event) => {
    setFormData({ ...formData, [text]: event.target.value });
    props.onChange(formData);
  };
  const handleBackClick = (event) => {
    event.preventDefault();
    history.goBack();
  };
  return (
    <Grid container alignItems="stretch" direction="column">
      <Grid item>
        <TextField
          label="Name"
          required
          fullWidth
          helperText="Please provide your name"
          margin="normal"
          onChange={handleOnChange("name")}
          variant="filled"
          value={formData.name}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          helperText="You will receive a confirmation email"
          margin="normal"
          onChange={handleOnChange("email")}
          variant="filled"
          value={formData.email}
        />
      </Grid>
      <Grid item>
        <TextField
          label="information"
          multiline
          minRows="4"
          helperText="Please share anything that will help me to prepare for our meeting"
          margin="normal"
          onChange={handleOnChange("description")}
          variant="filled"
          value={formData.description}
        />
      </Grid>
    </Grid>
  );
};

export default BookDetails;
