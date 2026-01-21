
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();

    return (
        <footer className="w-full py-6 bg-background border-t mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-muted-foreground">
                <Link to="/legal" state={{ from: location.pathname }} className="hover:underline" data-testid="footer-legal-link">
                    {t("Legal")}
                </Link>
                <span>{t("footer_credits")}</span>
            </div>
        </footer>
    );
};

export default Footer;
