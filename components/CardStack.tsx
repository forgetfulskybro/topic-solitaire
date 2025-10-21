import type {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import { startDrag, endDrag, drag } from "./dragUtils";
import React, { useEffect, useState } from "react";
import { mediumTopics } from "./mediumTopics";
import { easyTopics } from "./easyTopics";
import { hardTopics } from "./hardTopics";
import { motion } from "framer-motion";
import Image from "next/image";

interface CardStackProps {
  cardsList: string[];
  showText: boolean;
  topicCards: string[];
  stackId: string;
  isTopic: boolean;
}

function isTopicCard(card: string): boolean {
  const allTopics = [...easyTopics, ...mediumTopics, ...hardTopics];
  return allTopics.some((t) => t.topic === card);
}

function getCardTopic(card: string): string | null {
  if (isTopicCard(card)) return card;

  const allTopics = [...easyTopics, ...mediumTopics, ...hardTopics];
  for (const topicData of allTopics) {
    if (topicData.cards.includes(card)) {
      return topicData.topic;
    }
  }
  return null;
}

function shouldShowCardFaceUp(cardIndex: number, cardsList: string[]): boolean {
  if (cardIndex === cardsList.length - 1) return true;
  const card = cardsList[cardIndex];
  const cardTopic = getCardTopic(card);
  if (!cardTopic || isTopicCard(card)) return false;
  let consecutiveCount = 1;
  for (let i = cardIndex + 1; i < cardsList.length; i++) {
    const nextCard = cardsList[i];
    const nextCardTopic = getCardTopic(nextCard);

    if (nextCardTopic === cardTopic && !isTopicCard(nextCard)) {
      consecutiveCount++;
    } else {
      break;
    }
  }

  return consecutiveCount > 1;
}

export const CardStack: React.FC<CardStackProps> = ({
  cardsList,
  showText,
  topicCards,
  stackId,
  isTopic,
}) => {
  const [flippingCard, setFlippingCard] = useState<string | null>(null);
  const [previousTopCard, setPreviousTopCard] = useState<string | null>(null);
  const [hiddenDuringFlip, setHiddenDuringFlip] = useState<string | null>(null);
  const [showFlipAnimation, setShowFlipAnimation] = useState<string | null>(
    null
  );
  const [completingTopic, setCompletingTopic] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (cardsList.length === 0 && isCompleted) {
      setIsCompleted(false);
      setCompletingTopic(false);
    }
  }, [cardsList.length, isCompleted]);

  useEffect(() => {
    const currentTopCard =
      cardsList.length > 0 ? cardsList[cardsList.length - 1] : null;

    if (
      previousTopCard &&
      previousTopCard !== currentTopCard &&
      !isTopic &&
      currentTopCard
    ) {
      setHiddenDuringFlip(currentTopCard);
      setFlippingCard(currentTopCard);
      setShowFlipAnimation(currentTopCard);

      setTimeout(() => {
        setHiddenDuringFlip(null);
      }, 350);

      setTimeout(() => {
        setFlippingCard(null);
        setShowFlipAnimation(null);
      }, 650);
    }

    setPreviousTopCard(currentTopCard);
  }, [cardsList, previousTopCard, isTopic]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => drag(e);
    const handleMouseUp = (e: MouseEvent) => endDrag(e);
    const handleTouchMove = (e: TouchEvent) => drag(e);
    const handleTouchEnd = (e: TouchEvent) => endDrag(e);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const totalCards = cardsList.length;
  const cardOffset = isTopic ? 0 : 20;
  const maxCards = 10;
  const fixedHeight = `${(maxCards - 1) * cardOffset + 160}px`;

  const getTopicProgress = () => {
    const topicCards = cardsList.filter((card) => isTopicCard(card));
    if (topicCards.length === 0) return null;

    const topMostTopic = topicCards[topicCards.length - 1];

    const allTopics = [...easyTopics, ...mediumTopics, ...hardTopics];
    const topicData = allTopics.find((t) => t.topic === topMostTopic);
    if (!topicData) return null;

    const relevantCards = cardsList.filter(
      (card) => topicData.cards.includes(card) && !isTopicCard(card)
    );

    const currentCount = relevantCards.length;
    const totalNeeded = topicData.cards.length;

    return { currentCount, totalNeeded };
  };

  const topicProgress = getTopicProgress();

  useEffect(() => {
    if (
      isTopic &&
      topicProgress &&
      topicProgress.currentCount === topicProgress.totalNeeded &&
      topicProgress.totalNeeded > 0 &&
      !isCompleted &&
      !completingTopic
    ) {
      setCompletingTopic(true);

      setTimeout(() => {
        const event = new CustomEvent("topicCompleted", {
          detail: { stackId },
        });
        document.dispatchEvent(event);

        setIsCompleted(true);
        setCompletingTopic(false);
      }, 600);
    }
  }, [
    topicProgress,
    isTopic,
    isCompleted,
    completingTopic,
    stackId,
    cardsList,
  ]);

  if (totalCards === 0) {
    return (
      <div
        className="cardPlaceholder"
        data-stack-id={stackId}
        data-topic={isTopic ? "true" : undefined}
        style={{
          position: "relative",
          height: fixedHeight,
          backgroundColor: "transparent",
          transition: "all 0.2s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: isTopic ? "2px solid #096334" : "2px dashed #ccc",
            backgroundColor: isTopic ? "#096334" : "transparent",
            borderRadius: "8px",
          }}
        >
          {isTopic ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                draggable={false}
                src="/crown.png"
                alt="Crown"
                width={80}
                height={65}
              />
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "10px",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              ></div>
            </div>
          ) : (
            <span style={{ color: "#999", fontSize: "12px" }}>Empty</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="cardPlaceholder"
      data-stack-id={stackId}
      data-topic={isTopic ? "true" : undefined}
      style={{
        backgroundColor: "transparent",
        position: "relative",
        height: fixedHeight,
        transition: "all 0.2s ease",
        overflow: "visible",
      }}
    >
      {!isTopic && (
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "160px",
            border: "2px dashed #ccc",
            borderRadius: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            zIndex: 0,
          }}
        />
      )}
      {topicProgress && isTopic && (
        <div
          style={{
            position: "absolute",
            top: "85%",
            left: "10%",
            zIndex: 100,
            fontSize: "9px",
            color: "#666",
            fontWeight: "bold",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1.5px solid #FFD700",
            padding: "1px 4px",
            borderRadius: "3px",
            lineHeight: "1",
          }}
        >
          {topicProgress.currentCount}/{topicProgress.totalNeeded}
        </div>
      )}

      {cardsList.map((card, cidx) => {
        const isTopCard = cidx === totalCards - 1;
        const isTopicCard = topicCards.includes(card);
        const zIndexValue = cidx + 1;
        const offsetY = cidx * cardOffset;
        const shouldShowFaceUp = shouldShowCardFaceUp(cidx, cardsList);

        return (
          <motion.div
            key={cidx}
            data-drag={`${card}-${stackId}-${cidx}`}
            data-card-name={card}
            data-is-topic={isTopicCard ? "true" : undefined}
            style={{
              position: "absolute",
              top: `${offsetY}px`,
              left: 0,
              width: "100%",
              height: "160px",
              zIndex: zIndexValue,
              backgroundColor: "#FFFDF8",
              border: isTopicCard ? "2px solid #FFD700" : "1px solid #ccc",
              borderRadius: "8px",
              cursor: isTopCard && !isTopic ? "grab" : "default",
              transformStyle: "preserve-3d",
            }}
            initial={
              showFlipAnimation === card
                ? {
                    rotateY: 180,
                    opacity: 1,
                  }
                : {}
            }
            animate={
              completingTopic && isTopic
                ? {
                    rotateY: [0, 180],
                    opacity: [1, 0],
                  }
                : showFlipAnimation === card
                ? {
                    rotateY: [180, 0],
                    opacity: 1,
                  }
                : {}
            }
            transition={{
              duration: completingTopic ? 0.6 : 0.6,
              ease: "easeInOut",
              delay: completingTopic ? cidx * 0.05 : 0,
            }}
            onMouseDown={
              shouldShowFaceUp && !isTopic
                ? (e: ReactMouseEvent<HTMLDivElement>) =>
                    startDrag(e, `${card}-${stackId}-${cidx}`, stackId)
                : undefined
            }
            onTouchStart={
              shouldShowFaceUp && !isTopic
                ? (e: ReactTouchEvent<HTMLDivElement>) =>
                    startDrag(e, `${card}-${stackId}-${cidx}`, stackId)
                : undefined
            }
          >
            {!isTopic && flippingCard === card && (
              <>
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
                  {showText && hiddenDuringFlip !== card && (
                    <div
                      style={{
                        fontSize: "11px",
                        textAlign: "center",
                        width: "100%",
                        padding: "0 4px",
                        boxSizing: "border-box",
                        color: isTopicCard ? "#B8860B" : "#0E8845",
                        fontWeight: isTopicCard ? 600 : 400,
                      }}
                    >
                      {card}
                    </div>
                  )}
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
                  <Image
                    draggable={false}
                    src="/cardBack.png"
                    alt="Card Back"
                    width={96}
                    height={150}
                  />
                </div>
              </>
            )}

            {!isTopic && !shouldShowFaceUp && flippingCard !== card && (
              <Image
                style={{ marginLeft: "5px", marginTop: "4px" }}
                draggable={false}
                src="/cardBack.png"
                alt="Card Back"
                width={100}
                height={150}
              />
            )}

            {!isTopic &&
              shouldShowFaceUp &&
              showText &&
              flippingCard !== card && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "11px",
                    textAlign: "center",
                    width: "100%",
                    padding: "0 4px",
                    boxSizing: "border-box",
                    color: isTopicCard ? "#B8860B" : "#0E8845",
                    fontWeight: isTopicCard ? 600 : 400,
                  }}
                >
                  {card}
                </div>
              )}

            {isTopCard && isTopicCard && (
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "10px",
                  zIndex: 1,
                }}
              >
                <Image
                  src="/crownGold.png"
                  alt="Topic Card Crown"
                  width={16}
                  height={16}
                  draggable={false}
                />
              </div>
            )}
            {isTopic && showText && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "11px",
                  textAlign: "center",
                  width: "100%",
                  padding: "0 4px",
                  boxSizing: "border-box",
                  color: isTopicCard ? "#B8860B" : "#0E8845",
                  fontWeight: isTopicCard ? 600 : 400,
                }}
              >
                {card}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
