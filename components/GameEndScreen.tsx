"use client";
import { DifficultyDropdown } from "./DifficultyDropdown";
import { Difficulty } from "./topicUtils";
import { motion } from "framer-motion";

interface GameEndScreenProps {
  gameStatus: "won" | "lost";
  difficulty: Difficulty;
}

export const GameEndScreen: React.FC<GameEndScreenProps> = ({
  gameStatus,
  difficulty,
}) => {
  return (
    <div className="overlay-backdrop">
      <motion.div
        initial={{ scale: 0.3, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="game-end-card"
        style={{
          background:
            gameStatus === "won"
              ? "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)"
              : "linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)",
          boxShadow:
            gameStatus === "won"
              ? "0 20px 60px rgba(79, 70, 229, 0.3), 0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 20px 60px rgba(225, 29, 72, 0.3), 0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background:
              gameStatus === "won"
                ? "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          style={{
            fontSize: "4rem",
            marginBottom: "20px",
            filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
          }}
        >
          {gameStatus === "won" ? "🏆" : "💫"}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            fontSize: "2.8rem",
            marginBottom: "16px",
            fontWeight: "700",
            color: "white",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            letterSpacing: "-0.02em",
          }}
        >
          {gameStatus === "won" ? "Victory!" : "Game Over"}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {gameStatus === "won" ? (
            <>
              {(difficulty === "easy" || difficulty === "medium") && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "rgba(255, 255, 255, 0.1)",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1rem",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontWeight: "500",
                    }}
                  >
                    Next Challenge:
                  </span>
                  <DifficultyDropdown
                    difficulty=""
                    onDifficultyChange={(newDifficulty) =>
                      (window.location.href = `/play?difficulty=${newDifficulty}`)
                    }
                    options={
                      difficulty === "easy" ? ["medium", "hard"] : ["hard"]
                    }
                    placeholder="Choose difficulty"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      color: "#333",
                      border: "none",
                      fontSize: "0.9rem",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      fontWeight: "600",
                    }}
                  />
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  color: "#4f46e5",
                  border: "none",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.2s ease",
                }}
              >
                Play Again
              </motion.button>
            </>
          ) : (
            <>
              {(difficulty === "hard" || difficulty === "medium") && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "rgba(255, 255, 255, 0.1)",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1rem",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontWeight: "500",
                    }}
                  >
                    Try Easier:
                  </span>
                  <DifficultyDropdown
                    difficulty=""
                    onDifficultyChange={(newDifficulty) =>
                      (window.location.href = `/play?difficulty=${newDifficulty}`)
                    }
                    options={
                      difficulty === "hard" ? ["medium", "easy"] : ["easy"]
                    }
                    placeholder="Choose difficulty"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      color: "#333",
                      border: "none",
                      fontSize: "0.9rem",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      fontWeight: "600",
                    }}
                  />
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  color: "#e11d48",
                  border: "none",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.2s ease",
                }}
              >
                Try Again
              </motion.button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
