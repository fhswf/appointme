import React, { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, Settings } from "lucide-react";
import { LocalizedTimeInput } from "./LocalizedTimeInput";

import { EventFormProps } from "../pages/EditEvent";
import { AvailabilityEditor } from "./AvailabilityEditor";
import { useAuth } from "../components/AuthProvider";

export const EventForm = (props: EventFormProps): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [formData, setFormData] = useState<Event>(props.event);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setFormData(props.event);
  }, [props.event]);

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    props.handleOnSubmit(formData);
  };

  const generateSlug = (str: string) => {
    if (!str) return "";
    const slug = str.replace(" ", "_").toLocaleLowerCase();
    console.log("generateSlug: %s %s", str, slug);
    return slug;
  };

  const handleOnChange =
    (key: keyof Event, mult?: number) =>
      (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setChanged(true);
        console.log("onChange: %o %s", evt, key);
        if (key === "name" && formData.url === generateSlug(formData.name)) {
          setFormData({
            ...formData,
            [key]: mult
              ? mult * Number.parseInt(evt.target.value)
              : evt.target.value,
            url: generateSlug(evt.target.value),
          } as Event);
        } else {
          setFormData({ ...formData, [key]: evt.target.value } as Event);
        }
      };

  const handleSelect =
    (key: keyof Event) =>
      (value: string) => {
        setChanged(true);
        console.log("onChange: %s", value);
        setFormData({ ...formData, [key]: Number(value) } as Event);
      };

  const onChangeAvailability = (slots: any) => {
    setChanged(true);
    setFormData({ ...formData, available: slots });
  };

  const onAvailabilityModeChange = (val: string) => {
    setChanged(true);
    setFormData({ ...formData, availabilityMode: val as any });
  }

  return (
    <form onSubmit={handleOnSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("these_zesty_duck_nudge")}
        </h2>

        <div className="space-y-2">
          <Label htmlFor="event-title">{t("lazy_just_duck_spin")}</Label>
          <Input
            id="event-title"
            data-testid="event-form-title"
            type="text"
            required
            onChange={handleOnChange("name")}
            value={formData.name}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t("these_moving_fox_create")}</Label>
          <Textarea
            id="description"
            onChange={handleOnChange("description")}
            value={formData.description}
          />
          <p className="text-sm text-muted-foreground">{t("north_least_gopher_burn")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">{t("honest_weak_iguana_rest")}</Label>
          <Input
            id="location"
            placeholder={t("tired_whole_bumblebee_type")}
            onChange={handleOnChange("location")}
            value={formData.location}
          />
          <p className="text-sm text-muted-foreground">{t("tiny_factual_platypus_pave")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">{t("quiet_male_yak_slurp")}</Label>
          <Input
            id="url"
            placeholder={t("dizzy_quiet_walrus_hush")}
            onChange={handleOnChange("url")}
            value={formData.url}
          />
          <p className="text-sm text-muted-foreground">{t("less_equal_octopus_dine")}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("jumpy_tasty_rook_trust")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="duration">{t("ideal_this_coyote_inspire")}</Label>
            <Select
              value={formData.duration.toString()}
              onValueChange={handleSelect("duration")}
            >
              <SelectTrigger id="duration">
                <SelectValue placeholder={t("Select duration")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">60 min</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{t("elegant_early_boar_accept")}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buffer-before">{t("mealy_happy_ray_flop")}</Label>
            <Select
              value={formData.bufferbefore.toString()}
              onValueChange={handleSelect("bufferbefore")}
            >
              <SelectTrigger id="buffer-before">
                <SelectValue placeholder={t("Select buffer")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t("none")}</SelectItem>
                <SelectItem value="5">5 min</SelectItem>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="60">60 min</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{t("real_big_crow_push")}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buffer-after">{t("close_actual_deer_boil")}</Label>
            <Select
              value={formData.bufferafter.toString()}
              onValueChange={handleSelect("bufferafter")}
            >
              <SelectTrigger id="buffer-after">
                <SelectValue placeholder={t("Select buffer")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t("none")}</SelectItem>
                <SelectItem value="5">5 min</SelectItem>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="60">60 min</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{t("keen_zippy_bulldog_gaze")}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("seemly_fine_octopus_slurp")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="maxFuture">{t("Maximum days in advance")}</Label>
            <div className="relative">
              <Input
                id="maxFuture"
                type="number"
                value={formData.maxFuture / 86400}
                onChange={handleOnChange("maxFuture", 86400)}
                className="pr-12"
              />
              <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">{t("Days")}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("event_advance_availability_description")}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rangedays">{t("quaint_known_wasp_view")}</Label>
            <div className="relative">
              <Input
                id="rangedays"
                type="number"
                value={formData.minFuture / 86400}
                onChange={handleOnChange("minFuture", 86400)}
                className="pr-12"
              />
              <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">{t("Days")}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("pretty_grand_cuckoo_arrive")}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPerDay">{t("grand_wacky_ox_flow")}</Label>
            <Input
              id="maxPerDay"
              type="number"
              value={formData.maxPerDay}
              onChange={handleOnChange("maxPerDay")}
            />
            <p className="text-sm text-muted-foreground">{t("slow_maroon_spider_praise")}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("Daily availability")}
        </h2>

        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <Label htmlFor="availabilityMode">{t("Availability Mode")}</Label>
            <Select
              value={formData.availabilityMode || 'define'}
              onValueChange={onAvailabilityModeChange}
            >
              <SelectTrigger id="availabilityMode" className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="define">{t('Define Custom')}</SelectItem>
                <SelectItem value="default">{t('Use Standard')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.availabilityMode === 'define' && user?.defaultAvailable && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm(t("Overwrite current availability with standard?"))) {
                  setFormData({ ...formData, available: structuredClone(user.defaultAvailable!) });
                  setChanged(true);
                }
              }}
            >
              {t("Copy Standard Availability")}
            </Button>
          )}
        </div>
        {formData.availabilityMode === 'default' && (
          <div className="text-sm text-muted-foreground mb-4">
            {t("Using Standard Availability defined in Profile settings.")}
          </div>
        )}
        {formData.availabilityMode === 'define' && (
          <AvailabilityEditor
            available={formData.available}
            onChange={onChangeAvailability}
          />
        )}
        {formData.availabilityMode === 'default' && (
          <div className="border rounded-lg p-6 text-center text-muted-foreground bg-muted/20">
            {t("Using Standard Availability defined in Profile settings.")}
          </div>
        )}
      </div>

      <Button
        data-testid="event-form-submit"
        type="submit"
        className="save"
        disabled={!changed}
      >
        {t("Save")}
      </Button>
    </form>
  );
};
