import {
  Box,
  Heading,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  Select,
  SimpleGrid,
  Progress,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import axios from "axios";

// Imports
import Tamagotchi from "./components/Tamagotchi";
import Stats from "./components/Stats";
import WarningMessages from "./components/WarningMessages";
import ActionButtons from "./components/ActionButtons";
import CreateTamagotchi from "./components/CreateTamagotchi";
import BattleArena from "./components/BattleArena";
import DeleteTamagotchiModal from "./components/DeleteTamagotchiModal";

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
  const feedTamagotchi = async () => {
    if (!selectedTamagotchi) return;
    const newHunger = Math.max(0, selectedTamagotchi.hunger - 10);

    try {
      const response = await axios.put(
        `http://localhost:8000/tamagotchi/${selectedTamagotchi.id}`,
        { hunger: newHunger },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSelectedTamagotchi(response.data);

      const updatedList = tamagotchis.map((t) =>
        t.id === response.data.id ? response.data : t,
      );
      setTamagotchis(updatedList);
    } catch (error) {
      console.error("Feed error:", error);
    }
  };

  const playWithTamagotchi = async () => {
    if (!selectedTamagotchi) return;
    const newHappiness = Math.min(100, selectedTamagotchi.happiness + 15);
    const newEnergy = Math.max(0, selectedTamagotchi.energy - 5);

    try {
      const response = await axios.put(
        `http://localhost:8000/tamagotchi/${selectedTamagotchi.id}`,
        {
          happiness: newHappiness,
          energy: newEnergy,
          addXpAmount: 5,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSelectedTamagotchi(response.data);

      const updatedList = tamagotchis.map((t) =>
        t.id === response.data.id ? response.data : t,
      );
      setTamagotchis(updatedList);

      if (response.data.leveledUp) {
        alert(
          `🎉 Congratulations! ${selectedTamagotchi.name} reached Level ${response.data.level}! 🎉`,
        );
      }
    } catch (error) {
      console.error("Play error:", error);
    }
  };

  const restTamagotchi = async () => {
    if (!selectedTamagotchi) return;
    const newEnergy = Math.min(100, selectedTamagotchi.energy + 20);
    const newHunger = Math.min(100, selectedTamagotchi.hunger + 5);

    try {
      const response = await axios.put(
        `http://localhost:8000/tamagotchi/${selectedTamagotchi.id}`,
        {
          energy: newEnergy,
          hunger: newHunger,
          addXpAmount: 3,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSelectedTamagotchi(response.data);

      const updatedList = tamagotchis.map((t) =>
        t.id === response.data.id ? response.data : t,
      );
      setTamagotchis(updatedList);

      if (response.data.leveledUp) {
        alert(
          `🎉 Congratulations! ${selectedTamagotchi.name} reached Level ${response.data.level}! 🎉`,
        );
      }
    } catch (error) {
      console.error("Rest error:", error);
    }
  };
  // Auto-decay effect
  // Auto-decay effect
  useEffect(() => {
    if (!selectedTamagotchi || !token) return;

    const interval = setInterval(async () => {
      const newHunger = Math.min(100, selectedTamagotchi.hunger + 2);
      const newEnergy = Math.max(0, selectedTamagotchi.energy - 2);
      const newHappiness = Math.max(0, selectedTamagotchi.happiness - 1);

      try {
        const response = await axios.put(
          `http://localhost:8000/tamagotchi/${selectedTamagotchi.id}`,
          { hunger: newHunger, energy: newEnergy, happiness: newHappiness },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setSelectedTamagotchi(response.data);

        const updatedList = tamagotchis.map((t) =>
          t.id === response.data.id ? response.data : t,
        );
        setTamagotchis(updatedList);
      } catch (error) {
        console.error("Auto-decay error:", error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedTamagotchi, token, tamagotchis]);

  // Render login form
  if (!isLoggedIn) {
    return (
      <Box
        minH="100vh"
        bg="#FFF8E7"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          maxW="md"
          mx="auto"
          w="90%"
          bg="white"
          borderRadius="1.5rem"
          boxShadow="0 8px 20px rgba(92, 75, 58, 0.08)"
          border="1px solid #FDE2D3"
          p={8}
        >
          <VStack spacing={6}>
            <Heading size="xl" textAlign="center" color="#5C4B3A">
              🐣 Tamagotchi Battle
            </Heading>

            <form
              onSubmit={isLoginMode ? handleLogin : handleRegister}
              style={{ width: "100%" }}
            >
              <VStack spacing={4}>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="white"
                  borderColor="#FDE2D3"
                  _focus={{ borderColor: "#D4C5F0", boxShadow: "none" }}
                  required
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="white"
                  borderColor="#FDE2D3"
                  _focus={{ borderColor: "#D4C5F0", boxShadow: "none" }}
                  required
                />

                {authError && (
                  <Alert status="error" borderRadius="lg" bg="#FFAAA5">
                    <AlertIcon />
                    <Text color="#5C4B3A">{authError}</Text>
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  width="100%"
                  isLoading={isLoading}
                >
                  {isLoginMode ? "Login" : "Register"}
                </Button>
              </VStack>
            </form>

            <Button
              variant="ghost"
              onClick={() => setIsLoginMode(!isLoginMode)}
              width="100%"
            >
              {isLoginMode
                ? "Need an account? Register"
                : "Already have an account? Login"}
            </Button>
          </VStack>
        </Box>
      </Box>
    );
  }

  // Render main game
  // Render main game
  return (
    <Box maxW="lg" mx="auto" py={8} px={4}>
      {/* Header */}
      <Box
        bg="white"
        borderRadius="xl"
        p={4}
        mb={6}
        border="1px solid #FDE2D3"
        boxShadow="0 4px 12px rgba(92, 75, 58, 0.06)"
      >
        <HStack justify="space-between">
          <Heading size="lg" color="#5C4B3A">
            🐣 Tamagotchi Battle
          </Heading>
          <Button variant="ghost" onClick={handleLogout} size="sm">
            Logout ({user?.email})
          </Button>
        </HStack>
      </Box>

      {/* Action Buttons Row */}
      <SimpleGrid columns={3} spacing={4} mb={6}>
        <Button
          variant="grass"
          onClick={() => setShowCreateForm(true)}
          leftIcon={<span>➕</span>}
        >
          CREATE
        </Button>
        <Button
          variant="water"
          onClick={() => setShowBattleArena(true)}
          leftIcon={<span>⚔️</span>}
          isDisabled={tamagotchis.length === 0}
        >
          BATTLE
        </Button>
        <Button
          variant="fire"
          onClick={() => setShowDeleteModal(true)}
          leftIcon={<span>🗑️</span>}
          isDisabled={tamagotchis.length === 0}
        >
          DELETE
        </Button>
      </SimpleGrid>

      {/* Create Form Modal */}
      {showCreateForm && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0,0,0,0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1000}
        >
          <Box bg="white" borderRadius="2xl" p={6} maxW="md" w="90%">
            <CreateTamagotchi
              onTamagotchiCreated={handleTamagotchiCreated}
              token={token}
              onClose={() => setShowCreateForm(false)}
            />
            <Button
              variant="ghost"
              onClick={() => setShowCreateForm(false)}
              mt={4}
              w="full"
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      {/* Tamagotchi Selector */}
      {tamagotchis.length > 0 && (
        <Box mb={6}>
          <Text fontWeight="bold" mb={2} color="#5C4B3A">
            Select Tamagotchi:
          </Text>
          <Select
            value={selectedTamagotchi?.id || ""}
            onChange={(e) => {
              const selected = tamagotchis.find(
                (t) => t.id === parseInt(e.target.value),
              );
              setSelectedTamagotchi(selected);
            }}
            bg="white"
            borderColor="#FDE2D3"
            _focus={{ borderColor: "#D4C5F0", boxShadow: "none" }}
          >
            {tamagotchis.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.type}) - Level {t.level}
              </option>
            ))}
          </Select>
        </Box>
      )}

      {/* Main Game Display - Two Columns */}
      {selectedTamagotchi ? (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
          {/* Left Column - Tamagotchi Image */}
          <Box
            bg="white"
            borderRadius="xl"
            p={4}
            border="1px solid #FDE2D3"
            textAlign="center"
          >
            <Tamagotchi
              type={selectedTamagotchi.type}
              name={selectedTamagotchi.name}
            />
          </Box>

          {/* Right Column - Stats + Action Buttons in same box */}
          <Box bg="white" borderRadius="xl" p={4} border="1px solid #FDE2D3">
            {/* Stats */}
            <Stats
              hunger={selectedTamagotchi.hunger}
              happiness={selectedTamagotchi.happiness}
              energy={selectedTamagotchi.energy}
            />

            {/* Level and XP Progress */}
            <Box mt={4}>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm" color="#5C4B3A">
                  ⭐ Level {selectedTamagotchi.level}
                </Text>
                <Text fontSize="sm" color="#5C4B3A">
                  📊 XP: {selectedTamagotchi.xp}/
                  {selectedTamagotchi.level * 100}
                </Text>
              </HStack>
              <Progress
                value={
                  (selectedTamagotchi.xp / (selectedTamagotchi.level * 100)) *
                  100
                }
                bg="#F0E5D8"
                colorScheme="green"
                size="sm"
                borderRadius="full"
              />
            </Box>

            {/* Health Progress */}
            <Box mt={4}>
              <Text fontSize="sm" color="#5C4B3A" mb={1}>
                ❤️ Health: {selectedTamagotchi.health}/100
              </Text>
              <Progress
                value={selectedTamagotchi.health}
                bg="#F0E5D8"
                colorScheme={
                  selectedTamagotchi.health > 70
                    ? "green"
                    : selectedTamagotchi.health > 30
                      ? "yellow"
                      : "red"
                }
                size="sm"
                borderRadius="full"
              />
            </Box>

            {/* Divider line */}
            <Box borderBottom="1px solid #FDE2D3" my={4} />

            {/* Action Buttons (Feed, Play, Rest) - INSIDE THE SAME BOX */}
            <ActionButtons
              onFeed={feedTamagotchi}
              onPlay={playWithTamagotchi}
              onRest={restTamagotchi}
              hunger={selectedTamagotchi.hunger}
              energy={selectedTamagotchi.energy}
            />
          </Box>
        </SimpleGrid>
      ) : (
        <Box
          bg="white"
          borderRadius="xl"
          p={8}
          textAlign="center"
          border="1px solid #FDE2D3"
        >
          <Text color="#8B7A6B">🎨 Create your first Tamagotchi above!</Text>
        </Box>
      )}

      {/* Warning Messages */}
      {selectedTamagotchi && (
        <Box mb={6}>
          <WarningMessages
            hunger={selectedTamagotchi.hunger}
            energy={selectedTamagotchi.energy}
            happiness={selectedTamagotchi.happiness}
            health={selectedTamagotchi.health}
          />
        </Box>
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
    </Box>
  );
}

export default App;
