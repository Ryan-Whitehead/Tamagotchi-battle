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

// Auth Middleware
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
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

router.use(authMiddleware);

// Battle Calculation Formula
function calculateAttackPower(tamagotchi) {
  return (
    tamagotchi.happiness * 0.4 + tamagotchi.energy * 0.3 + tamagotchi.level * 10
  );
}

function calculateDefensePower(tamagotchi) {
  return (100 - tamagotchi.hunger) * 0.3 + tamagotchi.level * 5;
}

function getTypeMultiplier(attackerType, defenderType) {
  // Type advantages
  const advantages = {
    Fire: { beats: "Grass", weakTo: "Water" },
    Water: { beats: "Fire", weakTo: "Grass" },
    Grass: { beats: "Water", weakTo: "Fire" },
  };

  const attacker = advantages[attackerType];

  if (!attacker) return 1.0;

  if (attacker.beats === defenderType) {
    return 1.5; // Super effective
  }
  if (attacker.weakTo === defenderType) {
    return 0.7; // Not very effective
  }
  return 1.0; // Normal
}

function calculateDamage(attacker, defender) {
  const attackPower = calculateAttackPower(attacker);
  const defensePower = calculateDefensePower(defender);
  const typeMultiplier = getTypeMultiplier(attacker.type, defender.type);
  let damage = (attackPower - defensePower) / 10;

  // apply type multipler
  damage = damage * typeMultiplier;

  const variance = 0.9 + Math.random() * 0.2;
  damage = damage * variance;
  damage = Math.max(1, Math.floor(damage));

  return {
    damage,
    typeMultiplier,
    attackPower: Math.floor(attackPower),
    defensePower: Math.floor(defensePower),
  };
}

function calculateBattle(attacker, defender) {
  const attackerDamage = calculateDamage(attacker, defender);
  const defenderDamage = calculateDamage(defender, attacker);

  return {
    attackerDamage: attackerDamage.damage,
    defenderDamage: defenderDamage.damage,
    attackerStats: {
      attackPower: attackerDamage.attackPower,
      defensePower: attackerDamage.defensePower,
      typeMultiplier: attackerDamage.typeMultiplier,
    },
    defenderStats: {
      attackPower: defenderDamage.attackPower,
      defensePower: defenderDamage.defensePower,
      typeMultiplier: defenderDamage.typeMultiplier,
    },
  };
}

// start battle session

