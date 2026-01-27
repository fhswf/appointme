import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from "sonner";
import { postGoogleLogin, getAuthConfig, getOidcAuthUrl } from "../helpers/services/auth_services";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../components/AuthProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FabSpeedDial } from "@/components/FabSpeedDial";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { refreshAuth } = useAuth();
  const [config, setConfig] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const stateRef = useRef<string | null>(null);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setIsLoading(false);
      if (codeResponse.state !== stateRef.current) {
        console.error("State mismatch: expected %s, got %s", stateRef.current, codeResponse.state);
        toast.error(t("login_failed"));
        return;
      }
      sendGoogleToken(codeResponse.code)
    },
    onError: (error) => {
      setIsLoading(false);
      console.log('Login Failed:', error)
    },
    flow: 'auth-code',
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res: any = await getAuthConfig();
        setConfig(res);
      } catch (e) {
        console.error(e);
      }
    };
    fetchConfig();
  }, []);

  const sendGoogleToken = async (code) => {
    console.log("postGoogleLogin: code=%s", code)
    try {
      const res = await postGoogleLogin(code);
      console.log("postGoogleLogin: %o", res);
      // Refresh auth state before navigating to ensure PrivateRoute sees authenticated user
      await refreshAuth();
      navigate("/");
    } catch (error: any) {
      console.log("GOOGLE SIGNIN ERROR", error.response);
      toast.error(t("google_login_failed") + ": " + (error.response?.data?.message || error.message));
    }
  };

  const handleGoogleLogin = () => {
    if (isLoading) return;
    setIsLoading(true);
    const state = crypto.randomUUID();
    stateRef.current = state;
    loginWithGoogle({ state });
  };

  const handleOidcLogin = () => {
    getOidcAuthUrl()
      .then((res: any) => {
        if (res.url) globalThis.location.href = res.url;
      })
      .catch((err) => {
        console.error(err);
        toast.error(t("login_failed"));
      });
  }

  return (
    <div className="font-sans bg-background min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden">


      <main className="w-full max-w-md bg-card dark:bg-card rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden relative z-10">
        <div className="h-2 w-full bg-gradient-to-r from-campus to-purple-500"></div>
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-campus/10 dark:bg-campus/20 text-campus mb-4">
              <span className="material-symbols-outlined text-3xl">school</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("welcome_back", "Willkommen zurück")}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t("login_subtitle", "Bitte melden Sie sich an, um fortzufahren.")}</p>
          </div>

          <div className="space-y-4">
            {config.oidcEnabled && (
              <button onClick={handleOidcLogin} data-testid="login-sso" className="group w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-campus dark:hover:border-campus hover:border dark:hover:border transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-campus focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer">
                <div className="w-6 h-6 flex items-center justify-center relative">
                  {config.oidcIcon ? (
                    <img src={config.oidcIcon} alt={t("sso_icon_alt", "SSO Icon")} className="w-5 h-5" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path className="text-gray-900 dark:text-white group-hover:text-campus transition-colors" d="M12 3V15" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                      <circle className="text-campus" cx="12" cy="19.5" fill="currentColor" r="1.5"></circle>
                    </svg>
                  )}
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {t("login_with")} {t(config.oidcName || "SSO")}
                </span>
                <span className="material-symbols-outlined ml-auto text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform text-sm opacity-0 group-hover:opacity-100">arrow_forward</span>
              </button>
            )}

            {config.oidcEnabled && config.googleEnabled && (
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider">{t("or", "oder")}</span>
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              </div>
            )}

            {config.googleEnabled && (
              <button disabled={isLoading} onClick={() => handleGoogleLogin()} data-testid="login-google" className="group w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-campus dark:hover:border-campus hover:border dark:hover:border transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-campus focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {t("login_with")} {t("google", "Google")}
                </span>
                <span className="material-symbols-outlined ml-auto text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform text-sm opacity-0 group-hover:opacity-100">arrow_forward</span>
              </button>
            )}
          </div>

          <div className="mt-8 text-center space-y-2">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t("login_tos_prefix", "Durch die Anmeldung akzeptieren Sie unsere")} <a href="/legal" className="text-campus hover:text-blue-600 dark:hover:text-blue-400 underline decoration-dotted underline-offset-2">{t("terms_of_service", "Nutzungsbedingungen")}</a>.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] pointer-events-none -z-10 opacity-20"></div>
      </main>

      <FabSpeedDial
        className="bg-white dark:bg-card border border-gray-200 dark:border-gray-700 hover:scale-110 hover:bg-gray-50 dark:hover:bg-gray-800 text-foreground"
      />
    </div>
  );
};

export default Login;
