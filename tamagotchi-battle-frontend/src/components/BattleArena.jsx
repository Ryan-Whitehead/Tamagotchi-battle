// src/components/BattleArena.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import BattleActions from "./BattleActions";

function BattleArena({ token, tamagotchi, onBattleComplete }) {
  console.log(
    "⚔️ BattleArena received tamagotchi:",
    tamagotchi?.name,
    "(Type:",
    tamagotchi?.type,
    ")",
    "(ID:",
    tamagotchi?.id,
    ")",
  );
  const [opponents, setOpponents] = useState([]);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [battleId, setBattleId] = useState(null);
  const [battleState, setBattleState] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleActive, setIsBattleActive] = useState(true);
  const [energy, setEnergy] = useState(tamagotchi?.energy || 100);
  const [view, setView] = useState("select"); // select, battle, result

  // Fetch NPC opponents on component mount
  const fetchOpponents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/battle/opponents",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setOpponents(response.data);
    } catch (error) {
      console.error("Failed to fetch opponents:", error);
    }
  };

  useEffect(() => {
    fetchOpponents();
  }, []);

  useEffect(() => {
    if (tamagotchi?.energy) {
      setEnergy(tamagotchi.energy);
    }
  }, [tamagotchi?.energy]);

  const startBattle = async () => {
    if (!selectedOpponent) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/battle/start/${selectedOpponent.id}`,
        { tamagotchiId: tamagotchi?.id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBattleId(response.data.battleId);
      setBattleState(response.data);
      setEnergy(response.data.player.energy);
      setBattleLog([]);
      setIsPlayerTurn(true);
      setIsBattleActive(true);
      setView("battle");
    } catch (error) {
      console.error("Start battle error:", error);
      alert(error.response?.data?.error || "Failed to start battle");
    } finally {
      setIsLoading(false);
    }
  };

  // Send action to backend
  const sendAction = async (action) => {
    if (!isBattleActive || !isPlayerTurn) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/battle/action",
        { battleId, action },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const result = response.data;
      setBattleState((prev) => ({
        ...prev,
        player: { ...prev.player, hp: result.player.hp },
        npc: { ...prev.npc, hp: result.npc.hp },
      }));
      if (action === "special" && result.player) {
        setEnergy((prev) => Math.max(0, prev - 15));
      }
      if (result.messages && result.messages.length > 0) {
        setBattleLog((prev) => [...prev, ...result.messages]);
      }
      if (result.battleEnded) {
        setIsBattleActive(false);
        if (result.winner === "player" && result.rewards) {
          setBattleLog((prev) => [
            ...prev,
            `🎉 VICTORY! +${result.rewards.xpGained} XP!`,
            ...(result.rewards.leveledUp
              ? [`⭐ LEVEL UP! Now Level ${result.rewards.newLevel}! ⭐`]
              : []),
          ]);
        } else if (result.winner === "npc") {
          setBattleLog((prev) => [
            ...prev,
            `💀 DEFEAT! Better luck next time!`,
          ]);
        } else if (result.winner === "run") {
          setBattleLog((prev) => [...prev, `🏃 You ran away!`]);
        }
        setView("result");
        if (onBattleComplete) onBattleComplete();
      } else {
        setIsPlayerTurn(true);
      }
    } catch (error) {
      console.error("Action error:", error);
      setBattleLog((prev) => [
        ...prev,
        `Error: ${error.response?.data?.error || "Something went wrong"}`,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Action handlers
  const handleAttack = () => sendAction("attack");
  const handleDefend = () => sendAction("defend");
  const handleSpecial = () => sendAction("special");
  const handleRun = () => sendAction("run");

  // Close battle - updated
  const closeBattle = () => {
    setView("select");
    setBattleId(null);
    setBattleState(null);
    setBattleLog([]);
    setSelectedOpponent(null);
    setEnergy(tamagotchi?.energy || 100);
    if (onBattleComplete) onBattleComplete();
  };

  // Get difficulty color
  const getDifficultyColor = (level) => {
    if (level <= 2) return "#4CAF50"; // Easy - Green
    if (level <= 4) return "#FFC107"; // Medium - Yellow
    return "#F44336"; // Hard - Red
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1a2e",
          borderRadius: "20px",
          padding: "20px",
          maxWidth: "800px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          color: "white",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>⚔️ BATTLE ARENA ⚔️</h2>
          <button
            onClick={closeBattle}
            style={{
              background: "#f44336",
              border: "none",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
            }}
          >
            ✕
          </button>
        </div>

        {/* ==================== SELECT OPPONENT VIEW ==================== */}
        {view === "select" && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <h3>
                Your Tamagotchi: {tamagotchi?.name} (Level {tamagotchi?.level})
              </h3>
              <div
                style={{
                  backgroundColor: "#16213e",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <p>❤️ HP: {tamagotchi?.health}/100</p>
                <p>⚡ Energy: {tamagotchi?.energy}/100</p>
              </div>
            </div>

            <h3>Select Opponent:</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {opponents.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => setSelectedOpponent(opp)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px",
                    backgroundColor:
                      selectedOpponent?.id === opp.id ? "#0f3460" : "#16213e",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border:
                      selectedOpponent?.id === opp.id
                        ? "2px solid #4CAF50"
                        : "1px solid #333",
                  }}
                >
                  <div>
                    <strong>{opp.name}</strong>
                    <span
                      style={{
                        marginLeft: "10px",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        backgroundColor: getDifficultyColor(opp.level),
                        color: "#333",
                      }}
                    >
                      Level {opp.level}
                    </span>
                    <div style={{ fontSize: "12px", marginTop: "5px" }}>
                      Type: {opp.type}
                    </div>
                  </div>
                  <div style={{ fontSize: "24px" }}>
                    {opp.type === "Fire" && "🔥"}
                    {opp.type === "Water" && "💧"}
                    {opp.type === "Grass" && "🌿"}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={startBattle}
              disabled={!selectedOpponent || isLoading}
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor: "#f39c12",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor:
                  !selectedOpponent || isLoading ? "not-allowed" : "pointer",
                opacity: !selectedOpponent || isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "LOADING..." : "⚔️ START BATTLE ⚔️"}
            </button>
          </>
        )}

        {/* ==================== ACTIVE BATTLE VIEW ==================== */}
        {view === "battle" && battleState && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h3>Round {battleState.round}</h3>
            </div>

            {/* VS Display with HP Bars */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >
              {/* Player */}
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "48px" }}>
                  {battleState.player.type === "Fire" && "🔥"}
                  {battleState.player.type === "Water" && "💧"}
                  {battleState.player.type === "Grass" && "🌿"}
                </div>
                <h3>{battleState.player.name}</h3>
                <div>Level {battleState.player.level}</div>
                <div style={{ marginTop: "10px" }}>
                  <div
                    style={{
                      backgroundColor: "#333",
                      borderRadius: "10px",
                      height: "10px",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#e74c3c",
                        borderRadius: "10px",
                        height: "10px",
                        width: `${(battleState.player.hp / battleState.player.maxHp) * 100}%`,
                      }}
                    />
                  </div>
                  <div>
                    ❤️ {battleState.player.hp}/{battleState.player.maxHp}
                  </div>
                </div>
                <div style={{ marginTop: "5px", fontSize: "12px" }}>
                  ⚡ Energy: {energy}
                </div>
              </div>

              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  padding: "20px",
                }}
              >
                VS
              </div>

              {/* NPC */}
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "48px" }}>
                  {battleState.npc.type === "Fire" && "🔥"}
                  {battleState.npc.type === "Water" && "💧"}
                  {battleState.npc.type === "Grass" && "🌿"}
                </div>
                <h3>{battleState.npc.name}</h3>
                <div>Level {battleState.npc.level}</div>
                <div style={{ marginTop: "10px" }}>
                  <div
                    style={{
                      backgroundColor: "#333",
                      borderRadius: "10px",
                      height: "10px",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#e74c3c",
                        borderRadius: "10px",
                        height: "10px",
                        width: `${(battleState.npc.hp / battleState.npc.maxHp) * 100}%`,
                      }}
                    />
                  </div>
                  <div>
                    ❤️ {battleState.npc.hp}/{battleState.npc.maxHp}
                  </div>
                </div>
              </div>
            </div>

            {/* Battle Log */}
            <div
              style={{
                backgroundColor: "#0f0f1a",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "20px",
                height: "150px",
                overflowY: "auto",
                fontFamily: "monospace",
                fontSize: "14px",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0" }}>📜 BATTLE LOG</h4>
              {battleLog.map((log, index) => (
                <p key={index} style={{ margin: "5px 0", color: "#ccc" }}>
                  {log}
                </p>
              ))}
              {isPlayerTurn && isBattleActive && (
                <p style={{ color: "#f39c12", marginTop: "10px" }}>
                  ⚔️ Your turn! Choose an action...
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <BattleActions
              onAttack={handleAttack}
              onDefend={handleDefend}
              onSpecial={handleSpecial}
              onRun={handleRun}
              disabled={isLoading || !isBattleActive}
              energy={energy}
              isPlayerTurn={isPlayerTurn}
            />
          </>
        )}

        {/* ==================== BATTLE RESULTS VIEW ==================== */}
        {view === "result" && (
          <>
            <h2 style={{ textAlign: "center" }}>🏆 BATTLE RESULTS 🏆</h2>
            <div
              style={{
                backgroundColor: "#0f0f1a",
                padding: "15px",
                borderRadius: "10px",
                margin: "20px 0",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {battleLog.map((log, index) => (
                <p key={index} style={{ margin: "8px 0", color: "#ccc" }}>
                  {log}
                </p>
              ))}
            </div>
            <button
              onClick={closeBattle}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Return to Game
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BattleArena;
