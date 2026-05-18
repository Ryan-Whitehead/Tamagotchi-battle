import { useState } from "react";
import axios from "axios";

function DeleteTamagotchiModal({ token, tamagotchis, onClose, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleDelete = async () => {
    if (!selectedId) {
      alert("Please select a Tamagotchi to delete");
      return;
    }
    const tamagotchiToDelete = tamagotchis.find((t) => t.id === selectedId);
    const confirmDelete = window.confirm(
      `Delete ${tamagotchiToDelete?.name}? This cannot be undone`,
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:8000/tamagotchi/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(selectedId);
      alert(`${tamagotchiToDelete?.name} has been deleted`);
      onclose();
    } catch (error) {
      console.error("Delete error", error);
      alert("Failed to delete Tamagotchi");
    } finally {
      setIsDeleting(false);
    }
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
          padding: "25px",
          maxWidth: "400px",
          width: "90%",
          color: "white",
        }}
      >
        <h2 style={{ marginTop: 0 }}>🗑️ Delete Tamagotchi</h2>
        <p>Select which Tamagotchi to delete:</p>

        <div style={{ marginBottom: "20px" }}>
          {tamagotchis.length === 0 ? (
            <p style={{ color: "#ccc" }}>No Tamagotchis to delete</p>
          ) : (
            tamagotchis.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px",
                  marginBottom: "8px",
                  backgroundColor: selectedId === t.id ? "#0f3460" : "#16213e",
                  borderRadius: "10px",
                  cursor: "pointer",
                  border:
                    selectedId === t.id
                      ? "1px solid #4CAF50"
                      : "1px solid #333",
                }}
              >
                <input
                  type="radio"
                  name="deleteTamagotchi"
                  checked={selectedId === t.id}
                  onChange={() => setSelectedId(t.id)}
                  style={{ marginRight: "12px", cursor: "pointer" }}
                />
                <div>
                  <strong>{t.name}</strong>
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "12px",
                      color: "#aaa",
                    }}
                  >
                    ({t.type}) - Level {t.level}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleDelete}
            disabled={!selectedId || isDeleting}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: !selectedId || isDeleting ? "not-allowed" : "pointer",
              opacity: !selectedId || isDeleting ? 0.6 : 1,
            }}
          >
            {isDeleting ? "Deleting..." : "🗑️ Delete"}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#555",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTamagotchiModal;
