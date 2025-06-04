import express, { Request, Response } from "express";
import User from "../models/User";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: { email?: string };
}

// POST /api/analysis/save
router.post("/save", async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  console.log("🔍 Incoming user from session:", authReq.user);

  const { analysis } = req.body;

  if (!authReq.user?.email || !analysis) {
    res.status(400).json({ error: "Missing email or analysis data" });
    return;
  }

  try {
    const user = await User.findOne({ email: authReq.user.email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.savedAnalyses.push(analysis);
    console.log("✅ SavedAnalyses after push:", user.savedAnalyses);
    await user.save();

    res.status(200).json({ message: "Analysis saved successfully" });
  } catch (error) {
    console.error("Error saving analysis:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/analysis
router.get("/", async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user?.email) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = await User.findOne({ email: authReq.user.email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user.savedAnalyses);
  } catch (error) {
    console.error("Error fetching analyses:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/analysis/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const { id } = req.params;

  if (!authReq.user?.email) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = await User.findOne({ email: authReq.user.email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.savedAnalyses = user.savedAnalyses.filter(
      (a: any) => a._id.toString() !== id
    );

    await user.save();
    res.status(200).json({ message: "Analysis deleted successfully" });
  } catch (error) {
    console.error("Error deleting analysis:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
