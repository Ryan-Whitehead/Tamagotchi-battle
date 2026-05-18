function ActionButtons({ onFeed, onPlay, onRest, hunger, energy }) {
  return (
    <div>
      <button onClick={onFeed}>🍕 Feed</button>

      <button
        onClick={onPlay}
        disabled={energy <= 20}
        style={{ opacity: energy <= 20 ? 0.5 : 1 }}
      >
        🎮 Play {energy <= 20 && "(Too tired!)"}
      </button>

      <button
        onClick={onRest}
        disabled={hunger >= 80}
        style={{ opacity: hunger >= 80 ? 0.5 : 1 }}
      >
        😴 Rest {hunger >= 80 && "(Too hungry!)"}
      </button>
    </div>
  );
}
export default ActionButtons;
