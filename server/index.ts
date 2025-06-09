import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import querystring from "querystring";
import fetch from "node-fetch";

import "./config/passport"; // Google OAuth
import authRoutes from "./routes/auth";
import analysisRoutes from "./routes/analysis";

dotenv.config();

const app = express();

// Middlewares
const allowedOrigins = [
  "http://localhost:8080",
  "https://comparify-buddy.lovable.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // sätt till true i production med HTTPS
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use("/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);

// eBay Proxy Handler
const ebaySearchHandler = async (req: Request, res: Response): Promise<void> => {
  const { keywords } = req.query;

  if (!keywords || typeof keywords !== "string") {
    res.status(400).json({ error: "Missing 'keywords' parameter" });
    return;
  }

  try {
    const basicAuth = Buffer.from(
      `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(
      "https://api.ebay.com/identity/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: querystring.stringify({
          grant_type: "client_credentials",
          scope: "https://api.ebay.com/oauth/api_scope",
        }),
      }
    );

    const tokenData = await tokenRes.json();
    console.log("🔑 Token response:", tokenData);

    const token = (tokenData as any).access_token;

    if (!token) {
      console.error("❌ No access_token found in tokenData", tokenData);
      res.status(500).json({ error: "eBay token fetch failed" });
      return;
    }

    const ebayRes = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(
        keywords
      )}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await ebayRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("eBay proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// eBay route
app.get("/api/ebay-search", ebaySearchHandler);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "", { dbName: "PriceCompApp" })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
