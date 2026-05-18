function Stats({ hunger, happiness, energy }) {
  // Helper functions INSIDE the component

  function getHungerStatus() {
    if (hunger >= 80) return "🔴 Starving!";
    if (hunger >= 60) return "🟠 Very hungry";
    if (hunger >= 30) return "🟡 A little hungry";
    return "🟢 Full!";
  }

  function getHappinessStatus() {
    if (happiness >= 80) return "🎉 Ecstatic!";
    if (happiness >= 60) return "😊 Happy";
    if (happiness >= 30) return "😐 Okay";
    return "😢 Sad";
  }

  function getEnergyStatus() {
    if (energy >= 80) return "⚡ Rested!";
    if (energy >= 60) return "🔋 Energetic";
    if (energy >= 30) return "😴 Tired";
    return "💤 Exhausted!";
  }

  return (
    <div>
      <p>
        🍽️ Hunger: {hunger} - {getHungerStatus()}
      </p>
      <p>
        😊 Happiness: {happiness} - {getHappinessStatus()}
      </p>
      <p>
        ⚡ Energy: {energy} - {getEnergyStatus()}
      </p>
    </div>
  );
}

export default Stats;
