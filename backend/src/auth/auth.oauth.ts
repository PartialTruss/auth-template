import { google } from "googleapis";
import { createUser, findUserByEmail, saveUser } from "./auth.repository";
import { oauthClient } from "../util/googleOauthUtil";
import { IUser } from "../models/User";
import { BadRequestError } from "../errors/AppError";

export const handleGoogleCallback = async (code: string): Promise<IUser> => {
    const { tokens } = await oauthClient.getToken(code);
    oauthClient.setCredentials(tokens);

    const oauth2 = google.oauth2("v2");
    const { data } = await oauth2.userinfo.get({
        auth: oauthClient,
    });

    if (!data.email) {
        throw new BadRequestError("No email from Google.");
    }

    const email = data.email.toLowerCase();
    let user = await findUserByEmail(email);

    if (!user) {
        user = await createUser({
            email,
            googleId: data.id ?? undefined,
            isVerified: true,
        });
        return user;
    }

    if (!user.googleId && data.id) {
        user.googleId = data.id;
        user.isVerified = true;
        await saveUser(user);
    }

    return user;
};
