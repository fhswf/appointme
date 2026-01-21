import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getUser, updateUser, exportSettings, importSettings } from "../helpers/services/user_services";
import { User } from "lucide-react";
import { useAuth } from "../components/AuthProvider";
import { LanguageSelector } from "./LanguageSelector";
import { AvailabilityEditor } from "./AvailabilityEditor";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: Readonly<ProfileDialogProps>) {
    const { t } = useTranslation();
    const { refreshAuth } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        user_url: "",
        use_gravatar: false,
        send_invitation_email: false,
        defaultAvailable: {} as any
    });
    const [tab, setTab] = useState<'profile' | 'availability' | 'data'>('profile');

    useEffect(() => {
        if (open) {
            setLoading(true);
            getUser()
                .then((res) => {
                    setUser(res.data);
                    setFormData({
                        name: res.data.name,
                        user_url: res.data.user_url,
                        use_gravatar: res.data.use_gravatar || false,
                        send_invitation_email: res.data.send_invitation_email || false,
                        defaultAvailable: res.data.defaultAvailable || {}
                    });
                    setLoading(false);
                })
                .catch((err) => {
                    toast.error(t("error_loading_profile"));
                    setLoading(false);
                });
        }
    }, [open, t]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({ ...formData })
            .then((res) => {
                setUser(res.data);
                toast.success(t("profile_updated"));
                refreshAuth();
                onOpenChange(false);
            })
            .catch((err) => {
                if (err.response?.status === 409) {
                    toast.error(t("user_url_taken"));
                } else {
                    toast.error(t("error_saving_profile"));
                }
            });
    };

    const handleExport = () => {
        exportSettings()
            .then((res) => {
                const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `appointme-settings-${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success(t("Settings exported successfully"));
            })
            .catch(() => {
                toast.error(t("Failed to export settings"));
            });
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (window.confirm(t("Are you sure you want to import settings? This will overwrite your current profile and events."))) {
                    importSettings(data)
                        .then(() => {
                            toast.success(t("Settings imported successfully"));
                            refreshAuth();
                            onOpenChange(false);
                            // Optional: Reload page to reflect all changes
                            window.location.reload();
                        })
                        .catch(() => {
                            toast.error(t("Failed to import settings"));
                        });
                }
            } catch (err) {
                toast.error(t("Invalid file format"));
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = '';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" data-testid="profile-dialog">
                <DialogHeader>
                    <DialogTitle>{t("user_menu_profile")}</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="p-4 text-center">{t("loading")}</div>
                ) : (
                    <form id="profile-form" onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="flex space-x-2 mb-4 border-b pb-2">
                            <Button type="button" variant={tab === 'profile' ? 'default' : 'ghost'} onClick={() => setTab('profile')}>{t("Profile")}</Button>
                            <Button type="button" variant={tab === 'availability' ? 'default' : 'ghost'} onClick={() => setTab('availability')}>{t("Standard Availability")}</Button>
                            <Button type="button" variant={tab === 'data' ? 'default' : 'ghost'} onClick={() => setTab('data')}>{t("Data")}</Button>
                        </div>

                        {tab === 'profile' && (
                            <>
                                <div className="flex items-center justify-center mb-6">
                                    {user?.picture_url ? (
                                        <img src={user.picture_url} alt="Profile" className="w-24 h-24 rounded-full" />
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                                            <User className="w-12 h-12 text-gray-500" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{t("name")}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{t("user_url")}</label>
                                    <div className="flex rounded-md shadow-sm">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                            /users/
                                        </span>
                                        <input
                                            type="text"
                                            name="user_url"
                                            value={formData.user_url}
                                            onChange={handleChange}
                                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="use_gravatar"
                                        name="use_gravatar"
                                        type="checkbox"
                                        checked={formData.use_gravatar}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="use_gravatar" className="ml-2 block text-sm text-gray-900">
                                        {t("use_gravatar")}
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="send_invitation_email"
                                        name="send_invitation_email"
                                        type="checkbox"
                                        checked={formData.send_invitation_email || false}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="send_invitation_email" className="ml-2 block text-sm text-gray-900">
                                        {t("send_invitation_email")}
                                    </label>
                                </div>
                                <div className="text-sm text-gray-500 ml-6">
                                    {t("send_invitation_email_notice")}
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("Language")}</label>
                                    <LanguageSelector />
                                </div>
                            </>
                        )}

                        {tab === 'availability' && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">{t("Define your standard weekly availability here. You can use this availability in your Event Types.")}</p>
                                <AvailabilityEditor
                                    available={formData.defaultAvailable}
                                    onChange={(slots) => setFormData(prev => ({ ...prev, defaultAvailable: slots }))}
                                />
                            </div>
                        )}

                        {tab === 'data' && (
                            <div className="space-y-6">
                                <div className="p-4 border rounded-md bg-gray-50">
                                    <h3 className="font-medium text-gray-900 mb-2">{t("Export Settings")}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{t("Download your settings and events as a JSON file.")}</p>
                                    <Button type="button" onClick={handleExport} variant="outline" className="w-full sm:w-auto">
                                        {t("Export Data")}
                                    </Button>
                                </div>

                                <div className="p-4 border rounded-md bg-gray-50">
                                    <h3 className="font-medium text-gray-900 mb-2">{t("Import Settings")}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{t("Restore your settings from a JSON file. This will overwrite existing data.")}</p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="file"
                                            accept=".json"
                                            id="import-file"
                                            className="hidden"
                                            onChange={handleImport}
                                        />
                                        <label htmlFor="import-file">
                                            <Button type="button" variant="outline" className="w-full sm:w-auto pointer-events-none" onClick={(e) => {
                                                // Trigger the file input click
                                                // Since the label wraps the button, this might double trigger or conflict
                                                // Better: Put onClick on the Button that triggers document.getElementById('import-file').click()
                                                e.preventDefault();
                                                document.getElementById('import-file')?.click();
                                            }}>
                                                {t("Select File")}
                                            </Button>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t("Cancel")}
                    </Button>
                    <Button type="submit" form="profile-form">
                        {t("save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
