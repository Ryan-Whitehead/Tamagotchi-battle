import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
const router = express.Router();

// auth middleware
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // contains { userId, iat, exp }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

router.use(authMiddleware);

// create tamagotchi

router.post("/", async (req, res) => {
  try {
    const { name, type = "Standard" } = req.body;
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const tamagotchi = await prisma.tamagotchi.create({
      data: {
        name,
        type,
        ownerId: userId,
      },
    });

    res.status(201).json(tamagotchi);
  } catch (error) {
    console.error("Create Tamagotchi error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//get all tamagotchis for user
router.get("/", async (req, res) => {
  try {
    const userId = req.user.userId;

    const tamagotchis = await prisma.tamagotchi.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(tamagotchis);
  } catch (error) {
    console.error("Get Tamagotchis error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// get single tamagotchi
router.get("/:id", async (req, res) => {
  try {
    const tamagotchiId = parseInt(req.params.id);
    const userId = req.user.userId;

    const tamagotchi = await prisma.tamagotchi.findFirst({
      where: {
        id: tamagotchiId,
        ownerId: userId,
      },
    });

    if (!tamagotchi) {
      return res.status(404).json({ error: "Tamagotchi not found" });
    }

    res.json(tamagotchi);
  } catch (error) {
    console.error("Get Tamagotchi error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// update Tamagotchi stats
router.put("/:id", async (req, res) => {
  try {
    const tamagotchiId = parseInt(req.params.id);
    const userId = req.user.userId;
    const { hunger, happiness, energy, xp, level, health, name, addXpAmount } =
      req.body;

    const existing = await prisma.tamagotchi.findFirst({
      where: {
        id: tamagotchiId,
        ownerId: userId,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Tamagotchi not found" });
    }

    //Handle XP and level up if addXpAmount is provided
    let newXp = existing.xp;
    let newLevel = existing.level;
    let leveledUp = false;

    if (addXpAmount) {
      newXp = existing.xp + addXpAmount;
      while (newXp >= newLevel * 100) {
        newXp = newXp - newLevel * 100;
        newLevel++;
        leveledUp = true;
      }
    } else if (xp !== undefined) {
      newXp = xp;
    }

    if (level != undefined) {
      newLevel = level;
    }

    const updated = await prisma.tamagotchi.update({
      where: { id: tamagotchiId },
      data: {
        ...(hunger !== undefined && { hunger }),
        ...(happiness !== undefined && { happiness }),
        ...(energy !== undefined && { energy }),
        ...(health !== undefined && { health }),
        ...(name !== undefined && { name }),
        xp: newXp,
        level: newLevel,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Update Tamagotchi error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add XP to Tamagotchi (for feed/play/rest actions)
router.post("/:id/add-xp", async (req, res) => {
  try {
    const tamagotchiId = parseInt(req.params.id);
    const userId = req.user.userId;
    const { amount } = req.body;

    // Verify ownership
    const tamagotchi = await prisma.tamagotchi.findFirst({
      where: {
        id: tamagotchiId,
        ownerId: userId,
        isNPC: false,
      },
    });

    if (!tamagotchi) {
      return res.status(404).json({ error: "Tamagotchi not found" });
    }

    let newXp = tamagotchi.xp + amount;
    let newLevel = tamagotchi.level;
    let leveledUp = false;

    // Handle multiple level ups
    while (newXp >= newLevel * 100) {
      newXp = newXp - newLevel * 100;
      newLevel++;
      leveledUp = true;
    }

    const updated = await prisma.tamagotchi.update({
      where: { id: tamagotchiId },
      data: {
        xp: newXp,
        level: newLevel,
      },
    });

    res.json({
      xp: updated.xp,
      level: updated.level,
      leveledUp,
    });
  } catch (error) {
    console.error("Add XP error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// delete Tamagotchi
router.delete("/:id", async (req, res) => {
  try {
    const tamagotchiId = parseInt(req.params.id);
    const userId = req.user.userId;

    const existing = await prisma.tamagotchi.findFirst({
      where: {
        id: tamagotchiId,
        ownerId: userId,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Tamagotchi not found" });
    }

    // Delete BattleSessions
    await prisma.battleSession.deleteMany({
      where: {
        OR: [{ playerId: tamagotchiId }, { npcId: tamagotchiId }],
      },
    });
    await prisma.battle.deleteMany({
      where: {
        OR: [{ winnerId: tamagotchiId }, { loserId: tamagotchiId }],
      },
    });
    await prisma.tamagotchi.delete({
      where: { id: tamagotchiId },
    });
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error("Delete Tamagotchi error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
