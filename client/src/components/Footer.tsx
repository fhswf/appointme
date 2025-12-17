
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className="w-full py-6 bg-background border-t mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-muted-foreground">
                <Link to="/legal" className="hover:underline">
                    {t("Legal")}
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
