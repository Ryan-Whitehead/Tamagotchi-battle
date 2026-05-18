function WarningMessages({ hunger, energy, happiness, health }) {
  return (
    <>
      {/* Warning Messages */}
      {hunger >= 80 && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          ⚠️ Your Tamagotchi is starving! Feed it quickly!
        </p>
      )}

      {energy <= 20 && (
        <p style={{ color: "orange", fontWeight: "bold" }}>
          ⚠️ Your Tamagotchi is exhausted! Let it rest!
        </p>
      )}

      {happiness <= 20 && (
        <p style={{ color: "#aa66ff", fontWeight: "bold" }}>
          😢 Your Tamagotchi is very sad! Play with it!
        </p>
      )}

      {health <= 30 && health > 0 && (
        <p style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}>
          💀 WARNING! Your Tamagotchi is dying! Take care of it! 💀
        </p>
      )}
    </>
  );
}

export default WarningMessages;
