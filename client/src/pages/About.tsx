import React from 'react';
import ReactMarkdown from 'react-markdown';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { markdownComponents } from '../components/MarkdownComponents';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppNavbar />
            <main className="container mx-auto p-8 flex-grow">
                <div className="max-w-3xl mx-auto">
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <ReactMarkdown components={markdownComponents}>{t("about_content")}</ReactMarkdown>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default About;
