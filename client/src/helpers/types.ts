export interface Calendar {
    id: string;
    label: string;
    color: string;
    checked: boolean;
    type: 'google' | 'caldav';
    accountId?: string;
    originalId?: string;
}
