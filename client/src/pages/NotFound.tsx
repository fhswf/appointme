import React from "react";

import { Link as RouterLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <h3 className="text-2xl">page not found</h3>
      <Button asChild>
        <RouterLink to="/app">
          GO HOME
        </RouterLink>
      </Button>
    </div>
  );
};

export default NotFound;
