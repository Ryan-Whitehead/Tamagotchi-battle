// src/components/BattleActions.jsx
// Turn-based battle action buttons

function BattleActions({
  onAttack,
  onDefend,
  onSpecial,
  onRun,
  disabled,
  energy,
  isPlayerTurn,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        justifyContent: "center",
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#0f0f1a",
        borderRadius: "12px",
        border: "1px solid #333",
      }}
    >
      {/* Attack Button */}
      <button
        onClick={onAttack}
        disabled={disabled || !isPlayerTurn}
        style={{
          flex: 1,
          padding: "12px 16px",
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: disabled || !isPlayerTurn ? "not-allowed" : "pointer",
          opacity: disabled || !isPlayerTurn ? 0.5 : 1,
          transition: "all 0.2s ease",
        }}
      >
        ⚔️ ATTACK
      </button>

      {/* Defend Button */}
      <button
        onClick={onDefend}
        disabled={disabled || !isPlayerTurn}
        style={{
          flex: 1,
          padding: "12px 16px",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: disabled || !isPlayerTurn ? "not-allowed" : "pointer",
          opacity: disabled || !isPlayerTurn ? 0.5 : 1,
          transition: "all 0.2s ease",
        }}
      >
        🛡️ DEFEND
      </button>

      {/* Special Button - Requires 15 Energy */}
      <button
        onClick={onSpecial}
        disabled={disabled || !isPlayerTurn || energy < 15}
        style={{
          flex: 1,
          padding: "12px 16px",
          backgroundColor: "#9b59b6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor:
            disabled || !isPlayerTurn || energy < 15
              ? "not-allowed"
              : "pointer",
          opacity: disabled || !isPlayerTurn || energy < 15 ? 0.5 : 1,
          transition: "all 0.2s ease",
        }}
      >
        ✨ SPECIAL ({energy}/15)
      </button>

      {/* Run Button */}
      <button
        onClick={onRun}
        disabled={disabled || !isPlayerTurn}
        style={{
          flex: 1,
          padding: "12px 16px",
          backgroundColor: "#2ecc71",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: disabled || !isPlayerTurn ? "not-allowed" : "pointer",
          opacity: disabled || !isPlayerTurn ? 0.5 : 1,
          transition: "all 0.2s ease",
        }}
      >
        🏃 RUN
      </button>
    </div>
  );
}

export default BattleActions;
