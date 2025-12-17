import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

export type BookingFormData = {
  name: string;
  email: string;
  description: string;
};

export type BookDetailsProps = {
  errors: any;
  onChange: (form: BookingFormData) => void;
};

const BookDetails = (props: BookDetailsProps) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    description: "",
  });

  const handleOnChange = (text: keyof BookingFormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newData = { ...formData, [text]: event.target.value };
    setFormData(newData);

    props.onChange(newData);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="name">{t("Name")}</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          placeholder={t("Please provide your name")}
          onChange={handleOnChange("name")}
          value={formData.name}
          className={props.errors.name ? "border-red-500" : ""}
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">{t("Email")}</Label>
        <Input
          type="email"
          id="email"
          name="email"
          required
          placeholder={t("You will receive a confirmation email")}
          onChange={handleOnChange("email")}
          value={formData.email}
          className={props.errors.email ? "border-red-500" : ""}
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="description">{t("Information")}</Label>
        <Textarea
          id="description"
          name="description"
          placeholder={t(
            "Please share anything that will help me to prepare for our meeting"
          )}
          rows={4}
          onChange={handleOnChange("description")}
          value={formData.description}
          className={props.errors.info ? "border-red-500" : ""}
        />
      </div>
    </div>
  );
};

export default BookDetails;
