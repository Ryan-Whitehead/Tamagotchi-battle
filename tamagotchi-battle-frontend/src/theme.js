// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    // Soft children's palette
    cream: "#FFF8E7",
    softBrown: "#5C4B3A",
    warmGray: "#8B7A6B",
    butter: "#FFE4A0",
    lavender: "#D4C5F0",
    mint: "#C8E6D9",
    coral: "#FFB5A7",
    sky: "#B5D8FF",
    sage: "#C5E0C5",

    // Status colors
    healthy: "#A8E6CF",
    warning: "#FFD3B6",
    danger: "#FFAAA5",

    // Default Chakra colors kept for compatibility
    brand: {
      50: "#FFF8E7",
      100: "#FEF5E0",
      200: "#FDF0D0",
      300: "#FCE8B8",
      400: "#FBE0A0",
      500: "#FFE4A0",
      600: "#E6C880",
      700: "#CCA860",
      800: "#B38840",
      900: "#996820",
    },
  },
  fonts: {
    heading: "'Quicksand', 'Comic Neue', 'Nunito', sans-serif",
    body: "'Quicksand', 'Nunito', sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "#FFF8E7",
        color: "#5C4B3A",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "2rem",
        fontWeight: "600",
        transition: "all 0.2s ease",
      },
      variants: {
        primary: {
          bg: "#FFE4A0",
          color: "#5C4B3A",
          _hover: {
            bg: "#FFD782",
            transform: "scale(0.98)",
          },
        },
        fire: {
          bg: "#FFB5A7",
          color: "#5C4B3A",
          _hover: {
            bg: "#F4958C",
          },
        },
        water: {
          bg: "#B5D8FF",
          color: "#5C4B3A",
          _hover: {
            bg: "#92C5F0",
          },
        },
        grass: {
          bg: "#C5E0C5",
          color: "#5C4B3A",
          _hover: {
            bg: "#A8CDA8",
          },
        },
        ghost: {
          bg: "transparent",
          color: "#8B7A6B",
          _hover: {
            bg: "#FEF5E0",
          },
        },
      },
      defaultProps: {
        variant: "primary",
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: "white",
          border: "1px solid #FDE2D3",
          borderRadius: "1rem",
          _focus: {
            borderColor: "#D4C5F0",
            boxShadow: "none",
          },
        },
      },
    },
    Progress: {
      baseStyle: {
        track: {
          bg: "#F0E5D8",
          borderRadius: "1rem",
        },
        filledTrack: {
          borderRadius: "1rem",
        },
      },
    },
    Heading: {
      baseStyle: {
        color: "#5C4B3A",
      },
    },
    Text: {
      baseStyle: {
        color: "#8B7A6B",
      },
    },
  },
});

export default theme;
