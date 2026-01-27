import { UserModel, UserDocument } from "../models/User.js";
import { logger } from "../logging.js";

/**
 * Generates a URL based on the given email
 * @function
 * @param {string} userEmail
 */
export function validateUrl(userEmail: string): string {
    const newEmail = userEmail.split("@");
    const reg = new RegExp(/[~/]/g);
    let newUrl = newEmail[0].toLowerCase().replaceAll(/[. ,:]+/g, "-");
    newUrl = newUrl.replaceAll(reg, "-");
    return newUrl;
}

/**
 * Creates a new user with a unique user_url (slug).
 * Retries with a suffix if the generated slug already exists.
 * 
 * @param sub The user's unique identifier (e.g. from Google or OIDC)
 * @param email The user's email
 * @param name The user's name (optional)
 * @param picture The user's picture URL (optional)
 * @param roles Roles to assign to the user (optional)
 * @returns The created user document
 */
export const createUserWithUniqueUrl = async (
    sub: string,
    email: string,
    name?: string,
    picture?: string, // can be undefined
    roles: string[] = []
): Promise<UserDocument> => {
    let user_url = validateUrl(email);
    const picture_url = picture || "";
    const userName = name || email.split('@')[0];
    let user;

    let retry = 0;
    const maxRetries = 10;

    while (retry < maxRetries) {
        try {
            // Attempt to create user with current user_url
            // We use findOneAndUpdate with upsert to handle potential race conditions or existing users by ID
            // However, the primary goal here is creation or update with unique URL check.
            // If the user already exists by _id, we should update.
            // But if we are ensuring unique URL for a NEW user, specific handling is needed.

            // logic:
            // 1. Try to upsert user by _id.
            // 2. Set user_url ONLY if inserting (setOnInsert). 
            //    Wait, if we use setOnInsert for user_url, we rely on it being unique.
            //    If we collide on user_url, it throws 11000.

            user = await UserModel.findOneAndUpdate(
                { _id: sub },
                {
                    $set: {
                        name: userName,
                        email,
                        picture_url,
                        roles
                    },
                    $setOnInsert: { user_url: user_url }
                },
                { upsert: true, new: true, runValidators: true }
            ).exec();

            return user;
        } catch (err: any) {
            if (err.code === 11000 && err.keyPattern?.user_url) {
                // Collision on user_url
                logger.warn(`Collision on user_url '${user_url}', retrying...`);
                user_url = `${validateUrl(email)}-${Math.floor(Math.random() * 100000)}`;
                retry++;
                continue;
            }
            // If it's another error, rethrow
            throw err;
        }
    }

    throw new Error(`Failed to create user after ${maxRetries} retries due to slug collision.`);
};