router.post("/start/:npcId", async (req, res) => {
  try {
    const userId = req.user.userId;
    const npcId = parseInt(req.params.npcId);
    const { tamagotchiId } = req.body;

    // Get player's best Tamagotchi
    let playerTamagotchi = await prisma.tamagotchi.findFirst({
      where: {
        id: tamagotchiId,
        ownerId: userId,
        isNPC: false,
      },
    });

    if (!playerTamagotchi) {
      return res
        .status(400)
        .json({ error: "You need to create a Tamagotchi first!" });
    }

    // Get NPC opponent
    const npc = await prisma.tamagotchi.findFirst({
      where: {
        id: npcId,
        isNPC: true,
      },
    });

    if (!npc) {
      return res.status(404).json({ error: "NPC not found" });
    }

    await prisma.battleSession.deleteMany({
      where: {
        playerId: playerTamagotchi.id,
        npcId: npc.id,
        status: "active",
      },
    });

    // Create new battle session
    const battleSession = await prisma.battleSession.create({
      data: {
        playerId: playerTamagotchi.id,
        npcId: npc.id,
        playerHP: playerTamagotchi.health,
        npcHP: npc.health,
        round: 1,
        playerDefense: false,
        npcDefense: false,
        status: "active",
      },
    });

    // Calculate initial stats for display
    const playerAttack = Math.floor(
      playerTamagotchi.happiness * 0.4 +
        playerTamagotchi.energy * 0.3 +
        playerTamagotchi.level * 10,
    );

    const playerDefense = Math.floor(
      (100 - playerTamagotchi.hunger) * 0.3 + playerTamagotchi.level * 5,
    );

    const npcAttack = Math.floor(
      npc.happiness * 0.4 + npc.energy * 0.3 + npc.level * 10,
    );

    const npcDefense = Math.floor((100 - npc.hunger) * 0.3 + npc.level * 5);

    res.json({
      battleId: battleSession.id,
      round: battleSession.round,
      player: {
        id: playerTamagotchi.id,
        name: playerTamagotchi.name,
        type: playerTamagotchi.type,
        hp: battleSession.playerHP,
        maxHp: playerTamagotchi.health,
        attack: playerAttack,
        defense: playerDefense,
        energy: playerTamagotchi.energy,
      },
      npc: {
        id: npc.id,
        name: npc.name,
        type: npc.type,
        hp: battleSession.npcHP,
        maxHp: npc.health,
        attack: npcAttack,
        defense: npcDefense,
      },
      status: battleSession.status,
    });
  } catch (error) {
    console.error("Start battle error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// Get NPC copponents
router.get("/opponents", async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all NPC Tamagotchis
    const npcs = await prisma.tamagotchi.findMany({
      where: {
        isNPC: true,
      },
      orderBy: [{ level: "asc" }],
    });

    res.json(npcs);
  } catch (error) {
    console.error("Get opponents error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Battle Action
router.post("/action", async (req, res) => {
  console.log("Action request received:", req.body); //inshallah I will find this bug
  try {
    const userId = req.user.userId;
    const { battleId, action } = req.body;
    console.log("battleId:", battleId, "action:", action);

    // Get the battle session
    const battleSession = await prisma.battleSession.findUnique({
      where: { id: battleId },
      include: {
        player: true,
        npc: true,
      },
    });

    if (!battleSession) {
      return res.status(404).json({ error: "Battle session not found" });
    }

    // Verify ownership
    if (battleSession.player.ownerId !== userId) {
      return res.status(403).json({ error: "Not your battle" });
    }

    // Check if battle is still active
    if (battleSession.status !== "active") {
      return res.status(400).json({ error: "Battle already ended" });
    }

    let playerDamage = 0;
    let npcDamage = 0;
    let actionMessage = "";
    let npcActionMessage = "";
    let battleEnded = false;
    let winner = null;
    let newPlayerHP = battleSession.playerHP;
    let newNpcHP = battleSession.npcHP;
    let playerDefenseActive = battleSession.playerDefense;
    let npcDefenseActive = battleSession.npcDefense;

    // Calculate base stats
    const playerAttack = Math.floor(
      battleSession.player.happiness * 0.4 +
        battleSession.player.energy * 0.3 +
        battleSession.player.level * 10,
    );

    const playerDefenseStat = Math.floor(
      (100 - battleSession.player.hunger) * 0.3 +
        battleSession.player.level * 5,
    );

    const npcAttack = Math.floor(
      battleSession.npc.happiness * 0.4 +
        battleSession.npc.energy * 0.3 +
        battleSession.npc.level * 10,
    );

    const npcDefenseStat = Math.floor(
      (100 - battleSession.npc.hunger) * 0.3 + battleSession.npc.level * 5,
    );

    const typeMultiplier = getTypeMultiplier(
      battleSession.player.type,
      battleSession.npc.type,
    );

    switch (action) {
      case "attack":
        playerDamage = Math.max(
          1,
          Math.floor(
            ((playerAttack - npcDefenseStat) / 10) *
              typeMultiplier *
              (0.9 + Math.random() * 0.2),
          ),
        );
        newNpcHP = Math.max(0, newNpcHP - playerDamage);
        actionMessage = `${battleSession.player.name} uses ${battleSession.player.type} attack! Deals ${playerDamage} damage!`;
        break;

      case "defend":
        playerDefenseActive = true;
        actionMessage = `${battleSession.player.name} defends! Incoming damage reduced by 50%!`;
        break;

      case "special":
        if (battleSession.player.energy < 15) {
          return res
            .status(400)
            .json({ error: "Not enough energy for special attack!" });
        }
        playerDamage = Math.max(
          1,
          Math.floor(
            ((playerAttack - npcDefenseStat) / 10) *
              typeMultiplier *
              2 *
              (0.9 + Math.random() * 0.2),
          ),
        );
        newNpcHP = Math.max(0, newNpcHP - playerDamage);
        actionMessage = `${battleSession.player.name} uses SPECIAL MOVE! Deals ${playerDamage} damage!`;
        await prisma.tamagotchi.update({
          where: { id: battleSession.player.id },
          data: { energy: Math.max(0, battleSession.player.energy - 15) },
        });
        break;

      case "run":
        const runSuccess = Math.random() < 0.5;
        if (runSuccess) {
          await prisma.battleSession.update({
            where: { id: battleId },
            data: { status: "run" },
          });
          return res.json({
            battleEnded: true,
            winner: "run",
            message: `${battleSession.player.name} successfully ran away!`,
          });
        } else {
          actionMessage = `${battleSession.player.name} tried to run but failed! Takes double damage!`;
          npcDamage = Math.max(
            1,
            Math.floor(
              ((npcAttack - playerDefenseStat) / 10) *
                2 *
                (0.9 + Math.random() * 0.2),
            ),
          );
          newPlayerHP = Math.max(0, newPlayerHP - npcDamage);
        }
        break;

      default:
        return res.status(400).json({ error: "Invalid action" });
    }

    if (!battleEnded && newNpcHP > 0 && newPlayerHP > 0) {
      const npcAction = Math.random();

      if (npcAction < 0.6) {
        // Attack
        npcDamage = Math.max(
          1,
          Math.floor(
            ((npcAttack - playerDefenseStat) / 10) *
              (0.9 + Math.random() * 0.2),
          ),
        );
        if (playerDefenseActive) {
          npcDamage = Math.floor(npcDamage / 2);
          npcActionMessage = `${battleSession.npc.name} attacks but ${battleSession.player.name} defends! Deals ${npcDamage} damage!`;
          playerDefenseActive = false;
        } else {
          npcActionMessage = `${battleSession.npc.name} attacks! Deals ${npcDamage} damage!`;
        }
        newPlayerHP = Math.max(0, newPlayerHP - npcDamage);
      } else if (npcAction < 0.85) {
        // Defend
        npcDefenseActive = true;
        npcActionMessage = `${battleSession.npc.name} defends!`;
      } else {
        // Special
        npcDamage = Math.max(
          1,
          Math.floor(
            ((npcAttack - playerDefenseStat) / 10) *
              2 *
              (0.9 + Math.random() * 0.2),
          ),
        );
        if (playerDefenseActive) {
          npcDamage = Math.floor(npcDamage / 2);
          npcActionMessage = `${battleSession.npc.name} uses SPECIAL MOVE! ${battleSession.player.name} defends! Deals ${npcDamage} damage!`;
          playerDefenseActive = false;
        } else {
          npcActionMessage = `${battleSession.npc.name} uses SPECIAL MOVE! Deals ${npcDamage} damage!`;
        }
        newPlayerHP = Math.max(0, newPlayerHP - npcDamage);
        await prisma.tamagotchi.update({
          where: { id: battleSession.npc.id },
          data: { energy: Math.max(0, battleSession.npc.energy - 15) },
        });
      }
    }

    if (newPlayerHP <= 0) {
      battleEnded = true;
      winner = "npc";
    } else if (newNpcHP <= 0) {
      battleEnded = true;
      winner = "player";
    }

    await prisma.battleSession.update({
      where: { id: battleId },
      data: {
        playerHP: newPlayerHP,
        npcHP: newNpcHP,
        round: { increment: 1 },
        playerDefense: playerDefenseActive,
        npcDefense: npcDefenseActive,
        status: battleEnded
          ? winner === "player"
            ? "player_win"
            : "npc_win"
          : "active",
      },
    });

    let rewards = null;
    if (battleEnded && winner === "player") {
      const playerTamagotchi = battleSession.player;
      let newXp = playerTamagotchi.xp + 50;
      let newLevel = playerTamagotchi.level;
      let leveledUp = false;

      const xpNeeded = playerTamagotchi.level * 100;
      if (newXp >= xpNeeded) {
        newLevel++;
        newXp = newXp - xpNeeded;
        leveledUp = true;
      }

      await prisma.tamagotchi.update({
        where: { id: playerTamagotchi.id },
        data: {
          xp: newXp,
          level: newLevel,
          happiness: Math.min(100, playerTamagotchi.happiness + 10),
          wins: playerTamagotchi.wins + 1,
        },
      });

      // Record battle
      await prisma.battle.create({
        data: {
          winnerId: playerTamagotchi.id,
          loserId: battleSession.npc.id,
          winnerScore: 100,
          loserScore: 0,
          turns: battleSession.round,
        },
      });

      rewards = {
        xpGained: 50,
        happinessChange: 10,
        leveledUp,
        newLevel: leveledUp ? newLevel : null,
      };
    }

    res.json({
      battleEnded,
      winner,
      currentRound: battleSession.round,
      player: {
        hp: newPlayerHP,
        maxHp: battleSession.player.health,
        defenseActive: playerDefenseActive,
      },
      npc: {
        hp: newNpcHP,
        maxHp: battleSession.npc.health,
        defenseActive: npcDefenseActive,
      },
      messages: [
        actionMessage,
        npcActionMessage ? npcActionMessage : null,
      ].filter(Boolean),
      rewards,
    });
  } catch (error) {
    console.error("Battle action error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

export default router;
