import { Router, Request } from "express";
import passport from "passport";

interface AuthenticatedRequest extends Request {
  isAuthenticated: () => boolean;
  user?: any;
}

const router = Router();

// Starta Google-inloggning
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback efter Google-inloggning
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // Visa fel om något går snett
    session: true,
  }),
  (req, res) => {
    // Lyckad inloggning – skicka vidare till frontend
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
    res.redirect(frontendUrl);
  }
);

// Logga ut
router.get("/logout", (req, res) => {
  (req as any).logout(() => {
    res.redirect("/");
  });
});

// Hämta inloggad användare
router.get("/user", (req, res) => {
  const authReq = req as AuthenticatedRequest;

  if (authReq.isAuthenticated() && authReq.user) {
    res.json({ user: authReq.user });
  } else {
    res.status(401).json({ user: null });
  }
});

export default router;
