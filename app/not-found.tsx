"use client";
import { useMobileDetection } from "@/components/useMobileDetection";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const pathname = usePathname();
  const endpoint = pathname || "Page";
  const isMobile = useMobileDetection();

  const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.location.href = "/";
    }
  };

  return (
    <div className="page">
      <main className="main">
        <div
          style={{
            position: "relative",
            marginBottom: "40px",
            height: isMobile ? "80px" : "120px",
            width: isMobile ? "280px" : "400px",
          }}
        >
          {["4", "0", "4"].map((letter, index) => {
            const totalCards = 3;
            const centerIndex = (totalCards - 1) / 2;
            const angleStep = isMobile ? 8 : 12;
            const rotation = (index - centerIndex) * angleStep;
            const xOffset = (index - centerIndex) * (isMobile ? 60 : 80);
            const yOffset = Math.abs(index - centerIndex) * (isMobile ? 8 : 12);

            return (
              <div
                key={`error-${letter}-${index}`}
                className="card-base"
                style={{
                  width: isMobile ? "60px" : "80px",
                  height: isMobile ? "80px" : "110px",
                  border: "2px solid #FF6B6B",
                  borderRadius: isMobile ? "4px" : "8px",
                  fontSize: isMobile ? "28px" : "36px",
                  color: "#D63031",
                  transform: `translate(-50%, -50%) translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg)`,
                  zIndex: index + 1,
                }}
              >
                {letter}
              </div>
            );
          })}
        </div>

        <div className="text-center-container">
          <h2
            style={{
              fontSize: isMobile ? "1.5rem" : "2rem",
              fontWeight: "600",
              color: "var(--foreground)",
              marginBottom: "1rem",
            }}
          >
            <span className="endpoint-highlight">{endpoint}</span> was not found
            as a topic
          </h2>
          <p
            style={{
              fontSize: isMobile ? "0.9rem" : "1rem",
              color: "var(--foreground)",
              lineHeight: "1.5",
            }}
          >
            The topic you&apos;re looking for doesn&apos;t exist in the game.
          </p>
        </div>

        <Link href="/" style={{ textDecoration: "none" }}>
          <div
            className="button"
            role="button"
            tabIndex={0}
            style={{
              cursor: "pointer",
              textAlign: "center",
            }}
            onKeyDown={handleButtonKeyDown}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: "0.5rem",
              }}
            >
              &larr; Go Back
            </h2>
            <p style={{ margin: 0 }}>Return to Topic Solitaire home.</p>
          </div>
        </Link>
      </main>
    </div>
  );
}
