import React, { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Event } from "common";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { EventFormProps } from "../pages/EditEvent";
import { AvailabilityEditor } from "./AvailabilityEditor";
import { useAuth } from "../components/AuthProvider";

import { useNavigate } from "react-router-dom";

export const EventForm = (props: EventFormProps): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
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
        let value: string | number = evt.target.value;
        if (mult || (evt.target as HTMLInputElement).type === "number") {
          value = Number(evt.target.value) * (mult || 1);
        }

        if (key === "name" && formData.url === generateSlug(formData.name)) {
          setFormData({
            ...formData,
            [key]: value,
            url: generateSlug(evt.target.value),
          } as Event);
        } else {
          setFormData({ ...formData, [key]: value } as Event);
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

  const [tagInput, setTagInput] = useState("");

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formData.tags?.includes(newTag)) {
        setChanged(true);
        setFormData({
          ...formData,
          tags: [...(formData.tags || []), newTag],
        });
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setChanged(true);
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

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

        <div className="space-y-2">
          <Label htmlFor="tags">{t("Tags")}</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags?.map((tag) => (
              <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-destructive focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={t("Type a tag and press Enter")}
          />
          <p className="text-sm text-muted-foreground">{t("Press Enter to add a tag")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">{t("Grammatical Gender")}</Label>
          <Select
            value={formData.gender || "neuter"}
            onValueChange={(val: any) => {
              setChanged(true);
              setFormData({ ...formData, gender: val });
            }}
          >
            <SelectTrigger id="gender">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neuter">{t("Neuter", { name: formData.name })}</SelectItem>
              <SelectItem value="male">{t("Male", { name: formData.name })}</SelectItem>
              <SelectItem value="female">{t("Female", { name: formData.name })}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">{t("gender_help_text")}</p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="restricted"
            checked={formData.allowed_roles?.includes("student")}
            onCheckedChange={(checked) => {
              setChanged(true);
              const roles = formData.allowed_roles ? [...formData.allowed_roles] : [];
              if (checked) {
                if (!roles.includes("student")) roles.push("student");
              } else {
                const index = roles.indexOf("student");
                if (index > -1) roles.splice(index, 1);
              }
              setFormData({ ...formData, allowed_roles: roles });
            }}
          />
          <Label htmlFor="restricted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {t("Restricted to Students")}
          </Label>
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
          {t("Recurrence")}
        </h2>

        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="recurrence-enabled"
            checked={formData.recurrence?.enabled || false}
            onCheckedChange={(checked) => {
              setChanged(true);
              setFormData({
                ...formData,
                recurrence: {
                  enabled: checked,
                  frequency: formData.recurrence?.frequency || 'weekly',
                  interval: formData.recurrence?.interval || 1,
                  count: formData.recurrence?.count,
                  until: formData.recurrence?.until
                }
              } as Event);
            }}
          />
          <Label htmlFor="recurrence-enabled" className="text-base font-medium">
            {t("Enable Recurring Event")}
          </Label>
        </div>

        {formData.recurrence?.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/20">
            <div className="space-y-2">
              <Label htmlFor="frequency">{t("Frequency")}</Label>
              <Select
                value={formData.recurrence.frequency}
                onValueChange={(val: any) => {
                  setChanged(true);
                  setFormData({
                    ...formData,
                    recurrence: {
                      ...formData.recurrence!,
                      frequency: val
                    }
                  });
                }}
              >
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">{t("Weekly")}</SelectItem>
                  <SelectItem value="biweekly">{t("Bi-weekly")}</SelectItem>
                  <SelectItem value="triweekly">{t("Tri-weekly")}</SelectItem>
                  <SelectItem value="monthly">{t("Monthly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("End Condition")}</Label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="recurrence-count" className="w-24 font-normal">{t("Occurrences")}:</Label>
                  <Input
                    id="recurrence-count"
                    type="number"
                    min="1"
                    max="52"
                    placeholder="e.g. 10"
                    value={formData.recurrence.count || ''}
                    onChange={(e) => {
                      setChanged(true);
                      const val = e.target.value ? Number.parseInt(e.target.value) : undefined;
                      setFormData({
                        ...formData,
                        recurrence: {
                          ...formData.recurrence!,
                          count: val,
                          span: undefined, // Clear span/until if count is set
                          until: undefined
                        }
                      });
                    }}
                  />
                </div>
                <div className="relative flex items-center gap-2">
                  <Label className="w-24 font-normal text-center text-muted-foreground">- {t("OR")} -</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="recurrence-span-val" className="w-24 font-normal">{t("Time Span")}:</Label>
                  <div className="flex flex-1 gap-2">
                    <Input
                      id="recurrence-span-val"
                      type="number"
                      min="1"
                      className="w-20"
                      value={formData.recurrence.span?.value || ''}
                      onChange={(e) => {
                        setChanged(true);
                        const val = e.target.value ? Number.parseInt(e.target.value) : 1;
                        setFormData({
                          ...formData,
                          recurrence: {
                            ...formData.recurrence!,
                            span: {
                              value: val,
                              unit: formData.recurrence?.span?.unit || 'months'
                            },
                            count: undefined,
                            until: undefined
                          }
                        });
                      }}
                    />
                    <Select
                      value={formData.recurrence.span?.unit || 'months'}
                      onValueChange={(val: 'weeks' | 'months') => {
                        setChanged(true);
                        setFormData({
                          ...formData,
                          recurrence: {
                            ...formData.recurrence!,
                            span: {
                              value: formData.recurrence?.span?.value || 3,
                              unit: val
                            },
                            count: undefined,
                            until: undefined
                          }
                        });
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="months">{t("Months")}</SelectItem>
                        <SelectItem value="weeks">{t("Weeks")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 text-sm text-muted-foreground mt-2">
              <p>{t("Series Booking Note: Students will book all occurrences at once.")}</p>
            </div>
          </div>
        )}
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
          {(formData.availabilityMode === 'define' || !formData.availabilityMode) && user?.defaultAvailable && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm(t("Overwrite current availability with standard?"))) {
                  setFormData({ ...formData, available: structuredClone(user.defaultAvailable) });
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
        {(formData.availabilityMode === 'define' || !formData.availabilityMode) && (
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

      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <Button
          data-testid="event-form-submit"
          type="submit"
          disabled={!changed}
        >
          {t("Save")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/")}
        >
          {t("Cancel")}
        </Button>
      </div>
    </form >
  );
};
