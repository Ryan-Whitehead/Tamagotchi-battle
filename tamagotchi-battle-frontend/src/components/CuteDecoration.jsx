// src/components/CuteDecoration.jsx
import { Box, VStack } from "@chakra-ui/react";

function CuteDecoration() {
  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      opacity={0.6}
      pointerEvents="none"
    >
      <VStack spacing={1}>
        <span style={{ fontSize: "32px" }}>⭐</span>
        <span style={{ fontSize: "24px" }}>🌟</span>
        <span style={{ fontSize: "20px" }}>✨</span>
      </VStack>
    </Box>
  );
}

export default CuteDecoration;
