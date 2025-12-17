import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuthenticated, signout } from "../helpers/helpers";
import { useAuth } from "./AuthProvider";
import {
  Calendar,
  Link as LinkIcon,
  LogIn,
  LogOut,
  User,
  Scale,
  HelpCircle
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
import { ProfileDialog } from "./ProfileDialog";

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
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = React.useState(false);

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
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-md px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 md:hidden pb-1"
            onClick={handleOnClick("/")}
          >
            <img src="/logo_no_text.svg" alt="Logo" className="h-full w-full" />
          </Button>

          {/* Desktop Logo / Title Area matching template */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/logo_no_text.svg" alt="Appoint Me" className="h-8 w-8" />
            </div>
            <span className="font-bold text-lg tracking-tight">{t("application_title")}</span>
          </div>
          {/* Fallback for mobile title if needed, or just keep the simplified one */}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 border border-border p-0 overflow-hidden" data-testid="profile-menu">
                <Avatar className="h-full w-full">
                  <AvatarImage src={user ? user.picture_url : ""} alt={user?.name} className="object-cover" />
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setProfileOpen(true)} disabled={!user}>
                <User className="mr-2 h-4 w-4" />
                <span>{t("user_menu_profile")}</span>
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
              <DropdownMenuItem asChild>
                <Link to="/legal" className="flex items-center w-full">
                  <Scale className="mr-2 h-4 w-4" />
                  <span>{t("legal")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/about" className="flex items-center w-full">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>{t("about")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {loginOut}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </header>
  );
};

export default AppNavbar;
