import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useContext,
  MouseEventHandler,
} from "react";
import { Link, useHistory } from "react-router-dom";
import { isAuthenticated, signout } from "../helpers/helpers";
import { toast, ToastContainer } from "react-toastify";

import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import SettingsIcon from "@material-ui/icons/Settings";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../helpers/PrivateRoute";

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
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
  const open = Boolean(anchorEl);

  const token = JSON.parse(localStorage.getItem("access_token") as string);
  const link = user ? process.env.REACT_APP_URL + "users/" + user.user_url : "";

  const menu = useRef(null);

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
    toast.success("Copied Link to Clipboard");
  };

  const items = [
    {
      label: "Profile",
      items: [
        {
          label: "Logout",
          icon: "pi pi-logout",
          command: handleLogout,
        },
        {
          label: "Share your link",
          icon: "pi pi-copy",
          command: copyToClipboard,
        },
        {
          label: "Calendar configuration",
          icon: "pi pi-config",
          command: () => history.push("/integration"),
        },
      ],
    },
  ];

  const handleOnClick = (target: string) => () => history.push(target);

  const menuId = "primary-search-account-menu";

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen: MouseEventHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const loginout = isAuthenticated() ? (
    <MenuItem onClick={handleLogout}>Log Out</MenuItem>
  ) : (
    <MenuItem onClick={handleLogin}>Log In</MenuItem>
  );

  const userMenu = (
    <>
      <MenuItem onClick={handleMenuClose}>
        <ListItemIcon>
          <CalendarTodayIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Profile</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </>
  );

  const renderMenu = (
    <Menu
      anchorEl={anchorEl as Element}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {userMenu}
      {loginout}
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
              aria-label="Calendar Settings"
              color="inherit"
              onClick={handleOnClick("/integration")}
            >
              <SettingsIcon />
            </IconButton>
            <Menu open={open} id="popup_menu">
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            </Menu>
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
    </>
  );
};

export default AppNavbar;
