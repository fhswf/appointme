import React from 'react';
import ReactMarkdown from 'react-markdown';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { markdownComponents } from '../components/MarkdownComponents';

import ContactInfo from '../components/ContactInfo';

const privacyContent = `
# Datenschutzhinweise

## Speicherung und Verarbeitung personenbezogener Daten

Diese Anwendung speichert und verarbeitet folgende personenbezogene Daten, die für die Funktion der Anwendung notwendig sind:

*   **Benutzerprofil:** Name, E-Mail-Adresse, Profilbild-URL.
*   **Authentifizierungsdaten:** OAuth-Token (für Google Kalender Integration) und/oder Zugangsdaten für CalDAV-Kalender (Benutzername, Passwort).
*   **Kalenderdaten:** Konfiguration der zu verknüpfenden Kalender, erstellte Ereignistypen (Name, Beschreibung, Ort) und Terminbuchungen.
*   **Logdaten:** In den Logdateien des Servers wird Ihre IP-Adresse vorübergehend gespeichert.

## Cookies und Drittanbieter

Die Anwendung verwendet Cookies zur Sitzungsverwaltung.

Teilweise verwenden die Anwendungen Komponenten, die auf Content-Delivery-Networks wie Cloudflare gehostet werden, und/oder Webdienste von Drittanbietern wie Mapbox oder Google Calendar API. Bei der Verwendung der Anwendungen greift Ihr Browser bzw. der Server auf diese Komponenten und Dienste zu, wodurch Ihre IP-Adresse und ggf. auch weitere Daten an die jeweiligen Anbieter übertragen werden.
`;

const Privacy: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppNavbar />
            <div className="container mx-auto p-8 flex-grow">
                <div className="max-w-3xl mx-auto">
                    <ReactMarkdown components={markdownComponents}>{privacyContent}</ReactMarkdown>
                    <ContactInfo />
                </div>
            </div>
            <Footer />
        </div >
    );
};

export default Privacy;
