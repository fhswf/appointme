
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { markdownComponents } from './MarkdownComponents';
import { getAuthConfig } from '../helpers/services/auth_services';

const ContactInfo: React.FC = () => {
    const { t } = useTranslation();
    const [contactInfo, setContactInfo] = useState<string>('');

    useEffect(() => {
        getAuthConfig().then((config) => {
            if (config.contactInfo) {
                setContactInfo(config.contactInfo);
            }
        }).catch((err) => {
            console.error('Failed to load contact info', err);
        });
    }, []);

    if (!contactInfo) {
        return null;
    }

    return (
        <>
            <h2 className="text-2xl font-semibold mt-6 mb-3">{t('Contact')}</h2>
            <ReactMarkdown components={markdownComponents}>{contactInfo}</ReactMarkdown>
        </>
    );
};

export default ContactInfo;
