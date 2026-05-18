// src/components/Tamagotchi.jsx

function Tamagotchi({ type, name }) {
  const getImagePath = () => {
    switch (type) {
      case "Fire":
        return "/images/tamagotchi/fire-type.png";
      case "Water":
        return "/images/tamagotchi/water-type.png";
      case "Grass":
        return "/images/tamagotchi/grass-type.png";
      default:
        return "/images/tamagotchi/fire-type.png";
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <img
        src={getImagePath()}
        alt={`${type} type Tamagotchi`}
        style={{ width: "300px", height: "300px", objectFit: "contain" }}
      />
      <h2>
        {name} ({type} Type)
      </h2>
    </div>
  );
}

export default Tamagotchi;
