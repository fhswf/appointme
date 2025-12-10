
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuthenticated } from "../helpers/helpers";
import { getUser, updateUser } from "../helpers/services/user_services";
import { User } from "lucide-react";
import { LanguageSelector } from "../components/LanguageSelector";


import { toast } from "sonner";

export default function Profile() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthenticated();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    user_url: "",
    use_gravatar: false
  });

  useEffect(() => {
    if (isAuthenticated) {
      getUser()
        .then((res) => {
          setUser(res.data);
          setFormData({
            name: res.data.name,
            user_url: res.data.user_url,
            use_gravatar: res.data.use_gravatar || false
          });
          setLoading(false);
        })
        .catch((err) => {
          toast.error(t("error_loading_profile"));
          setLoading(false);
        });
    }
  }, [isAuthenticated, t]);

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
        // Force reload or update context if needed to show new avatar immediately in navbar
        // For now, simpler to just update local state
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          toast.error(t("user_url_taken"));

        } else {
          toast.error(t("error_saving_profile"));
        }
      });
  };

  if (!isAuthenticated) {
    return <div className="p-4">Please log in.</div>;
  }

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-6">
          {user.picture_url ? (
            <img src={user.picture_url} alt="Profile" className="w-24 h-24 rounded-full" />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-gray-500" />
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center">{t("user_menu_profile")}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t("save")}
          </button>

          <div className="border-t pt-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("Language")}</label>
            <LanguageSelector />
          </div>

        </form>
      </div>
    </div>
  );
}
