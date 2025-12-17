import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getUser, updateUser } from "../helpers/services/user_services";
import { User } from "lucide-react";
import { useAuth } from "../components/AuthProvider";
import { LanguageSelector } from "./LanguageSelector";
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
        send_invitation_email: false
    });

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
                        send_invitation_email: res.data.send_invitation_email || false
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
