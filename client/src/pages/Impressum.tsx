
import React from 'react';
import ReactMarkdown from 'react-markdown';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { markdownComponents } from '../components/MarkdownComponents';

import ContactInfo from '../components/ContactInfo';

const impressumContent = `
# Impressum

Die Inhalte auf diesem Server gehören nicht zum offiziellen Onlineangebot der Fachhochschule Südwestfalen.
`;

const Impressum: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppNavbar />
            <div className="container mx-auto p-8 flex-grow">
                <div className="max-w-3xl mx-auto">
                    <ReactMarkdown components={markdownComponents}>{impressumContent}</ReactMarkdown>
                    <ContactInfo />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Impressum;
