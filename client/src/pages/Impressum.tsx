
import React from 'react';
import ReactMarkdown from 'react-markdown';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { markdownComponents } from '../components/MarkdownComponents';

const impressumContent = `
# Impressum

Prof. Dr. Christian Gawron  
Fachhochschule Südwestfalen  
Fachbereich Informatik und Naturwissenschaften  
Frauenstuhlweg 31  
59844 Iserlohn  
[gawron.christian@fh-swf.de](mailto:gawron.christian@fh-swf.de)  
[+49 2371 566 565](tel:+492371566565)

## Disclaimer
Unter jupiter.fh-swf.de stelle ich Beispielprojekte und Materialien aus meiner Lehr- und Forschungstätigkeit vor. Die Inhalte auf diesem Sever gehören nicht zum offiziellen Onlineangebot der Fachhochschule Südwestfalen.
`;

const Impressum: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppNavbar />
            <div className="container mx-auto p-8 flex-grow">
                <div className="max-w-3xl mx-auto">
                    <ReactMarkdown components={markdownComponents}>{impressumContent}</ReactMarkdown>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Impressum;
