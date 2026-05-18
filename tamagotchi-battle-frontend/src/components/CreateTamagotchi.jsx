import { useState } from "react";
import axios from "axios";
import TamagotchiTypeSelector from "./TamagotchiTypeSelector";

function CreateTamagotchi({ onTamagotchiCreated, token, onClose }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Fire");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter a name for your Tamagotchi");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/tamagotchi",
        { name: name.trim(), type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      onTamagotchiCreated(response.data);

      setName("");
      setType("Fire");
      onClose();
    } catch (err) {
      console.error("Create error", err);
      setError(err.response?.data?.error || "Failed to create Tamagotchi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setType("Fire");
    setError("");
    onClose();
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "16px",
        marginBottom: "20px",
        border: "1px solid #ddd",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0 }}>🎨 Create a New Tamagotchi</h3>
        <button
          onClick={handleCancel}
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#999",
          }}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Name your Tamagotchi:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Buddy, Sparky, Bubbles"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
            maxLength={20}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Choose your Tamagotchi's appearance:
          </label>
          <TamagotchiTypeSelector selectedType={type} onSelectType={setType} />
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>⚠️ {error}</p>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "14px",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? "Creating..." : "🐣 Create"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            style={{
              backgroundColor: "#ccc",
              color: "#333",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTamagotchi;
