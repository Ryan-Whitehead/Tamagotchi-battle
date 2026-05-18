import { useState, useEffect } from "react";
import axios from "axios";

// Imports
import Tamagotchi from "./components/Tamagotchi";
import Stats from "./components/Stats";
import WarningMessages from "./components/WarningMessages";
import ActionButtons from "./components/ActionButtons";
import CreateTamagotchi from "./components/CreateTamagotchi";
import BattleArena from "./components/BattleArena";
import DeleteTamagotchiModal from "./components/DeleteTamagotchiModal"; // ← ADD THIS

function App() {
  // Auth state
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Tamagotchi state
  const [tamagotchis, setTamagotchis] = useState([]);
  const [selectedTamagotchi, setSelectedTamagotchi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBattleArena, setShowBattleArena] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // ← ADD THIS

  // Login/Register form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authError, setAuthError] = useState("");

  // Auth functions
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError("");

    try {
      await axios.post("http://localhost:8000/auth/register", {
        email,
        password,
      });
      await handleLogin(e, true);
    } catch (err) {
      setAuthError(err.response?.data?.error || "Registration failed");
      setIsLoading(false);
    }
  };

  const handleLogin = async (e, isFromRegister = false) => {
    if (!isFromRegister) e.preventDefault();
    setIsLoading(true);
    setAuthError("");

    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      setIsLoggedIn(true);

      setEmail("");
      setPassword("");

      await loadTamagotchis(token);
    } catch (err) {
      setAuthError(err.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setTamagotchis([]);
    setSelectedTamagotchi(null);
  };

  // Tamagotchi API functions
  const loadTamagotchis = async (authToken) => {
    try {
      const response = await axios.get("http://localhost:8000/tamagotchi", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setTamagotchis(response.data);

      if (response.data.length > 0) {
        setSelectedTamagotchi(response.data[0]);
      }
    } catch (err) {
      console.error("Load tamagotchis error:", err);
    }
  };

  const handleTamagotchiCreated = (newTamagotchi) => {
    setTamagotchis([...tamagotchis, newTamagotchi]);
    setSelectedTamagotchi(newTamagotchi);
  };

  const updateTamagotchiStats = async (updates) => {
    if (!selectedTamagotchi || !token) return;

    try {
      const response = await axios.put(
        `http://localhost:8000/tamagotchi/${selectedTamagotchi.id}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSelectedTamagotchi(response.data);

      const updatedList = tamagotchis.map((t) =>
        t.id === response.data.id ? response.data : t,
      );
      setTamagotchis(updatedList);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Delete handler
  const handleDeleteTamagotchi = (deletedId) => {
    const updatedList = tamagotchis.filter((t) => t.id !== deletedId);
    setTamagotchis(updatedList);
    if (selectedTamagotchi?.id === deletedId) {
      setSelectedTamagotchi(updatedList[0] || null);
    }
    setShowDeleteModal(false);
  };

  // Action functions
  const feedTamagotchi = () => {
    if (!selectedTamagotchi) return;
    const newHunger = Math.max(0, selectedTamagotchi.hunger - 10);
    updateTamagotchiStats({ hunger: newHunger });
  };

  const playWithTamagotchi = () => {
    if (!selectedTamagotchi) return;
    const newHappiness = Math.min(100, selectedTamagotchi.happiness + 15);
    const newEnergy = Math.max(0, selectedTamagotchi.energy - 5);
    const newXp = selectedTamagotchi.xp + 5;

    updateTamagotchiStats({
      happiness: newHappiness,
      energy: newEnergy,
      xp: newXp,
    });
  };

  const restTamagotchi = () => {
    if (!selectedTamagotchi) return;
    const newEnergy = Math.min(100, selectedTamagotchi.energy + 20);
    const newHunger = Math.min(100, selectedTamagotchi.hunger + 5);
    const newXp = selectedTamagotchi.xp + 3;

    updateTamagotchiStats({
      energy: newEnergy,
      hunger: newHunger,
      xp: newXp,
    });
  };

  // Auto-decay effect
  useEffect(() => {
    if (!selectedTamagotchi || !token) return;

    const interval = setInterval(() => {
      const newHunger = Math.min(100, selectedTamagotchi.hunger + 2);
      const newEnergy = Math.max(0, selectedTamagotchi.energy - 2);
      const newHappiness = Math.max(0, selectedTamagotchi.happiness - 1);

      updateTamagotchiStats({
        hunger: newHunger,
        energy: newEnergy,
        happiness: newHappiness,
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedTamagotchi, token]);

  // Render login form
  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
        <h1>🐣 Tamagotchi Battle</h1>
        <form onSubmit={isLoginMode ? handleLogin : handleRegister}>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px", fontSize: "16px" }}
              required
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "10px", fontSize: "16px" }}
              required
            />
          </div>
          {authError && (
            <p style={{ color: "red", marginBottom: "15px" }}>⚠️ {authError}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Loading..." : isLoginMode ? "Login" : "Register"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            style={{
              background: "none",
              border: "none",
              color: "#4CAF50",
              cursor: "pointer",
            }}
          >
            {isLoginMode
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>
        </p>
      </div>
    );
  }

  // Render main game
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>🐣 Tamagotchi Battle</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout ({user?.email})
        </button>
      </div>

      {/* Create Button */}
      <div style={{ marginBottom: "20px" }}>
        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span>➕</span> Create New Tamagotchi
          </button>
        ) : (
          <CreateTamagotchi
            onTamagotchiCreated={handleTamagotchiCreated}
            token={token}
            onClose={() => setShowCreateForm(false)}
          />
        )}
      </div>

      {/* Battle Button */}
      {tamagotchis.length > 0 && (
        <button
          onClick={() => setShowBattleArena(true)}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#f39c12",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          <span>⚔️</span> BATTLE ARENA
        </button>
      )}

      {/* Delete Button */}
      {tamagotchis.length > 0 && (
        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          🗑️ DELETE TAMAGOTCHI
        </button>
      )}

      {/* Tamagotchi Selector */}
      {tamagotchis.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold" }}>Select Tamagotchi:</label>
          <select
            value={selectedTamagotchi?.id || ""}
            onChange={(e) => {
              const selected = tamagotchis.find(
                (t) => t.id === parseInt(e.target.value),
              );
              setSelectedTamagotchi(selected);
            }}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          >
            {tamagotchis.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.type}) - Level {t.level}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Game Display */}
      {selectedTamagotchi ? (
        <>
          <Tamagotchi
            type={selectedTamagotchi.type}
            name={selectedTamagotchi.name}
            hunger={selectedTamagotchi.hunger}
            energy={selectedTamagotchi.energy}
            happiness={selectedTamagotchi.happiness}
          />
          <Stats
            hunger={selectedTamagotchi.hunger}
            happiness={selectedTamagotchi.happiness}
            energy={selectedTamagotchi.energy}
          />
          <WarningMessages
            hunger={selectedTamagotchi.hunger}
            energy={selectedTamagotchi.energy}
            happiness={selectedTamagotchi.happiness}
            health={selectedTamagotchi.health}
          />
          <ActionButtons
            onFeed={feedTamagotchi}
            onPlay={playWithTamagotchi}
            onRest={restTamagotchi}
            hunger={selectedTamagotchi.hunger}
            energy={selectedTamagotchi.energy}
          />
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>🎨 Create your first Tamagotchi above!</p>
        </div>
      )}

      {/* Battle Arena Modal */}
      {showBattleArena && (
        <BattleArena
          token={token}
          tamagotchi={selectedTamagotchi}
          onBattleComplete={() => {
            loadTamagotchis(token);
            setShowBattleArena(false);
          }}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteTamagotchiModal
          token={token}
          tamagotchis={tamagotchis}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteTamagotchi}
        />
      )}
    </div>
  );
}

export default App;
