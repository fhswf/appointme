import { useState } from "react";
import { useHistory } from "react-router-dom";

import { Grid, TextField } from "@material-ui/core";
import { insertIntoGoogle } from "../helpers/services/google_services";
import { Event } from "@fhswf/bookme-common";
import { useTranslation, Trans } from "react-i18next";

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
  const { t, i18n } = useTranslation();
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
          name="name"
          label={t("Name")}
          required
          fullWidth
          helperText={t("Please provide your name")}
          margin="normal"
          onChange={handleOnChange("name")}
          variant="filled"
          value={formData.name}
        />
      </Grid>
      <Grid item>
        <TextField
          name="email"
          label={t("Email")}
          type="email"
          required
          fullWidth
          helperText={t("You will receive a confirmation email")}
          margin="normal"
          onChange={handleOnChange("email")}
          variant="filled"
          value={formData.email}
        />
      </Grid>
      <Grid item>
        <TextField
          label={t("Information")}
          multiline
          minRows="4"
          helperText={t(
            "Please share anything that will help me to prepare for our meeting"
          )}
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
