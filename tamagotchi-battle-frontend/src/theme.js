import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    // Background
    bg: {
      primary: "#FFF8E7", // Cream
      secondary: "#FDF4E3", // Lighter cream
    },
    // Cards and surfaces
    surface: {
      primary: "#FFFFFF",
      secondary: "#FEF9F0",
      accent: "#FFF5E6",
    },
    // Text colors
    text: {
      primary: "#5C4B3A", // Soft brown
      secondary: "#8B7A6B", // Warm gray
      light: "#B8A99A", // Light warm gray
    },
    // Accent colors
    accent: {
      yellow: "#FFE4A0",
      lavender: "#D4C5F0",
      mint: "#C8E6D9",
      coral: "#FFB5A7",
      sky: "#B5D8FF",
      sage: "#C5E0C5",
    },
    // Type colors
    fire: {
      50: "#FFF0EC",
      500: "#FFB5A7",
      600: "#F4958C",
    },
    water: {
      50: "#EBF4FF",
      500: "#B5D8FF",
      600: "#92C5F0",
    },
    grass: {
      50: "#EEF5EC",
      500: "#C5E0C5",
      600: "#A8CDA8",
    },
    // Status colors
    healthy: "#A8E6CF",
    warning: "#FFD3B6",
    danger: "#FFAAA5",
  },
  fonts: {
    heading: "'Quicksand', 'Comic Neue', 'Nunito', sans-serif",
    body: "'Quicksand', 'Nunito', sans-serif",
  },
  fontSizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    md: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },
  borderRadius: {
    xl: "1rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "2rem",
        fontWeight: "600",
        transition: "all 0.2s ease",
        _hover: {
          transform: "scale(0.98)",
          filter: "brightness(0.97)",
        },
      },
      variants: {
        primary: {
          bg: "#FFE4A0",
          color: "#5C4B3A",
          _hover: {
            bg: "#FFD782",
          },
        },
        secondary: {
          bg: "#D4C5F0",
          color: "#5C4B3A",
          _hover: {
            bg: "#C5B3E5",
          },
        },
        fire: {
          bg: "#FFB5A7",
          color: "#5C4B3A",
        },
        water: {
          bg: "#B5D8FF",
          color: "#5C4B3A",
        },
        grass: {
          bg: "#C5E0C5",
          color: "#5C4B3A",
        },
      },
    },
    Card: {
      baseStyle: {
        bg: "#FFFFFF",
        borderRadius: "1.5rem",
        boxShadow: "0 8px 20px rgba(92, 75, 58, 0.08)",
        border: "1px solid #FDE2D3",
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
        fontWeight: "600",
      },
    },
    Text: {
      baseStyle: {
        color: "#8B7A6B",
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: "#FEF9F0",
          border: "1px solid #FDE2D3",
          borderRadius: "1rem",
          _focus: {
            borderColor: "#D4C5F0",
            boxShadow: "0 0 0 1px #D4C5F0",
          },
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          bg: "#FEF9F0",
          border: "1px solid #FDE2D3",
          borderRadius: "1rem",
          _focus: {
            borderColor: "#D4C5F0",
            boxShadow: "0 0 0 1px #D4C5F0",
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "#FFF8E7",
        color: "#5C4B3A",
      },
      "::selection": {
        bg: "#FFE4A0",
        color: "#5C4B3A",
      },
    },
  },
});

export default theme;
