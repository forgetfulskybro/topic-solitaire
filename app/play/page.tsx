"use client";
import { useMobileDetection } from "@/components/useMobileDetection";
import { getRandomTopic, Difficulty } from "@/components/topicUtils";
import { distributePlaceholderCards } from "@/components/gameUtils";
import { MobileGameLayout } from "@/components/MobileGameLayout";
import { useEffect, useState, Suspense, useMemo } from "react";
import { GameEndScreen } from "@/components/GameEndScreen";
import { mediumTopics } from "@/components/mediumTopics";
import { easyTopics } from "@/components/easyTopics";
import { hardTopics } from "@/components/hardTopics";
import { GameHeader } from "@/components/GameHeader";
import { CardStack } from "@/components/CardStack";
import { useSearchParams } from "next/navigation";
import { CardDeck } from "@/components/CardDeck";
import { motion } from "framer-motion";

function GameContent() {
  const query = useSearchParams();
  const isMobile = useMobileDetection();
  const [numOfTopics, setNumOfTopics] = useState<number>(0);
  const [cards, setCards] = useState<
    { topic: string; cards: string[] | undefined }[]
  >([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [stacks, setStacks] = useState<
    { id: string; cards: string[]; isTopic: boolean }[]
  >([]);
  const flatCards = useMemo(() => cards.flatMap((c) => c.cards || []), [cards]);
  const topicCards = useMemo(
    () => cards.map((c) => c.topic).filter((topic) => topic !== ""),
    [cards]
  );
  const [deckCards, setDeckCards] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [gameStarted, setGameStarted] = useState(false);

  const { placeholderCards, deckCards: initialDeckCards } = useMemo(
    () => distributePlaceholderCards(flatCards, topicCards),
    [flatCards, topicCards]
  );

  useEffect(() => {
    setDeckCards(initialDeckCards);

    const totalCards = flatCards.length + topicCards.length;
    const difficultyMultiplier =
      difficulty === "easy" ? 2.5 : difficulty === "medium" ? 2.2 : 2.0;
    const calculatedMoves = Math.max(
      Math.floor(totalCards * difficultyMultiplier),
      75
    );
    setMoves(calculatedMoves);
  }, [initialDeckCards, flatCards.length, topicCards.length, difficulty]);

  const initialStacks = useMemo(
    () => [
      ...Array.from({ length: 4 }, (_, i) => ({
        id: `topic${i + 1}`,
        cards: [],
        isTopic: true,
      })),
      ...Array.from({ length: 4 }, (_, i) => ({
        id: `stack${i + 1}`,
        cards: [],
        isTopic: false,
      })),
    ],
    []
  );

  useEffect(() => {
    setStacks(initialStacks);
  }, [initialStacks]);

  useEffect(() => {
    if (query.get("difficulty")) {
      const types = ["easy", "medium", "hard"];
      if (!types.find((t) => t === query.get("difficulty"))) {
        setDifficulty("easy");
      } else {
        setDifficulty(query.get("difficulty") as Difficulty);
      }
    }
    const randomTopicCount = Math.floor(Math.random() * 5) + 6;
    setNumOfTopics(randomTopicCount);
  }, [query, difficulty]);

  useEffect(() => {
    const array: { topic: string; cards: string[] | undefined }[] = [];
    const usedTopics = new Set<string>();

    for (let i = 0; i < numOfTopics; i++) {
      let cardsData = getRandomTopic(difficulty);
      let attempts = 0;

      while (cardsData && usedTopics.has(cardsData.topic) && attempts < 50) {
        cardsData = getRandomTopic(difficulty);
        attempts++;
      }

      if (cardsData && !usedTopics.has(cardsData.topic)) {
        usedTopics.add(cardsData.topic);
        array.push(cardsData);
      }
    }
    setCards(array);
  }, [numOfTopics, difficulty]);

  useEffect(() => {
    setStacks((prev) =>
      prev.map((s) => {
        if (s.isTopic) return s;
        const index = parseInt(s.id.slice(-1)) - 1;
        return { ...s, cards: placeholderCards[index] || [] };
      })
    );

    if (placeholderCards.some((stack) => stack.length > 0)) {
      setGameStarted(true);
    }
  }, [placeholderCards]);

  const handleDrawCard = () => {
    setDeckCards((prev) => prev.slice(1));
    setMoves((prev) => prev - 1);
  };

  useEffect(() => {
    if (gameStatus !== "playing") return;
    if (moves === 0 && flatCards.length === 0) return;
    if (moves <= 0) {
      setGameStatus("lost");
      return;
    }

    const topicStacks = stacks.filter((s) => s.isTopic);
    const bottomStacks = stacks.filter((s) => !s.isTopic);

    const checkWinCondition = () => {
      const totalExpectedCards = flatCards.length + topicCards.length;

      if (!gameStarted || totalExpectedCards === 0 || cards.length === 0)
        return;

      const drawnCardsElement = document.querySelector(
        '[data-stack-id="drawn-cards"]'
      );
      const drawnCardsCount =
        drawnCardsElement?.querySelectorAll("[data-card-name]").length || 0;

      const allCardsInTopRow = topicStacks.reduce(
        (total, stack) => total + stack.cards.length,
        0
      );
      const allCardsInBottomRow = bottomStacks.reduce(
        (total, stack) => total + stack.cards.length,
        0
      );

      const noCardsInDeck = deckCards.length === 0;
      const noCardsInField = allCardsInBottomRow === 0;
      const noCardsDrawn = drawnCardsCount === 0;

      const noCardsAnywhere =
        noCardsInDeck &&
        noCardsInField &&
        noCardsDrawn &&
        allCardsInTopRow === 0;

      if (noCardsAnywhere) {
        setGameStatus("won");
      }
    };

    setTimeout(checkWinCondition, 100);
  }, [
    moves,
    stacks,
    deckCards,
    gameStatus,
    flatCards.length,
    topicCards.length,
    cards.length,
    initialDeckCards.length,
    gameStarted,
  ]);

  const handleReturnCards = (cards: string[]) => {
    setDeckCards(cards);
    setMoves((prev) => prev - 1);
  };

  useEffect(() => {
    const handleCardDropped = (event: Event) => {
      const customEvent = event as CustomEvent<{
        card?: string;
        cards?: string[];
        fromStackId: string;
        targetStackId: string;
        isSequence?: boolean;
      }>;
      const { card, cards, fromStackId, targetStackId } = customEvent.detail;

      const cardsToMove = cards || (card ? [card] : []);

      setStacks((prevStacks) => {
        return prevStacks.map((stack) => {
          if (stack.id === fromStackId) {
            return {
              ...stack,
              cards: stack.cards.filter((c) => !cardsToMove.includes(c)),
            };
          }
          if (stack.id === targetStackId) {
            return {
              ...stack,
              cards: [...stack.cards, ...cardsToMove],
            };
          }
          return stack;
        });
      });

      setMoves((prev) => prev - 1);
    };

    const handleTopicCompleted = (event: Event) => {
      const customEvent = event as CustomEvent<{
        stackId: string;
      }>;
      const { stackId } = customEvent.detail;

      setStacks((prevStacks) => {
        return prevStacks.map((stack) => {
          if (stack.id === stackId) {
            return {
              ...stack,
              cards: [],
            };
          }
          return stack;
        });
      });
    };

    document.addEventListener("cardDropped", handleCardDropped);
    document.addEventListener("topicCompleted", handleTopicCompleted);

    return () => {
      document.removeEventListener("cardDropped", handleCardDropped);
      document.removeEventListener("topicCompleted", handleTopicCompleted);
    };
  }, []);

  return (
    <>
      <GameHeader difficulty={difficulty} moves={moves} />

      {gameStatus !== "playing" && (
        <GameEndScreen gameStatus={gameStatus} difficulty={difficulty} />
      )}

      {isMobile ? (
        <motion.main
          initial={{ y: -500 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <MobileGameLayout
            stacks={stacks}
            topicCards={topicCards}
            deckCards={deckCards}
            onDrawCard={handleDrawCard}
            onReturnCards={handleReturnCards}
          />
        </motion.main>
      ) : (
        <motion.main
          className="main"
          initial={{ y: -500 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginLeft: "300px",
            }}
          >
            <div className="grid">
              {["topic1", "topic2", "topic3", "topic4"].map((id) => {
                const stack = stacks.find((s) => s.id === id);
                const cardsList = stack?.cards || [];

                const topicCard = cardsList.find((card) =>
                  topicCards.includes(card)
                );
                const shouldShowLabel = (() => {
                  if (!topicCard) return false;

                  const topicCardIndex = cardsList.findIndex(
                    (card) => card === topicCard
                  );
                  const cardsAfterTopic = cardsList.slice(topicCardIndex + 1);
                  return cardsAfterTopic.some((card) => {
                    const allTopics = [
                      ...easyTopics,
                      ...mediumTopics,
                      ...hardTopics,
                    ];
                    const topicData = allTopics.find(
                      (t) => t.topic === topicCard
                    );
                    return topicData ? topicData.cards.includes(card) : false;
                  });
                })();

                return (
                  <div
                    key={id}
                    style={{
                      position: "relative",
                    }}
                  >
                    {shouldShowLabel && (
                      <div
                        style={{
                          position: "absolute",
                          top: "0px",
                          left: "0px",
                          right: "0px",
                          height: "20px",
                          backgroundColor: "#FFD700",
                          borderTop: "2px solid #ffffff",
                          border: "1px solid #B8860B",
                          borderRadius: "6px 6px 0px 0px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "9px",
                          fontWeight: "bold",
                          color: "#B8860B",
                          marginBottom: "30px",
                          zIndex: 10,
                        }}
                      >
                        {topicCard}
                      </div>
                    )}
                    <CardStack
                      cardsList={cardsList}
                      showText={true}
                      topicCards={topicCards}
                      stackId={id}
                      isTopic={true}
                    />
                  </div>
                );
              })}
            </div>
            <CardDeck
              deckCards={deckCards}
              topicCards={topicCards}
              onDrawCard={handleDrawCard}
              onReturnCards={handleReturnCards}
            />
          </div>

          <div
            className="grid"
            style={{ marginTop: "20px", height: "350px", overflow: "none" }}
          >
            {["stack1", "stack2", "stack3", "stack4"].map((id) => {
              const stack = stacks.find((s) => s.id === id);
              return (
                <CardStack
                  key={id}
                  cardsList={stack?.cards || []}
                  showText={true}
                  topicCards={topicCards}
                  stackId={id}
                  isTopic={false}
                />
              );
            })}
          </div>
        </motion.main>
      )}
    </>
  );
}

export default function Home() {
  return (
    <div className="page">
      <Suspense fallback={<div>Loading game...</div>}>
        <GameContent />
      </Suspense>
    </div>
  );
}
