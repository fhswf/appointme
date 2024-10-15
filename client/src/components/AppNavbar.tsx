import React, { useState, useContext } from "react";


import { Link, useNavigate } from "react-router-dom";
import { useAuthenticated, signout } from "../helpers/helpers";

import {
  AppBar,
  Avatar,
  Divider,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar
} from "@mui/material";

import { UserContext } from "./PrivateRoute";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LinkIcon from "@mui/icons-material/Link";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

interface ImportMetaEnv {
  REACT_APP_URL: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const AppNavbar = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext).user;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [snack, setSnack] = React.useState<string | null>(null);

  const link = user ? import.meta.env.REACT_APP_URL + "/users/" + user.user_url : "";

  console.log("AppNavbar: user=%o", user);

  const handleLogout = () => {
    signout();
    navigate("/landing");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link).then(() => setSnack("Link copied"));
  };

  const handleOnClick = (target: string) => () => navigate(target);

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

  const loginOut = useAuthenticated() ? (
    <MenuItem onClick={handleLogout} data-testid="logout-button">
      <ListItemIcon>
        <LogoutIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Log out</ListItemText>
    </MenuItem>
  ) : (
    <MenuItem onClick={handleLogin} data-testid="login-button">
      <ListItemIcon>
        <LoginIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Log in</ListItemText>
    </MenuItem>
  );

  const userMenu = [
    <MenuItem key="profile" onClick={handleMenuClose} disabled={!user}>
      <ListItemIcon>
        <PersonIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Profile</ListItemText>
    </MenuItem>,
    <MenuItem key="account" onClick={handleMenuClose} disabled={!user}>My account</MenuItem>,
    <MenuItem key="calendar" component={Link} to="/integration" disabled={!user} data-testid="calendar-button">
      <ListItemIcon>
        <CalendarTodayIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Calendar Integration</ListItemText>
    </MenuItem>,
    <MenuItem key="link" onClick={copyToClipboard} disabled={!user}>
      <ListItemIcon>
        <LinkIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Copy your link</ListItemText>
    </MenuItem>
  ];

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

  console.log("AppNavbar: user=%o", user);
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleOnClick("/app")}
          >
            <CalendarTodayIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            BookMe
          </Typography>
          <div>
            <IconButton
              data-testid="profile-menu"
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
