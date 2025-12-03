// BASE64-ENCODED GOOGLE_TOKENS
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const dummyTokens = {
    access_token: "mock_access_token",
    refresh_token: "mock_refresh_token",
    scope: "https://www.googleapis.com/auth/calendar",
    token_type: "Bearer",
    expiry_date: 1634567890000
};

const google_tokens = process.env.GOOGLE_TOKENS
    ? JSON.parse(Buffer.from(process.env.GOOGLE_TOKENS, 'base64').toString('utf-8'))
    : dummyTokens;


export const USER = {
    _id: '109150731150582581691',
    __v: 0,
    email: 'christian.gawron@gmail.com',
    name: 'Christian Gawron',
    picture_url: 'https://lh3.googleusercontent.com/a/ACg8ocL0Ob8tDn2tEvCfdg4OfH8g_hMqcf_IGBRulp0PuBXVNf8PdJ6OyA=s96-c',
    pull_calendars: [
        'christian.gawron@gmail.com',
        'fj2g7ii3on2elc092n3tbd1nmv48mb3n@import.calendar.google.com',
        'family10045043731026254769@group.calendar.google.com',
        'de.german.official#holiday@group.v.calendar.google.com',
        't6hldgptmgr36ctkm1720bvcfg@group.calendar.google.com',
        'gawron.christian@fh-swf.de'
    ],
    user_url: 'christian-gawron',
    push_calendar: 't6hldgptmgr36ctkm1720bvcfg@group.calendar.google.com',
    google_tokens
}
