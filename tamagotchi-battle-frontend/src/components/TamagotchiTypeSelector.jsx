// src/components/TamagotchiTypeSelector.jsx
// Component for players to choose their Tamagotchi's appearance

// Define the available types and their images
const TAMAGOTCHI_TYPES = [
  {
    id: "Fire",
    name: "🔥 Fire Type",
    image: "/images/tamagotchi/fire-type.png",
    description: "High attack power, gets angry easily",
  },
  {
    id: "Water",
    name: "💧 Water Type",
    image: "/images/tamagotchi/water-type.png",
    description: "Balanced stats, calm nature",
  },
  {
    id: "Grass",
    name: "🌿 Grass Type",
    image: "/images/tamagotchi/grass-type.png",
    description: "High health, loves to eat",
  },
];

function TamagotchiTypeSelector({ selectedType, onSelectType }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: "20px",
      }}
    >
      {TAMAGOTCHI_TYPES.map((type) => (
        <div
          key={type.id}
          onClick={() => onSelectType(type.id)}
          style={{
            cursor: "pointer",
            padding: "15px",
            borderRadius: "12px",
            border:
              selectedType === type.id ? "4px solid #4CAF50" : "2px solid #ddd",
            backgroundColor: selectedType === type.id ? "#e8f5e9" : "white",
            textAlign: "center",
            transition: "all 0.3s ease",
            width: "150px",
          }}
        >
          <img
            src={type.image}
            alt={type.name}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              borderRadius: "10px",
            }}
          />
          <p style={{ margin: "10px 0 5px", fontWeight: "bold" }}>
            {type.name}
          </p>
          <p style={{ fontSize: "12px", margin: 0, color: "#666" }}>
            {type.description}
          </p>

          {selectedType === type.id && (
            <span
              style={{
                display: "inline-block",
                marginTop: "8px",
                color: "#4CAF50",
                fontWeight: "bold",
              }}
            >
              ✓ Selected
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default TamagotchiTypeSelector;
