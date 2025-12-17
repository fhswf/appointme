import { de, enUS, fr, es, it, ja, ko, zhCN } from "date-fns/locale";
import { Locale } from "date-fns";

export const getLocale = (lang: string): Locale => {
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
