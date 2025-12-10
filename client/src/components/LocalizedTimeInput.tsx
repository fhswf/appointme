import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input";
import { format, parse, isValid } from 'date-fns';
import { enUS, de, fr, es, it, ja, ko, zhCN } from 'date-fns/locale';

interface LocalizedTimeInputProps {
    value: string; // HH:mm (24h)
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string; // Add className prop
}

const getLocale = (lang: string) => {
    // Map i18n language codes to date-fns locales
    switch (lang) {
        case 'de': return de;
        case 'fr': return fr;
        case 'es': return es;
        case 'it': return it;
        case 'ja': return ja;
        case 'ko': return ko;
        case 'zh': return zhCN;
        default: return enUS;
    }
};

const getFormatStr = (lang: string) => {
    // Define preferred time format per locale
    switch (lang) {
        case 'de':
        case 'fr':
        case 'es':
        case 'it':
        case 'ja':
        case 'ko':
        case 'zh':
            return 'HH:mm'; // 24h format for these
        default: return 'hh:mm aa'; // 12h format for en
    }
};

export const LocalizedTimeInput = ({ value, onChange, placeholder, className }: LocalizedTimeInputProps) => {
    const { i18n } = useTranslation();
    const [displayValue, setDisplayValue] = useState(value);

    // Reference date for parsing times (just need a valid date)
    const refDate = new Date();

    const formatTime = (timeStr: string, lang: string) => {
        if (!timeStr) return '';
        const date = parse(timeStr, 'HH:mm', refDate);
        if (isValid(date)) {
            return format(date, getFormatStr(lang), { locale: getLocale(lang) });
        }
        return timeStr;
    };

    const parseTime = (displayStr: string, lang: string) => {
        if (!displayStr) return '';

        let date = parse(displayStr, getFormatStr(lang), refDate, { locale: getLocale(lang) });

        // Fallback: try parsing as HH:mm directly if user typed 24h anyway
        if (!isValid(date)) {
            date = parse(displayStr, 'HH:mm', refDate);
        }

        if (isValid(date)) {
            return format(date, 'HH:mm');
        }
        return null;
    };

    useEffect(() => {
        setDisplayValue(formatTime(value, i18n.language));
    }, [value, i18n.language]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setDisplayValue(newVal);

        const parsed = parseTime(newVal, i18n.language);
        if (parsed) {
            onChange(parsed);
        }
    };

    const handleBlur = () => {
        // Re-format on blur to ensure clean display
        const parsed = parseTime(displayValue, i18n.language);
        if (parsed) {
            setDisplayValue(formatTime(parsed, i18n.language));
        } else {
            // If invalid, revert or clear? 
            // Reverting to last valid value passed via props might be safer
            setDisplayValue(formatTime(value, i18n.language));
        }
    };

    return (
        <Input
            type="text"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder || (i18n.language === 'en' ? "09:00 AM" : "09:00")}
            className={className}
        />
    );
};
