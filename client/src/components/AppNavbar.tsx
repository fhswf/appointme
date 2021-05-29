import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { isAuthenticated, signout } from "../helpers/helpers";

import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "./PrivateRoute";
import { Divider, Snackbar } from "@material-ui/core";

import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import LinkIcon from "@material-ui/icons/Link";
import LoginIcon from "@material-ui/icons/Login";
import LogoutIcon from "@material-ui/icons/Logout";
import PersonIcon from "@material-ui/icons/Person";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const AppNavbar = () => {
  const classes = useStyles();
  const history = useHistory();
  const user = useContext(UserContext).user;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [snack, setSnack] = React.useState<string | null>(null);

  const link = user ? process.env.REACT_APP_URL + "users/" + user.user_url : "";

  console.log("AppNavbar: user=%o", user);

  const handleLogout = () => {
    signout();
    history.push("/landing");
  };

  const handleLogin = () => {
    history.push("/login");
  };

  const copyToClipboard = () => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = link;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    setAnchorEl(null);
    setSnack("Link copied");
  };

  const handleOnClick = (target: string) => () => history.push(target);

  const menuId = "primary-search-account-menu";

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeSnack = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnack(null);
  };

  const loginOut = isAuthenticated() ? (
    <MenuItem onClick={handleLogout}>
      <ListItemIcon>
        <LogoutIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Log out</ListItemText>
    </MenuItem>
  ) : (
    <MenuItem onClick={handleLogin}>
      <ListItemIcon>
        <LoginIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Log in</ListItemText>
    </MenuItem>
  );

  const userMenu = (
    <>
      <MenuItem onClick={handleMenuClose}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Profile</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem component={Link} to="/integration">
        <ListItemIcon>
          <CalendarTodayIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Calendar Integration</ListItemText>
      </MenuItem>
      <MenuItem onClick={copyToClipboard}>
        <ListItemIcon>
          <LinkIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Copy your link</ListItemText>
      </MenuItem>
    </>
  );

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      {userMenu}
      <Divider />
      {loginOut}
    </Menu>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleOnClick("/app")}
          >
            <CalendarTodayIcon />
          </IconButton>

          <Typography variant="h6" className={classes.title}>
            BookMe
          </Typography>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <Avatar src={user ? user.picture_url : ""} />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={6000}
        onClose={closeSnack}
        message="Link Copied"
      />
    </>
  );
};

export default AppNavbar;
