"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface GameGuideProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const GameGuide: React.FC<GameGuideProps> = ({
  isOpen,
  onClose,
  isMobile,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay-backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: 50000 }}
        >
          <motion.div
            initial={{ scale: 0.3, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.3, opacity: 0, y: 50 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="guideModal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)",
              borderRadius: "20px",
              padding: "32px",
              maxWidth: "90vw",
              maxHeight: "85vh",
              width: "600px",
              overflowY: "auto",
              position: "relative",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              zIndex: 50001,
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              ✕
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              style={{ textAlign: "center", marginBottom: "32px" }}
            >
              <h1
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "700",
                  color: "white",
                  margin: "0",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                }}
              >
                How to Play
              </h1>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "1.1rem",
                  margin: "8px 0 0 0",
                }}
              >
                Topic Solitaire Guide
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              style={{ color: "white", lineHeight: "1.6" }}
            >
              <div style={{ marginBottom: "28px" }}>
                <h2
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    color: "#fbbf24",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Objective
                </h2>
                <p style={{ margin: "0", color: "rgba(255, 255, 255, 0.9)" }}>
                  Complete all topics by collecting their related cards. Each
                  topic needs all of its cards to be completed.
                </p>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <h2
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    color: "#fbbf24",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Card Types
                </h2>
                <div style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                  <div
                    style={{
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: "#fbbf24", fontSize: "1.2rem" }}>
                      👑
                    </span>
                    <span>
                      <strong>Topic Cards:</strong> Golden border cards that
                      define each topic
                    </span>
                  </div>
                  <div
                    style={{
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: "#10b981", fontSize: "1.2rem" }}>
                      📄
                    </span>
                    <span>
                      <strong>Regular Cards:</strong> Cards that belong to
                      specific topics
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <h2
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    color: "#fbbf24",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  How to Play
                </h2>
                <div style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                  <div
                    style={{
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        color: "#fbbf24",
                        fontWeight: "600",
                        minWidth: "20px",
                      }}
                    >
                      1.
                    </span>
                    <div style={{ flex: 1 }}>
                      <span style={{ display: "block", marginBottom: "8px" }}>
                        Drag topic cards to the top row and place regular cards
                        that relate to the topic card
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "8px",
                        }}
                      >
                        <motion.div
                          animate={{ x: [0, 20, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{
                            width: "30px",
                            height: "40px",
                            background: "#FFFDF8",
                            border: "1px solid #ccc",
                            borderRadius: "3px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: isMobile ? "4px" : "8px",
                            color: "#0E8845",
                            fontWeight: "600",
                          }}
                        >
                          Apple
                        </motion.div>
                        <span style={{ color: "#fbbf24" }}>→</span>
                        <div
                          style={{
                            width: "30px",
                            height: "40px",
                            background: "#FFFDF8",
                            border: "2px solid #FFD700",
                            borderRadius: "3px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: isMobile ? "4px" : "8px",
                            color: "#B8860B",
                            fontWeight: "600",
                          }}
                        >
                          Fruits
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        color: "#fbbf24",
                        fontWeight: "600",
                        minWidth: "20px",
                      }}
                    >
                      2.
                    </span>
                    <div style={{ flex: 1 }}>
                      <span style={{ display: "block", marginBottom: "8px" }}>
                        Stack related cards on top of each other and drag all of
                        them together
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          marginTop: "8px",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "30px",
                            height: "45px",
                          }}
                        >
                          <div
                            style={{
                              width: "30px",
                              height: "40px",
                              background: "#FFFDF8",
                              border: "1px solid #ccc",
                              borderRadius: "3px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: isMobile ? "4px" : "8px",
                              color: "#0E8845",
                              fontWeight: "600",
                              position: "absolute",
                              top: "0",
                              left: "0",
                              zIndex: 1,
                            }}
                          ></div>
                          <motion.div
                            animate={{ y: [5, -2, 5] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            style={{
                              width: "30px",
                              height: "40px",
                              background: "#FFFDF8",
                              border: "1px solid #ccc",
                              borderRadius: "3px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: isMobile ? "4px" : "8px",
                              color: "#0E8845",
                              fontWeight: "600",
                              position: "absolute",
                              top: "5px",
                              left: "0",
                              zIndex: 2,
                            }}
                          >
                            Cookie
                          </motion.div>
                        </div>
                        <span style={{ color: "#fbbf24" }}>→</span>
                        <div
                          style={{
                            width: "30px",
                            height: "40px",
                            background: "#FFFDF8",
                            border: "2px solid #FFD700",
                            borderRadius: "3px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: isMobile ? "4px" : "8px",
                            color: "#B8860B",
                            fontWeight: "600",
                          }}
                        >
                          Sweets
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        color: "#fbbf24",
                        fontWeight: "600",
                        minWidth: "20px",
                      }}
                    >
                      3.
                    </span>
                    <div style={{ flex: 1 }}>
                      <span style={{ display: "block", marginBottom: "8px" }}>
                        Draw cards from the deck to get more topic and regular
                        cards when needed
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "8px",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "60px",
                            height: "40px",
                          }}
                        >
                          <div
                            style={{
                              width: "30px",
                              height: "40px",
                              background: "#4a5568",
                              border: "1px solid #2d3748",
                              borderRadius: "3px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              color: "white",
                              position: "absolute",
                              top: "0",
                              left: "0",
                              zIndex: 1,
                            }}
                          >
                            🂠
                          </div>
                          <div
                            style={{
                              width: "30px",
                              height: "40px",
                              background: "#2d3748",
                              border: "1px solid #1a202c",
                              borderRadius: "3px",
                              position: "absolute",
                              top: "-1px",
                              left: "-1px",
                              zIndex: 0,
                            }}
                          />
                          <motion.div
                            animate={{
                              x: [0, 0, 35, 35, 0],
                              y: [0, -2, -2, 0, 0],
                              rotateZ: [0, 5, 5, 0, 0],
                              opacity: [0, 1, 1, 1, 0],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              times: [0, 0.2, 0.6, 0.8, 1],
                            }}
                            style={{
                              width: "30px",
                              height: "40px",
                              background: "#FFFDF8",
                              border: "1px solid #ccc",
                              borderRadius: "3px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#0E8845",
                              fontSize: isMobile ? "4px" : "8px",
                              fontWeight: "600",
                              position: "absolute",
                              top: "0",
                              left: "0",
                              zIndex: 2,
                            }}
                          >
                            Pizza
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        color: "#fbbf24",
                        fontWeight: "600",
                        minWidth: "20px",
                      }}
                    >
                      4.
                    </span>
                    <div style={{ flex: 1 }}>
                      <span style={{ display: "block", marginBottom: "8px" }}>
                        Completed topics disappear when all related cards are
                        collected
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "8px",
                        }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 0], opacity: [1, 1, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{
                            width: "30px",
                            height: "40px",
                            background: "#FFFDF8",
                            border: "2px solid #FFD700",
                            borderRadius: "3px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "7px",
                            color: "#B8860B",
                            fontWeight: "600",
                          }}
                        >
                          Sports
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    color: "#fbbf24",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Tips
                </h2>
                <div style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                  <div
                    style={{
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: "#10b981", minWidth: "16px" }}>
                      •
                    </span>
                    <span>
                      Make sure to pay attention to every card as you have a
                      limited amount of moves
                    </span>
                  </div>
                  <div
                    style={{
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: "#10b981", minWidth: "16px" }}>
                      •
                    </span>
                    <span>
                      Focus on stacking all related cards together as it saves
                      you moves
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.1 }}
              style={{ textAlign: "center", marginTop: "32px" }}
            >
              <motion.button
                whileHover={{ scale: 1.0, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                style={{
                  background:
                    "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                  color: "#1e293b",
                  border: "none",
                  padding: "14px 32px",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
