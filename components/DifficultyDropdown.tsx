"use client";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Chevron from "@/public/chevron.svg";
import Image from "next/image";

interface DifficultyDropdownProps {
  difficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  options: string[];
  placeholder?: string;
  style?: React.CSSProperties;
}

export const DifficultyDropdown: React.FC<DifficultyDropdownProps> = ({
  difficulty,
  onDifficultyChange,
  options,
  placeholder = "Select difficulty",
  style = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (opt: string) => {
    onDifficultyChange(opt);
    setIsOpen(false);
  };

  const dropdownVariants: Variants = {
    hidden: { opacity: 0, scaleY: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scaleY: 1,
      y: 0,
      transition: { duration: 0.15, ease: "easeOut" },
    },
    exit: { opacity: 0, scaleY: 0.8, y: 10, transition: { duration: 0.1 } },
  };

  const optionVariants: Variants = {
    hidden: { opacity: 0, y: 5 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.1 },
    }),
  };

  const defaultStyle = {
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
    position: "relative" as const,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "white",
    fontFamily: "inherit",
    fontSize: "inherit",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    minWidth: "140px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
    transition: "all 0.2s ease",
    fontWeight: "500",
    ...style,
  };

  return (
    <div
      ref={dropdownRef}
      style={defaultStyle}
      onClick={() => setIsOpen(!isOpen)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 6px 20px rgba(0, 0, 0, 0.2)";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 16px rgba(0, 0, 0, 0.1)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      <span
        style={{
          fontWeight: 600,
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
        }}
      >
        {difficulty
          ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
          : placeholder}
      </span>
      <motion.span
        style={{
          fontSize: "0.7em",
          marginLeft: "8px",
          opacity: 0.8,
          filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))",
        }}
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Image
          style={{ marginTop: "5px" }}
          src={Chevron}
          alt="Chevron"
          width={26}
          height={16}
        />
      </motion.span>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              borderRadius: "12px",
              zIndex: 10,
              marginTop: "8px",
              overflow: "hidden",
              backdropFilter: "blur(15px)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            }}
          >
            {options.map((opt, index) => (
              <motion.div
                key={opt}
                variants={optionVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                onClick={() => handleOptionClick(opt)}
                onMouseEnter={() => setHoveredOption(opt)}
                onMouseLeave={() => setHoveredOption(null)}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderBottom:
                    index === options.length - 1
                      ? "none"
                      : "1px solid rgba(0, 0, 0, 0.1)",
                  backgroundColor:
                    hoveredOption === opt
                      ? "rgba(0, 0, 0, 0.1)"
                      : "transparent",
                  color: "#1f2937",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  textShadow: "none",
                }}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
