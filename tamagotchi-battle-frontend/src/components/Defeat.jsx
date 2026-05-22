import { useEffect } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";

function Defeat({ npcName, tamagotchiName, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

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
          animation: "shake 0.5s ease",
        }}
      >
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>
          💀 😢 💔 😢 💀
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
            <Heading size="2xl" color="#f44336">
              💀 DEFEAT! 💀
            </Heading>

            <Text fontSize="xl" color="#5C4B3A">
              {tamagotchiName} was defeated by {npcName}!
            </Text>

            <Box
              bg="#FFF8E7"
              p={4}
              borderRadius="xl"
              w="100%"
              textAlign="center"
            >
              <Text fontWeight="bold" fontSize="lg" color="#5C4B3A">
                😢 BETTER LUCK NEXT TIME 😢
              </Text>
              <Text color="#5C4B3A" mt={2}>
                Don't give up! Feed, play, and rest to get stronger!
              </Text>
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
              Try Again
            </button>
          </VStack>
        </Box>

        <div style={{ fontSize: "60px", marginTop: "20px" }}>😢 💔 😢</div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default Defeat;
