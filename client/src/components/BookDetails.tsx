import { useState } from "react";

import { Grid, TextField } from "@mui/material";
import { Event } from "@fhswf/bookme-common";
import { useTranslation } from "react-i18next";
import React from "react";

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
  errors: any;
  onChange: (form: BookingFormData) => void;
};

const BookDetails = (props: BookDetailsProps) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    description: "",
  });

  const nameRef = React.createRef();
  const emailRef = React.createRef();
  const descriptionRef = React.createRef();
  const inputs = {
    name: nameRef,
    email: emailRef,
    description: descriptionRef,
  };

  const handleOnChange = (text) => (event) => {
    const newData = { ...formData, [text]: event.target.value };
    setFormData(newData);
    console.log(
      "BookDetails: formData=%o %o",
      formData,
      inputs[event.target.id].current.value
    );
    props.onChange(newData);
  };

  return (
    <Grid container alignItems="stretch" direction="column">
      <Grid item>
        <TextField
          id="name"
          name="name"
          label={t("Name")}
          error={"name" in props.errors}
          inputRef={nameRef}
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
          id="email"
          name="email"
          label={t("Email")}
          type="email"
          error={"email" in props.errors}
          inputRef={emailRef}
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
          id="description"
          name="description"
          label={t("Information")}
          inputRef={descriptionRef}
          multiline
          error={"info" in props.errors}
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
