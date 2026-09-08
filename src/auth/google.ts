import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { v4 as uuidv4 } from 'uuid';
import {prisma} from './../services/prisma'
import dotenv from "dotenv";
dotenv.config();

const baseUrl = (process.env.BE_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

const options = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: `${baseUrl}/api/auth/google/callback`,
};


// Helpful debug output to verify the callback URL used at runtime
console.log('Google OAuth config:', {
  clientIDPresent: Boolean(options.clientID),
  clientIDLength: options.clientID.length,
  clientSecretPresent: Boolean(options.clientSecret),
  callbackURL: options.callbackURL,
});
async function verify(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
  try {
    // we check for if the user is present in our system/database.
    // which states that; is that a sign-up or sign-in?
    let user = await prisma.user.findFirst({
      where: {
        googleId: profile.id,
      },
    });

    // if not
    if (!user) {
      // create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          googleId: profile.id,
          email: profile.emails?.[0]?.value || '',
          fullName: profile.displayName || '',
          jwtSecureCode: uuidv4(),
        }
      });
    }

    // auth the User
    return done(null, user);
  } catch (error) {
    return done(error as Error);
  }
}

export default new GoogleStrategy(options, verify);
