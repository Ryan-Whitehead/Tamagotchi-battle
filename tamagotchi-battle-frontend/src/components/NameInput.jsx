import { useState } from "react";

function NameInput({ value, onNameChange, maxLength = 20 }) {
  const [editName, setEditName] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  function startEditing() {
    setEditName(value);
    setIsEditing(true);
  }

  function saveName() {
    if (editName.trim() !== "") {
      onNameChange(editName);
    }
    setIsEditing(false);
  }

  function cancelEditing() {
    setIsEditing(false);
    setEditName(value);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      saveName();
    } else if (event.key === "Escape") {
      cancelEditing();
    }
  }
  return (
    <div>
      <label htmlFor="tamagotchi-name">Name Your Tamagotchi: </label>

      {!isEditing ? (
        // DISPLAY MODE - shows current name with Edit button
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>{value}</span>
          <button onClick={startEditing} style={{ padding: "4px 12px" }}>
            ✏️ Edit
          </button>
        </div>
      ) : (
        // EDIT MODE - input field with Save and Cancel buttons
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <input
            id="tamagotchi-name"
            type="text"
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a name"
            maxLength={maxLength}
            autoFocus
            style={{ padding: "8px", fontSize: "16px" }}
          />
          <button
            onClick={saveName}
            style={{
              padding: "4px 12px",
              backgroundColor: "#4CAF50",
              color: "white",
            }}
          >
            💾 Save
          </button>
          <button
            onClick={cancelEditing}
            style={{
              padding: "4px 12px",
              backgroundColor: "#f44336",
              color: "white",
            }}
          >
            ❌ Cancel
          </button>
          <span style={{ fontSize: "12px" }}>
            {editName.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}

export default NameInput;
