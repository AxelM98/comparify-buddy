import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

// Spara bara användarens MongoDB-ID i sessionen
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// När användaren gör en request, hämta hela användaren från databasen med ID:t från sessionen
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Konfigurera Google OAuth2-strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          email: profile.emails?.[0].value,
        });

        if (existingUser) return done(null, existingUser);

        // Om ingen användare finns – skapa en ny
        const newUser = new User({
          email: profile.emails?.[0].value,
          googleId: profile.id,
          displayName: profile.displayName,
          name: profile.name,
          photos: profile.photos,
        });

        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
