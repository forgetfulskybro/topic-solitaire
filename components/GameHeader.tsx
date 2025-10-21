import { useMobileDetection } from "./useMobileDetection";
import { Difficulty } from "./topicUtils";
import { GameGuide } from "./GameGuide";
import React, { useState } from "react";

interface GameHeaderProps {
  difficulty: Difficulty;
  moves: number;
}

const handleBack = () => {
  window.location.href = "/";
};

const handleRestart = () => {
  window.location.reload();
};

export const GameHeader: React.FC<GameHeaderProps> = ({
  difficulty,
  moves,
}) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMobileDetection();

  const handleGuide = () => {
    setOpen(!open);
  };
  return (
    <>
      <GameGuide
        isOpen={open}
        onClose={() => setOpen(false)}
        isMobile={isMobile}
      />
      <div className="fixed-header">
        <span
          style={{
            color: "white",
            fontSize: isMobile ? "0.8em" : "1em",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {isMobile
            ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
            : `Difficulty: ${
                difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
              }`}
        </span>
        <button onClick={handleGuide} className="game-button">
          {isMobile ? "📖" : "📖 Guide"}
        </button>
        <button onClick={handleRestart} className="game-button">
          {isMobile ? "↻" : "↻ Restart"}
        </button>
        <button onClick={handleBack} className="game-button">
          {isMobile ? "←" : "← Back"}
        </button>
      </div>

      <div className="moves-banner">
        <div
          className="flex-center flex-column"
          style={{ textAlign: "center" }}
        >
          <div
            style={{
              color: "#05813B",
              fontSize: isMobile ? "12px" : "20px",
              fontWeight: "bold",
              lineHeight: "1",
            }}
          >
            Moves
          </div>
          <div
            style={{
              color: "#006622",
              fontSize: isMobile ? "20px" : "32px",
              fontWeight: "bold",
              lineHeight: "1",
            }}
          >
            {moves}
          </div>
        </div>
      </div>
    </>
  );
};
