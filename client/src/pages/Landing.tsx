import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../components/AuthProvider";

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-background text-foreground transition-colors duration-200 font-sans min-h-screen flex flex-col">
      <AppNavbar />

      <header className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-foreground"
            dangerouslySetInnerHTML={{ __html: t("landing_hero_title") }}
          />
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("landing_hero_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              {t("landing_cta_start")}
              <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-8 py-3 border border-border text-base font-medium rounded-lg text-foreground bg-card hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              {t("landing_cta_learn_more")}
            </a>
          </div>
        </div>
      </header>

      <section id="how-it-works" className="py-16 bg-card relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              {t("landing_how_it_works_title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("landing_how_it_works_subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-border -z-0 transform translate-y-4"></div>

            <div className="relative bg-background p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300 z-10 flex flex-col h-full">
              <div className="w-14 h-14 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
                <span className="material-symbols-outlined text-primary text-2xl">settings</span>
              </div>
              <h3 className="text-lg font-bold text-foreground text-center mb-3">
                {t("landing_step1_title")}
              </h3>
              <p className="text-muted-foreground text-center text-sm leading-relaxed flex-grow">
                {t("landing_step1_desc")}
              </p>
            </div>

            <div className="relative bg-background p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300 z-10 flex flex-col h-full">
              <div className="w-14 h-14 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm border border-purple-200 dark:border-purple-800/50">
                <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-2xl">event_note</span>
              </div>
              <h3 className="text-lg font-bold text-foreground text-center mb-3">
                {t("landing_step2_title")}
              </h3>
              <p className="text-muted-foreground text-center text-sm leading-relaxed flex-grow">
                {t("landing_step2_desc")}
              </p>
            </div>

            <div className="relative bg-background p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300 z-10 flex flex-col h-full">
              <div className="w-14 h-14 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-200 dark:border-green-800/50">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">share</span>
              </div>
              <h3 className="text-lg font-bold text-foreground text-center mb-3">
                {t("landing_step3_title")}
              </h3>
              <p className="text-muted-foreground text-center text-sm leading-relaxed flex-grow">
                {t("landing_step3_desc")}
              </p>
            </div>

            <div className="relative bg-background p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300 z-10 flex flex-col h-full">
              <div className="w-14 h-14 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-200 dark:border-orange-800/50">
                <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-2xl">check_circle</span>
              </div>
              <h3 className="text-lg font-bold text-foreground text-center mb-3">
                {t("landing_step4_title")}
              </h3>
              <p className="text-muted-foreground text-center text-sm leading-relaxed flex-grow">
                {t("landing_step4_desc")}
              </p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-primary-foreground transition-all duration-200 bg-primary hover:bg-primary/90 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t("landing_cta_start")}
              <span className="material-symbols-outlined ml-2">rocket_launch</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
