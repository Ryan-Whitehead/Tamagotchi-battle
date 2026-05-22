import { useEffect } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";

function Celebration({ rewards, tamagotchiName, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        animation: "fadeIn 0.5s ease",
      }}
    >
      <div
        style={{
          textAlign: "center",
          animation: "bounce 0.8s ease",
        }}
      >
        {/* Confetti effect - simple emoji version */}
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>
          🎉 🎊 🏆 🎊 🎉
        </div>

        <Box
          bg="white"
          borderRadius="2rem"
          p={8}
          maxW="500px"
          w="90%"
          mx="auto"
          boxShadow="0 20px 40px rgba(0,0,0,0.3)"
        >
          <VStack spacing={4}>
            <Heading size="2xl" color="#4CAF50">
              🎉 VICTORY! 🎉
            </Heading>

            <Text fontSize="xl" color="#5C4B3A">
              {tamagotchiName} defeated the opponent!
            </Text>

            <Box
              bg="#FFF8E7"
              p={4}
              borderRadius="xl"
              w="100%"
              textAlign="center"
            >
              <Text fontWeight="bold" fontSize="lg" color="#5C4B3A">
                ✨ REWARDS ✨
              </Text>
              <Text color="#5C4B3A">⭐ XP Gained: +{rewards?.xpGained}</Text>
              <Text color="#5C4B3A">
                😊 Happiness: +{rewards?.happinessChange}
              </Text>
              {rewards?.leveledUp && (
                <Text color="#FF9800" fontWeight="bold" fontSize="lg">
                  ⭐ LEVEL UP! Now Level {rewards.newLevel}! ⭐
                </Text>
              )}
            </Box>

            <button
              onClick={onClose}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "2rem",
                padding: "12px 24px",
                fontSize: "16px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Continue Battle
            </button>
          </VStack>
        </Box>

        <div style={{ fontSize: "60px", marginTop: "20px" }}>✨ 🌟 ✨</div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounce {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
export default Celebration;
