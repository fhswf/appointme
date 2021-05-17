import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Menu, MenuItem } from '@material-ui/core';
import { signout } from "../helpers/helpers";
import { deleteEvent } from "../helpers/services/event_services";


const EventDropdownMenu = ({ options }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const token = JSON.parse(localStorage.getItem("access_token"));
  const eventid = options;
  const history = useHistory();

  const handleOnDelete = (event) => {
    event.preventDefault();
    deleteEvent(token, eventid).then((res) => {
      if (res.data.success === false) {
        signout();
        history.push("/landing");
      }
    });
    closeMenu();
    window.location.reload(false);
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button onClick={openMenu}>
        {iconConfig}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
      >
        <MenuItem component={Link} to={`/editevent/${eventid}`}>
          Edit
        </MenuItem>

        <MenuItem onClick={handleOnDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default EventDropdownMenu;
