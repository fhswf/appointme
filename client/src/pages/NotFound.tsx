import React from "react";

import { Link as RouterLink } from "react-router-dom";
import Button from "@material-ui/core/Button";

const NotFound = () => {
  return (
    <div className="notfound">
      <h1>404</h1>
      <h3>page not found</h3>
      <Button variant="contained" component={RouterLink} to="/app">
        GO HOME
      </Button>
    </div>
  );
};

export default NotFound;
