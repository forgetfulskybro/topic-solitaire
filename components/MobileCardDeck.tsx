import type {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import React, { useState, useEffect } from "react";
import { shuffleArray } from "./gameUtils";
import { startDrag } from "./dragUtils";
import Image from "next/image";

interface MobileCardDeckProps {
  deckCards: string[];
  topicCards: string[];
  onDrawCard: () => void;
  onReturnCards: (cards: string[]) => void;
}

export const MobileCardDeck: React.FC<MobileCardDeckProps> = ({
  deckCards,
  topicCards,
  onDrawCard,
  onReturnCards,
}) => {
  const [drawnCards, setDrawnCards] = useState<string[]>([]);
  const [animatingCard, setAnimatingCard] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    const handleCardDropped = (event: Event) => {
      const customEvent = event as CustomEvent<{
        card?: string;
        cards?: string[];
        fromStackId: string;
        targetStackId: string;
        isSequence?: boolean;
      }>;
      const { card, cards, fromStackId } = customEvent.detail;

      if (fromStackId === "drawn-cards") {
        const cardsToRemove = cards || (card ? [card] : []);
        setDrawnCards((prev) => prev.filter((c) => !cardsToRemove.includes(c)));
      }
    };

    document.addEventListener("cardDropped", handleCardDropped);

    return () => {
      document.removeEventListener("cardDropped", handleCardDropped);
    };
  }, []);

  const handleDeckClick = () => {
    if (deckCards.length > 0 && !isFlipping) {
      const cardToDraw = deckCards[0];
      setAnimatingCard(cardToDraw);
      setIsFlipping(true);

      setTimeout(() => {
        setDrawnCards((prev) => [...prev, cardToDraw]);
        onDrawCard();
        setAnimatingCard(null);
        setIsFlipping(false);
      }, 600);
    }
  };

  const handleEmptyDeckClick = () => {
    if (deckCards.length === 0 && drawnCards.length > 0 && !isShuffling) {
      setIsShuffling(true);

      setTimeout(() => {
        const shuffledCards = shuffleArray([...drawnCards]);
        onReturnCards(shuffledCards);
        setDrawnCards([]);
        setIsShuffling(false);
      }, 1000);
    }
  };

  const handleDrawnCardDrag = (
    e: ReactMouseEvent<HTMLDivElement> | ReactTouchEvent<HTMLDivElement>,
    cardId: string
  ) => {
    startDrag(e, cardId, "drawn-cards");
  };

  const getDeckDepthShadow = (cardCount: number) => {
    const normalizedCount = Math.min(cardCount, 20);
    const maxDepth = Math.min(Math.floor(normalizedCount / 4), 4);
    if (maxDepth === 0) return "0 2px 6px rgba(0, 0, 0, 0.15)";
    const shadows = ["0 2px 6px rgba(0, 0, 0, 0.15)"];
    for (let i = 1; i <= maxDepth; i++) {
      const offsetX = i * 1;
      const offsetY = i * 1.2;
      const blur = 4 + i * 1;
      const opacity = Math.max(0.08, 0.2 - i * 0.02);
      shadows.push(
        `${offsetX}px ${offsetY}px ${blur}px rgba(0, 0, 0, ${opacity})`
      );
    }
    return shadows.join(", ");
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "auto",
        justifyContent: "center",
      }}
    >
      {animatingCard && (
        <div
          style={{
            position: "absolute",
            left: "95px",
            top: "0px",
            width: "70px",
            height: "100px",
            backgroundColor: "#FFFDF8",
            border: topicCards.includes(animatingCard)
              ? "2px solid #FFD700"
              : "1px solid #ccc",
            borderRadius: "6px",
            zIndex: 1000,
            transformStyle: "preserve-3d",
            animation: "mobileCardFlip 0.6s ease-in-out forwards",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              draggable={false}
              src="/cardBack.png"
              alt="Card Back"
              width={60}
              height={90}
            />
          </div>
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "9px",
                textAlign: "center",
                width: "100%",
                padding: "0 3px",
                boxSizing: "border-box",
                color: topicCards.includes(animatingCard)
                  ? "#B8860B"
                  : "#0E8845",
                fontWeight: topicCards.includes(animatingCard) ? 600 : 400,
              }}
            >
              {animatingCard}
            </div>
            {topicCards.includes(animatingCard) && (
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  zIndex: 1,
                }}
              >
                <Image
                  src="/crownGold.png"
                  alt="Topic Card Crown"
                  width={10}
                  height={10}
                  draggable={false}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div
        data-stack-id="drawn-cards"
        style={{ position: "relative", width: "70px", height: "100px" }}
      >
        <div
          style={{
            position: "absolute",
            left: "0px",
            top: "0px",
            width: "100%",
            height: "100px",
            border: "2px dashed #ccc",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            zIndex: 0,
          }}
        >
          <span style={{ color: "#999", fontSize: "11px" }}>Drawn</span>
        </div>
        {drawnCards.map((card, index) => {
          const isTopicCard = topicCards.includes(card);
          const isTopDrawnCard = index === drawnCards.length - 1;

          return (
            <div
              key={`drawn-${index}`}
              data-drag={`${card}-drawn-cards-${index}`}
              data-card-name={card}
              style={{
                position: "absolute",
                left: "0px",
                top: "0px",
                width: "100%",
                height: "100px",
                backgroundColor: "#FFFDF8",
                border: isTopicCard ? "2px solid #FFD700" : "1px solid #ccc",
                borderRadius: "6px",
                cursor: isTopDrawnCard ? "grab" : "default",
                zIndex: index + 1,
                userSelect: "none",
              }}
              onMouseDown={
                isTopDrawnCard
                  ? (e: ReactMouseEvent<HTMLDivElement>) =>
                      handleDrawnCardDrag(e, `${card}-drawn-cards-${index}`)
                  : undefined
              }
              onTouchStart={
                isTopDrawnCard
                  ? (e: ReactTouchEvent<HTMLDivElement>) =>
                      handleDrawnCardDrag(e, `${card}-drawn-cards-${index}`)
                  : undefined
              }
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "9px",
                  textAlign: "center",
                  width: "100%",
                  padding: "0 3px",
                  boxSizing: "border-box",
                  color: isTopicCard ? "#B8860B" : "#0E8845",
                  fontWeight: isTopicCard ? 600 : 400,
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  lineHeight: "1.2",
                }}
              >
                {card}
              </div>
              {isTopicCard && (
                <div
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    zIndex: 1,
                  }}
                >
                  <Image
                    src="/crownGold.png"
                    alt="Topic Card Crown"
                    width={12}
                    height={12}
                    draggable={false}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ position: "relative", width: "70px", height: "100px" }}>
        {deckCards.length > 0 ? (
          <div
            className="cardPlaceholder"
            onClick={handleDeckClick}
            style={{
              width: "100%",
              height: "100px",
              backgroundColor: "#FFFDF8",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: getDeckDepthShadow(deckCards.length),
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <Image
              draggable={false}
              src="/cardBack.png"
              alt="Card Back"
              width={60}
              height={90}
            />
          </div>
        ) : (
          <div
            onClick={handleEmptyDeckClick}
            style={{
              width: "100%",
              height: "100px",
              border:
                drawnCards.length > 0 ? "2px solid #4CAF50" : "2px dashed #ccc",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                drawnCards.length > 0
                  ? "rgba(76, 175, 80, 0.1)"
                  : "transparent",
              cursor: drawnCards.length > 0 ? "pointer" : "default",
              transition: "all 0.2s ease",
            }}
          >
            <span
              style={{
                color: drawnCards.length > 0 ? "#4CAF50" : "#999",
                fontSize: "11px",
                fontWeight: drawnCards.length > 0 ? "600" : "400",
                textAlign: "center",
              }}
            >
              {drawnCards.length > 0 ? "Reshuffle" : "Empty"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
