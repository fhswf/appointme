
import { Request, Response } from 'express';
import { UserModel } from "../models/User.js";
import { EventModel } from "../models/Event.js";
import { User, Event } from "common";

/**
 * Export user settings and events
 */
export const exportSettings = async (req: Request, res: Response): Promise<void> => {
    const userId = req['user_id'];

    try {
        const user = await UserModel.findById(userId).lean().exec();
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Remove sensitive or system-specific fields
        const {
            _id,
            google_tokens,
            createdAt,
            updatedAt,
            __v,
            ...userSettings
        } = user as any;

        const events = await EventModel.find({ user: userId }).lean().exec();

        const exportData = {
            user: userSettings,
            events: events.map((event: any) => {
                const { _id, user, createdAt, updatedAt, __v, ...eventData } = event;
                return eventData;
            })
        };

        res.setHeader('Content-Disposition', `attachment; filename="settings-${new Date().toISOString()}.json"`);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(exportData);

    } catch (err) {
        console.error("Error exporting settings:", err);
        res.status(500).json({ error: "Failed to export settings" });
    }
};

/**
 * Import user settings and events
 */
export const importSettings = async (req: Request, res: Response): Promise<void> => {
    const userId = req['user_id'];
    const { user: userSettings, events } = req.body;

    if (!userSettings && !events) {
        res.status(400).json({ error: "Invalid import data" });
        return;
    }

    try {
        // Update User Settings
        if (userSettings) {
            // Prevent overwriting critical identity fields
            delete userSettings._id;
            delete userSettings.email;
            delete userSettings.google_tokens;
            delete userSettings.roles; // Security: Don't allow role escalation via import

            // Sanitize userSettings to avoid injecting MongoDB operators
            const safeUserSettings: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(userSettings)) {
                // Skip any keys that could be interpreted as MongoDB operators
                if (typeof key === "string" && key.startsWith("$")) {
                    continue;
                }
                safeUserSettings[key] = value;
            }

            await UserModel.findByIdAndUpdate(userId, { $set: safeUserSettings }, { new: true }).exec();
        }

        // Import Events
        if (events && Array.isArray(events)) {
            for (const eventData of events) {
                // Ensure event belongs to current user
                eventData.user = userId;

                // Copy only safe, non-operator fields from the incoming eventData
                const safeEventData: any = {};
                if (eventData && typeof eventData === "object") {
                    for (const key of Object.keys(eventData)) {
                        // Disallow MongoDB operator-style keys and reserved fields
                        if (key.startsWith("$") || key === "user") {
                            continue;
                        }
                        safeEventData[key] = eventData[key];
                    }
                }
                safeEventData.user = userId;


                // Use URL as unique identifier to update existing or create new
                if (safeEventData.url && typeof safeEventData.url === 'string') {
                    await EventModel.findOneAndUpdate(
                        { user: userId, url: safeEventData.url },
                        { $set: safeEventData },
                        { upsert: true, new: true }
                    ).exec();
                }
            }
        }

        res.status(200).json({ message: "Settings imported successfully" });

    } catch (err) {
        console.error("Error importing settings:", err);
        res.status(500).json({ error: "Failed to import settings" });
    }
};
