import { useMobileDetection } from "./useMobileDetection";
import Chevron from "@/public/chevron.svg";
import Restart from "@/public/restart.svg";
import { Difficulty } from "./topicUtils";
import { GameGuide } from "./GameGuide";
import React, { useState } from "react";
import Guide from "@/public/guide.svg";
import Image from "next/image";

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
        <div
          style={{
            color: "white",
            fontSize: isMobile ? "0.8em" : "1em",
            fontWeight: 600,
            whiteSpace: "nowrap",
            marginBottom: isMobile ? "6px" : "8px",
            textAlign: isMobile ? "center" : "left",
            width: "100%",
          }}
        >
          {!isMobile &&
            `Difficulty: ${
              difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
            }`}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            gap: isMobile ? "4px" : "6px",
            marginLeft: isMobile ? "-7px" : "0p",
            width: "100%",
          }}
        >
          <button
            onClick={handleGuide}
            className="game-button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isMobile ? "center" : "flex-start",
              gap: "4px",
              minWidth: isMobile ? "auto" : "80px",
            }}
          >
            <Image src={Guide} alt="Chevron" width={26} height={16} />
            {!isMobile && <span>Guide</span>}
          </button>
          <button
            onClick={handleRestart}
            className="game-button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isMobile ? "center" : "flex-start",
              gap: "4px",
              minWidth: isMobile ? "auto" : "80px",
            }}
          >
            <Image src={Restart} alt="Chevron" width={26} height={16} />
            {!isMobile && <span>Restart</span>}
          </button>
          <button
            onClick={handleBack}
            className="game-button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isMobile ? "center" : "flex-start",
              gap: "4px",
              minWidth: isMobile ? "auto" : "80px",
            }}
          >
            <Image
              style={{ rotate: "180deg" }}
              src={Chevron}
              alt="Chevron"
              width={26}
              height={16}
            />
            {!isMobile && <span>Back</span>}
          </button>
        </div>
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
