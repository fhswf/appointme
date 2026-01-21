import React, { useState, useEffect, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { markdownComponents } from '../components/MarkdownComponents';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../components/PrivateRoute';
import ContactInfo from '../components/ContactInfo';
import { Button } from '@/components/ui/button';

const Legal: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const { user } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState<'terms' | 'impressum' | 'privacy'>('terms');

    const showExtended = user || location.state?.from === '/' || location.state?.from === '/landing';

    useEffect(() => {
        if (location.hash === '#privacy') {
            setActiveTab('privacy');
        } else if (location.hash === '#impressum') {
            setActiveTab('impressum');
        } else if (location.hash === '#terms') {
            setActiveTab('terms');
        }
    }, [location.hash]);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppNavbar />
            <main className="container mx-auto p-8 flex-grow">
                <div className="max-w-3xl mx-auto">
                    <div className="flex space-x-4 border-b border-border mb-8">
                        <Button
                            variant="ghost"
                            className={`pb-2 rounded-none px-4 ${activeTab === 'terms' ? 'border-b-2 border-primary font-bold text-foreground' : 'text-muted-foreground'}`}
                            onClick={() => setActiveTab('terms')}
                        >
                            {t("terms_of_use_title")}
                        </Button>
                        <Button
                            variant="ghost"
                            className={`pb-2 rounded-none px-4 ${activeTab === 'impressum' ? 'border-b-2 border-primary font-bold text-foreground' : 'text-muted-foreground'}`}
                            onClick={() => setActiveTab('impressum')}
                        >
                            {t("Impressum")}
                        </Button>
                        <Button
                            variant="ghost"
                            className={`pb-2 rounded-none px-4 ${activeTab === 'privacy' ? 'border-b-2 border-primary font-bold text-foreground' : 'text-muted-foreground'}`}
                            onClick={() => setActiveTab('privacy')}
                        >
                            {t("Datenschutzhinweise")}
                        </Button>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {activeTab === 'terms' && (
                            <div>
                                <ReactMarkdown components={markdownComponents}>{t("terms_of_use_content")}</ReactMarkdown>
                                <ContactInfo />
                            </div>
                        )}
                        {activeTab === 'impressum' && (
                            <div>
                                <ReactMarkdown components={markdownComponents}>{t("impressum_content")}</ReactMarkdown>
                                <ContactInfo />
                            </div>
                        )}
                        {activeTab === 'privacy' && (
                            <div>
                                <ReactMarkdown components={markdownComponents}>{showExtended ? t("privacy_content") : t("privacy_content_public")}</ReactMarkdown>
                                <ContactInfo />
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Legal;
