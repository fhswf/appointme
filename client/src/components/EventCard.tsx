import React, { ChangeEvent, useState } from "react";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { deleteEvent } from "../helpers/services/event_services";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Link,
  Snackbar,
  Switch,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ShareIcon from "@material-ui/icons/Share";
import { useStyles } from "./EventList";
import { Event } from "@fhswf/bookme-common";
import { EventDocument } from "../helpers/EventDocument";

type EventCardProps = {
  event: EventDocument;
  token: string;
  url: string;
  setActive: (active: boolean) => void;
  onDelete: (event: EventDocument) => void;
};

export const EventCard = (props: EventCardProps) => {
  const [active, setActive] = useState(props.event.isActive);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const token = props.token;
  const classes = useStyles();
  const history = useHistory();

  const toggleActive = (evt: ChangeEvent<HTMLInputElement>) => {
    setActive(evt.target.checked);
    props.setActive(evt.target.checked);
  };

  const handleCopy = () => {
    let loc = window.location;
    let url = history.createHref({
      pathname: `/users/${props.url}/${props.event.url}`,
    });
    url = loc.protocol + "//" + loc.host + url;
    console.log("url: %s", url);

    navigator.clipboard
      .writeText(url)
      .then(() => setSuccess(true))
      .catch((err) => {
        console.log("err: %o", err);
        setFailure(true);
      });
  };

  const handleDelete = () => {
    deleteEvent(token, props.event._id).then((res) => {
      if (res.data.success === false) {
        signout();
        history.push("/landing");
      }
    });
    if (props.onDelete) {
      props.onDelete(props.event);
    }
  };

  return (
    <>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardHeader
            action={
              <IconButton
                aria-label="settings"
                component={RouterLink}
                to={`/editevent/${props.event._id}`}
              >
                <EditIcon />
              </IconButton>
            }
            title={props.event.name}
            subheader={<span>{props.event.duration} min</span>}
          />
          <CardContent>{props.event.description}</CardContent>
          <CardActions disableSpacing>
            <Switch
              checked={active}
              onChange={toggleActive}
              size="small"
              name="active"
              color="primary"
              inputProps={{ "aria-label": "active" }}
            />
            <Button
              aria-label="copy link"
              startIcon={<ShareIcon />}
              onClick={handleCopy}
            >
              Copy link
            </Button>
            <IconButton
              aria-label="delete"
              className={classes.delete}
              onClick={handleDelete}
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => {
          setSuccess(false);
        }}
      >
        <Alert severity="success">Link copied to clipboard!</Alert>
      </Snackbar>
      <Snackbar open={failure}>
        <Alert severity="error">Could not copy link to clipboard!</Alert>
      </Snackbar>
    </>
  );
};
