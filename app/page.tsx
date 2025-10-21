"use client";
import { DifficultyDropdown } from "@/components/DifficultyDropdown";
import { useMobileDetection } from "@/components/useMobileDetection";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const isMobile = useMobileDetection();

  const heroStyle = {
    transform: playing
      ? `translateY(${isMobile ? "600px" : "600px"})`
      : "translateY(0)",
    transition: "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)",
  } as React.CSSProperties;

  const redirect = () => {
    setPlaying(true);
    setTimeout(() => {
      window.location.href = `/play?difficulty=${difficulty}`;
    }, 50);
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      redirect();
    }
  };

  return (
    <div className="page" style={{ overflow: "hidden" }}>
      <main className="main" style={heroStyle}>
        <div
          style={{
            position: "relative",
            marginBottom: "40px",
            height: isMobile ? "80px" : "120px",
            width: isMobile ? "280px" : "400px",
          }}
        >
          {["T", "O", "P", "I", "C"].map((letter, index) => {
            const isTopicCard = letter === "C";
            const totalCards = 5;
            const centerIndex = (totalCards - 1) / 2;
            const angleStep = isMobile ? 8 : 12;
            const rotation = (index - centerIndex) * angleStep;
            const xOffset = (index - centerIndex) * (isMobile ? 35 : 50);
            const yOffset = Math.abs(index - centerIndex) * (isMobile ? 8 : 12);

            return (
              <div
                key={`topic-${letter}`}
                className="card-base"
                style={{
                  width: isMobile ? "50px" : "70px",
                  height: isMobile ? "70px" : "100px",
                  border: isTopicCard ? "2px solid #FFD700" : "1px solid #ccc",
                  borderRadius: isMobile ? "4px" : "8px",
                  fontSize: "25px",
                  color: isTopicCard ? "#B8860B" : "#0E8845",
                  transform: `translate(-50%, -50%) translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg)`,
                  zIndex: index + 1,
                }}
              >
                {letter}
                {isTopicCard && (
                  <div
                    className="crown-icon"
                    style={{
                      top: isMobile ? "-10px" : "0px",
                      right: isMobile ? "3px" : "5px",
                    }}
                  >
                    <Image
                      src="/crownGold.png"
                      alt="Crown"
                      width={isMobile ? 10 : 14}
                      height={isMobile ? 10 : 14}
                      draggable={false}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "relative",
            marginBottom: "40px",
            height: isMobile ? "70px" : "100px",
            width: isMobile ? "320px" : "500px",
          }}
        >
          {["S", "O", "L", "I", "T", "A", "I", "R", "E"].map(
            (letter, index) => {
              const isTopicCard = letter === "L" || letter === "I";
              const totalCards = 9;
              const centerIndex = (totalCards - 1) / 2;
              const angleStep = isMobile ? 6 : 8;
              const rotation = (index - centerIndex) * angleStep;
              const xOffset = (index - centerIndex) * (isMobile ? 28 : 40);
              const yOffset =
                Math.abs(index - centerIndex) * (isMobile ? 5 : 8);

              return (
                <div
                  key={`solitaire-${letter}-${index}`}
                  className="card-base"
                  style={{
                    width: isMobile ? "40px" : "60px",
                    height: isMobile ? "55px" : "80px",
                    border: isTopicCard
                      ? "2px solid #FFD700"
                      : "1px solid #ccc",
                    borderRadius: isMobile ? "3px" : "6px",
                    fontSize: "25px",
                    fontWeight: "500",
                    color: isTopicCard ? "#B8860B" : "#0E8845",
                    transform: `translate(-50%, -50%) translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg)`,
                    zIndex: index + 1,
                    boxShadow: "0 3px 6px rgba(0,0,0,0.12)",
                  }}
                >
                  {letter}
                  {isTopicCard && (
                    <div
                      className="crown-icon"
                      style={{
                        top: isMobile ? "-10px" : "0px",
                        right: isMobile ? "2px" : "3px",
                      }}
                    >
                      <Image
                        src="/crownGold.png"
                        alt="Crown"
                        width={isMobile ? 8 : 10}
                        height={isMobile ? 8 : 10}
                        draggable={false}
                      />
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>

        <div
          className="button"
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer" }}
        >
          <div
            className="flex-row"
            style={{
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <DifficultyDropdown
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              options={["easy", "medium", "hard"]}
            />
            <h2
              style={{ margin: 0 }}
              onClick={() => redirect()}
              onKeyDown={(e) => handleButtonKeyDown(e)}
            >
              Play &rarr;
            </h2>
          </div>
          <p
            onClick={() => redirect()}
            onKeyDown={(e) => handleButtonKeyDown(e)}
          >
            Start a new game of Topic Solitaire.
          </p>
        </div>
      </main>
    </div>
  );
}
