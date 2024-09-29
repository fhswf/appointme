import { ChangeEvent, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { deleteEvent } from "../helpers/services/event_services";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Snackbar,
  Switch,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import { EventDocument } from "../helpers/EventDocument";

/*
const useStyles = makeStyles({
  delete: {
    marginLeft: "auto",
  },
});
*/

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
  const navigate = useNavigate();

  const toggleActive = (evt: ChangeEvent<HTMLInputElement>) => {
    setActive(evt.target.checked);
    props.setActive(evt.target.checked);
  };

  const handleCopy = () => {
    let loc = window.location;
    let url = `/users/${props.url}/${props.event.url}`;
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
        navigate("/landing");
      }
    });
    if (props.onDelete) {
      props.onDelete(props.event);
    }
  };

  return (
    <>
      <Grid size={4}>

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
