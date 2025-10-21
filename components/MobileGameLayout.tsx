import { MobileCardStack } from "@/components/MobileCardStack";
import { MobileCardDeck } from "@/components/MobileCardDeck";
import { easyTopics } from "@/components/easyTopics";
import { mediumTopics } from "@/components/mediumTopics";
import { hardTopics } from "@/components/hardTopics";
import React from "react";

interface MobileGameLayoutProps {
  stacks: { id: string; cards: string[]; isTopic: boolean }[];
  topicCards: string[];
  deckCards: string[];
  onDrawCard: () => void;
  onReturnCards: (cards: string[]) => void;
  onRefreshField?: () => void;
  showRefreshButton?: boolean;
}

export const MobileGameLayout: React.FC<MobileGameLayoutProps> = ({
  stacks,
  topicCards,
  deckCards,
  onDrawCard,
  onReturnCards,
  onRefreshField,
  showRefreshButton = false,
}) => {
  return (
    <div
      className="flex-column flex-center"
      style={{
        gap: "16px",
        padding: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-end",
          padding: "0 10px",
        }}
      >
        <MobileCardDeck
          deckCards={deckCards}
          topicCards={topicCards}
          onDrawCard={onDrawCard}
          onReturnCards={onReturnCards}
          onRefreshField={onRefreshField}
          showRefreshButton={showRefreshButton}
        />
      </div>

      <div
        className="flex-row"
        style={{
          gap: "15px",
          width: "100%",
          justifyContent: "center",
          flexWrap: "nowrap",
          padding: "0 10px",
        }}
      >
        {["topic1", "topic2", "topic3", "topic4"].map((id) => {
          const stack = stacks.find((s) => s.id === id);
          const cardsList = stack?.cards || [];

          const topicCard = cardsList.find((card) => topicCards.includes(card));
          const shouldShowLabel = (() => {
            if (!topicCard) return false;

            const topicCardIndex = cardsList.findIndex(
              (card) => card === topicCard
            );
            const cardsAfterTopic = cardsList.slice(topicCardIndex + 1);
            return cardsAfterTopic.some((card) => {
              const allTopics = [...easyTopics, ...mediumTopics, ...hardTopics];
              const topicData = allTopics.find((t) => t.topic === topicCard);
              return topicData ? topicData.cards.includes(card) : false;
            });
          })();

          return (
            <div key={id} style={{ position: "relative", flexShrink: 0 }}>
              {shouldShowLabel && (
                <div
                  style={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    height: "25px",
                    backgroundColor: "#FFD700",
                    border: "1px solid #B8860B",
                    borderRadius: "6px 6px 0px 0px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "9px",
                    fontWeight: "bold",
                    color: "#B8860B",
                    marginBottom: "30px",
                    zIndex: 10,
                    textAlign: "center",
                  }}
                >
                  {topicCard}
                </div>
              )}
              <MobileCardStack
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

      <div
        className="flex-row"
        style={{
          gap: "15px",
          width: "100%",
          justifyContent: "center",
          flexWrap: "nowrap",
          overflowX: "auto",
          padding: "0 10px",
        }}
      >
        {["stack1", "stack2", "stack3", "stack4"].map((id) => {
          const stack = stacks.find((s) => s.id === id);
          return (
            <MobileCardStack
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
    </div>
  );
};
