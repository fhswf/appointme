import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuthenticated, signout } from "../helpers/helpers";
import { UserContext } from "./PrivateRoute";
import {
  Calendar,
  Link as LinkIcon,
  LogIn,
  LogOut,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";

interface ImportMetaEnv {
  REACT_APP_API_URL: any;
  REACT_APP_URL: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const AppNavbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useContext(UserContext).user;

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
    navigator.clipboard.writeText(link).then(() => toast.success(t("user_menu_link_copied")));
  };

  const handleOnClick = (target: string) => () => navigate(target);

  const loginOut = useAuthenticated() ? (
    <DropdownMenuItem onClick={handleLogout} data-testid="logout-button">
      <LogOut className="mr-2 h-4 w-4" />
      <span>{t("user_menu_log_out")}</span>
    </DropdownMenuItem>
  ) : (
    <DropdownMenuItem onClick={handleLogin} data-testid="login-button">
      <LogIn className="mr-2 h-4 w-4" />
      <span>{t("user_menu_log_in")}</span>
    </DropdownMenuItem>
  );

  return (
    <header className="bg-background border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={handleOnClick("/app")}
          >
            <img src="/logo_no_text.svg" alt="Logo" className="h-8 w-8" />
          </Button>
          <h1 className="text-xl font-bold">{t("application_title")}</h1>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" data-testid="profile-menu">
                <Avatar>
                  <AvatarImage src={user ? user.picture_url : ""} alt={user?.name} />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild disabled={!user}>
                <Link to="/profile" className="flex items-center w-full">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("user_menu_profile")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild disabled={!user}>
                <Link to="/integration" data-testid="calendar-button" className="flex items-center w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{t("user_menu_calendar_integration")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyToClipboard} disabled={!user}>
                <LinkIcon className="mr-2 h-4 w-4" />
                <span>{t("user_menu_copy_link")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {loginOut}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
