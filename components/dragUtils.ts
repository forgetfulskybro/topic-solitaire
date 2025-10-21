import type {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import { mediumTopics } from "./mediumTopics";
import { easyTopics } from "./easyTopics";
import { hardTopics } from "./hardTopics";

type DragEvent =
  | ReactMouseEvent<HTMLDivElement>
  | ReactTouchEvent<HTMLDivElement>
  | MouseEvent
  | TouchEvent;

let selected: string = "";
let selectedSequence: string[] = [];
let fromStackId: string = "";
let initialMouseX: number = 0;
let initialMouseY: number = 0;
let originalLeft: string = "";
let originalTop: string = "";
let originalZIndex: string = "";
let originalWidth: string = "";
let originalHeight: string = "";
let isDragging: boolean = false;
let lastDragStart: number = 0;
let dragTimeout: NodeJS.Timeout | null = null;
let animationTimeouts: NodeJS.Timeout[] = [];
let animatingElement: HTMLElement | null = null;

function resetDragState(): void {
  selected = "";
  selectedSequence = [];
  fromStackId = "";
  isDragging = false;
  animatingElement = null;
  document.body.style.overflow = "";

  if (dragTimeout) {
    clearTimeout(dragTimeout);
    dragTimeout = null;
  }

  animationTimeouts.forEach((timeout) => clearTimeout(timeout));
  animationTimeouts = [];
}

function cardBelongsToTopic(card: string, topic: string): boolean {
  const allTopics = [...easyTopics, ...mediumTopics, ...hardTopics];
  const topicData = allTopics.find((t) => t.topic === topic);
  return topicData ? topicData.cards.includes(card) : false;
}

function isTopicCard(card: string): boolean {
  const allTopics = [...easyTopics, ...mediumTopics, ...hardTopics];
  return allTopics.some((t) => t.topic === card);
}

function getTopicFromStack(stackElement: Element): string | null {
  const allCards = stackElement.querySelectorAll("[data-card-name]");
  const cardNames = Array.from(allCards)
    .map((card) => card.getAttribute("data-card-name") || "")
    .filter(Boolean);

  const topicCards = cardNames.filter((card) => isTopicCard(card));

  return topicCards.length > 0 ? topicCards[topicCards.length - 1] : null;
}

function getAllCardsInStack(stackElement: Element): string[] {
  const cards = stackElement.querySelectorAll("[data-card-name]");
  return Array.from(cards)
    .map((card) => card.getAttribute("data-card-name") || "")
    .filter(Boolean);
}

function getDraggableSequence(cardId: string, stackElement: Element): string[] {
  const selectedCardName = cardId.split("-")[0];
  const selectedCardTopic = getCardTopic(selectedCardName);
  if (!selectedCardTopic || isTopicCard(selectedCardName)) {
    return [cardId];
  }

  const allCardElements = stackElement.querySelectorAll("[data-card-name]");
  const cardElements = Array.from(allCardElements);
  const clickedElement = stackElement.querySelector(`[data-drag="${cardId}"]`);
  if (!clickedElement) return [cardId];
  const clickedIndex = cardElements.indexOf(clickedElement);
  if (clickedIndex === -1) return [cardId];
  const sequence = [cardId];

  for (let i = clickedIndex + 1; i < cardElements.length; i++) {
    const element = cardElements[i];
    const elementCardName = element.getAttribute("data-card-name") || "";
    const elementTopic = getCardTopic(elementCardName);

    if (elementTopic === selectedCardTopic && !isTopicCard(elementCardName)) {
      const elementCardId = element.getAttribute("data-drag") || "";
      sequence.push(elementCardId);
    } else {
      break;
    }
  }

  return sequence;
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

function isTopicComplete(topic: string, stackCards: string[]): boolean {
  const allTopics = [...easyTopics, ...mediumTopics, ...hardTopics];
  const topicData = allTopics.find((t) => t.topic === topic);

  if (!topicData) return false;

  const topicCardsInStack = stackCards.filter(
    (card) => topicData.cards.includes(card) || card === topic
  );

  return topicCardsInStack.length === topicData.cards.length + 1;
}

function getClientX(e: DragEvent): number {
  if ("touches" in e) {
    if (e.touches.length > 0) {
      return e.touches[0].clientX;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      return e.changedTouches[0].clientX;
    }
  }
  return "clientX" in e ? (e as MouseEvent | ReactMouseEvent).clientX : 0;
}

function getClientY(e: DragEvent): number {
  if ("touches" in e) {
    if (e.touches.length > 0) {
      return e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      return e.changedTouches[0].clientY;
    }
  }
  return "clientY" in e ? (e as MouseEvent | ReactMouseEvent).clientY : 0;
}

function animateSnapBackToDrawnCards(element: HTMLElement): void {
  if (animatingElement === element) {
    return;
  }

  animationTimeouts.forEach((timeout) => clearTimeout(timeout));
  animationTimeouts = [];

  animatingElement = element;

  const drawnCardsArea = document.querySelector(
    '[data-stack-id="drawn-cards"]'
  ) as HTMLElement;
  if (!drawnCardsArea) {
    element.style.position = "absolute";
    element.style.left = originalLeft;
    element.style.top = originalTop;
    element.style.zIndex = originalZIndex;
    element.style.width = originalWidth;
    element.style.height = originalHeight;
    animatingElement = null;
    return;
  }

  const drawnCardsRect = drawnCardsArea.getBoundingClientRect();
  const targetFixedLeft = drawnCardsRect.left;
  const targetFixedTop = drawnCardsRect.top;

  element.style.zIndex = "10000";
  element.style.transition = "transform 0.08s ease-in-out";

  const timeout1 = setTimeout(() => {
    element.style.transform = "rotate(0deg) scale(1)";
    element.style.transition =
      "left 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55), top 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)";

    element.style.left = `${targetFixedLeft}px`;
    element.style.top = `${targetFixedTop}px`;
  }, 80);

  animationTimeouts.push(timeout1);

  const timeout2 = setTimeout(() => {
    element.style.transition = "";
    element.style.transform = "";
    element.style.position = "absolute";
    element.style.left = "0px";
    element.style.top = "0px";
    element.style.width = originalWidth;
    element.style.height = originalHeight;
    element.style.zIndex = originalZIndex;
    element.style.pointerEvents = "";
    resetDragState();
  }, 330);

  animationTimeouts.push(timeout2);
}

function animateSnapBackSequence(): void {
  if (selectedSequence.length === 0) return;

  animationTimeouts.forEach((timeout) => clearTimeout(timeout));
  animationTimeouts = [];

  if (selectedSequence.length === 1) {
    const card = selectedSequence[0];
    const element = document.querySelector(
      `[data-drag="${card}"]`
    ) as HTMLElement;
    if (!element) {
      resetDragState();
      return;
    }

    const cardStack = element.closest(".cardPlaceholder") as HTMLElement;
    if (!cardStack) {
      resetDragState();
      return;
    }

    const targetLeft = element.getAttribute("data-original-left") || "0";
    const targetTop = element.getAttribute("data-original-top") || "0";
    const targetWidth = element.getAttribute("data-original-width") || "";
    const targetHeight = element.getAttribute("data-original-height") || "";
    const targetZIndex = element.getAttribute("data-original-zindex") || "0";

    const stackRect = cardStack.getBoundingClientRect();
    const targetLeftNum = parseFloat(targetLeft) || 0;
    const targetTopNum = parseFloat(targetTop) || 0;
    const targetFixedLeft = stackRect.left + targetLeftNum;
    const targetFixedTop = stackRect.top + targetTopNum;

    element.style.zIndex = "9000";
    element.style.transition = "transform 0.08s ease-in-out";

    const timeout1 = setTimeout(() => {
      element.style.transform = "rotate(0deg) scale(1)";
      element.style.transition =
        "left 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55), top 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)";

      element.style.left = `${targetFixedLeft}px`;
      element.style.top = `${targetFixedTop}px`;
    }, 80);

    animationTimeouts.push(timeout1);

    const timeout2 = setTimeout(() => {
      element.style.transition = "";
      element.style.transform = "";
      element.style.pointerEvents = "";
      element.style.position = "absolute";
      element.style.left = targetLeft;
      element.style.top = targetTop;
      element.style.width = targetWidth;
      element.style.height = targetHeight;
      element.style.zIndex = targetZIndex;

      element.removeAttribute("data-original-left");
      element.removeAttribute("data-original-top");
      element.removeAttribute("data-original-zindex");
      element.removeAttribute("data-original-width");
      element.removeAttribute("data-original-height");
      element.removeAttribute("data-original-position");
      element.removeAttribute("data-original-transform");
      element.removeAttribute("data-initial-screen-left");
      element.removeAttribute("data-initial-screen-top");

      resetDragState();
    }, 330);

    animationTimeouts.push(timeout2);
  } else {
    selectedSequence.forEach((card) => {
      const element = document.querySelector(
        `[data-drag="${card}"]`
      ) as HTMLElement;
      if (!element) return;

      element.style.transition = "";
      element.style.transform = "";
      element.style.pointerEvents = "";
      element.style.position = "absolute";
      element.style.left = element.getAttribute("data-original-left") || "0";
      element.style.top = element.getAttribute("data-original-top") || "0";
      element.style.width = element.getAttribute("data-original-width") || "";
      element.style.height = element.getAttribute("data-original-height") || "";
      element.style.zIndex =
        element.getAttribute("data-original-zindex") || "0";

      element.removeAttribute("data-original-left");
      element.removeAttribute("data-original-top");
      element.removeAttribute("data-original-zindex");
      element.removeAttribute("data-original-width");
      element.removeAttribute("data-original-height");
      element.removeAttribute("data-original-position");
      element.removeAttribute("data-original-transform");
      element.removeAttribute("data-initial-screen-left");
      element.removeAttribute("data-initial-screen-top");
    });

    resetDragState();
  }
}

export function startDrag(e: DragEvent, cardId: string, stackId: string): void {
  e.preventDefault();
  e.stopPropagation();

  const now = Date.now();
  if (isDragging || selected !== "" || now - lastDragStart < 300) {
    return;
  }

  isDragging = true;
  lastDragStart = now;

  dragTimeout = setTimeout(() => {
    resetDragState();
  }, 60000);

  if ("touches" in e) {
    document.body.style.overflow = "hidden";
  }

  selected = cardId;
  fromStackId = stackId;

  const sourceStack = document.querySelector(`[data-stack-id="${stackId}"]`);
  if (sourceStack) {
    selectedSequence = getDraggableSequence(cardId, sourceStack);
  } else {
    selectedSequence = [cardId];
  }

  const clientX = getClientX(e);
  const clientY = getClientY(e);

  selectedSequence.forEach((card, index) => {
    const element = document.querySelector(
      `[data-drag="${card}"]`
    ) as HTMLElement;
    if (!element) return;

    const rect = element.getBoundingClientRect();

    element.setAttribute("data-original-left", element.style.left || "0");
    element.setAttribute("data-original-top", element.style.top || "0");
    element.setAttribute("data-original-zindex", element.style.zIndex || "0");
    element.setAttribute("data-original-width", element.style.width || "");
    element.setAttribute("data-original-height", element.style.height || "");
    element.setAttribute(
      "data-original-position",
      element.style.position || ""
    );
    element.setAttribute(
      "data-original-transform",
      element.style.transform || ""
    );

    element.setAttribute("data-initial-screen-left", rect.left.toString());
    element.setAttribute("data-initial-screen-top", rect.top.toString());

    if (card === selected) {
      originalLeft = element.style.left;
      originalTop = element.style.top;
      originalZIndex = element.style.zIndex;
      originalWidth = element.style.width;
      originalHeight = element.style.height;
      initialMouseX = clientX;
      initialMouseY = clientY;
    }

    element.style.position = "fixed";
    element.style.width = `${rect.width}px`;
    element.style.height = `${rect.height}px`;
    element.style.left = `${rect.left}px`;
    element.style.top = `${rect.top}px`;
    element.style.zIndex = `${9999 + index}`;
    element.style.pointerEvents = "none";

    element.style.transform = "rotate(1deg) scale(1.02)";
    element.style.transition = "transform 0.1s ease";
  });
}

export function endDrag(e: DragEvent): void {
  document.body.style.overflow = "";

  if (selected !== "") {
    isDragging = false;
    const clientX = getClientX(e);
    const clientY = getClientY(e);
    const element = document.querySelector(
      `[data-drag="${selected}"]`
    ) as HTMLElement;
    if (!element) {
      resetDragState();
      return;
    }

    const wasVisible = element.style.display !== "none";
    element.style.display = "none";

    let targetStackId: string | null = null;
    const dropTarget = document.elementFromPoint(clientX, clientY);

    if (dropTarget) {
      const placeholder = (dropTarget as Element).closest(".cardPlaceholder");
      if (placeholder) {
        targetStackId = (placeholder as Element).getAttribute("data-stack-id");
      }
    }

    if (!targetStackId) {
      const allPlaceholders = document.querySelectorAll(".cardPlaceholder");
      for (const placeholder of allPlaceholders) {
        const rect = placeholder.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          targetStackId = placeholder.getAttribute("data-stack-id");
          break;
        }
      }
    }

    if (wasVisible) {
      element.style.display = "";
    }

    element.style.pointerEvents = "";

    if (targetStackId && targetStackId !== fromStackId) {
      const targetStack = document.querySelector(
        `[data-stack-id="${targetStackId}"]`
      );
      const isTargetTopicStack =
        targetStack?.getAttribute("data-topic") === "true";

      const selectedCardName = selected.split("-")[0];
      const isCardTopic = isTopicCard(selectedCardName);

      let canDrop = false;

      if (isTargetTopicStack) {
        if (selectedSequence.length === 1 && isCardTopic) {
          const existingTopic = getTopicFromStack(targetStack!);
          if (existingTopic) {
            const stackCards = getAllCardsInStack(targetStack!);
            canDrop = isTopicComplete(existingTopic, stackCards);
          } else {
            canDrop = true;
          }
        } else {
          const existingTopic = getTopicFromStack(targetStack!);
          if (existingTopic) {
            canDrop = selectedSequence.every((cardId) => {
              const cardName = cardId.split("-")[0];
              return (
                cardBelongsToTopic(cardName, existingTopic) ||
                cardName === existingTopic
              );
            });
          } else {
            canDrop = false;
          }
        }
      } else {
        const targetStackCards = getAllCardsInStack(targetStack!);

        if (targetStackCards.length > 0) {
          const topCard = targetStackCards[targetStackCards.length - 1];
          const topCardTopic = getCardTopic(topCard);
          const draggedCardTopic = getCardTopic(selectedCardName);
          const isTopCardTopic = isTopicCard(topCard);
          const isDraggedCardTopic = isTopicCard(selectedCardName);
          const sequenceIsValid = selectedSequence.every((cardId) => {
            const cardName = cardId.split("-")[0];
            const cardTopic = getCardTopic(cardName);
            return cardTopic === draggedCardTopic && !isTopicCard(cardName);
          });

          canDrop =
            topCardTopic !== null &&
            draggedCardTopic !== null &&
            topCardTopic === draggedCardTopic &&
            !isTopCardTopic &&
            !isDraggedCardTopic &&
            sequenceIsValid;
        } else {
          const sequenceIsValid = selectedSequence.every(
            (cardId) => !isTopicCard(cardId.split("-")[0])
          );
          canDrop = sequenceIsValid;
        }
      }

      if (canDrop) {
        const cardNames = selectedSequence.map(
          (cardId) => cardId.split("-")[0]
        );
        const event = new CustomEvent("cardDropped", {
          detail: {
            cards: cardNames,
            fromStackId,
            targetStackId,
            isSequence: cardNames.length > 1,
          },
        });
        document.dispatchEvent(event);

        selectedSequence.forEach((card) => {
          const cardElement = document.querySelector(
            `[data-drag="${card}"]`
          ) as HTMLElement;
          if (cardElement) {
            cardElement.style.pointerEvents = "";
            cardElement.style.transform = "";
            cardElement.style.transition = "";
            cardElement.removeAttribute("data-original-left");
            cardElement.removeAttribute("data-original-top");
            cardElement.removeAttribute("data-original-zindex");
            cardElement.removeAttribute("data-original-width");
            cardElement.removeAttribute("data-original-height");
            cardElement.removeAttribute("data-original-position");
            cardElement.removeAttribute("data-original-transform");
            cardElement.removeAttribute("data-initial-screen-left");
            cardElement.removeAttribute("data-initial-screen-top");
          }
        });

        resetDragState();
      } else {
        selectedSequence.forEach((card) => {
          const cardElement = document.querySelector(
            `[data-drag="${card}"]`
          ) as HTMLElement;
          if (cardElement) {
            cardElement.style.pointerEvents = "none";
          }
        });

        if (fromStackId === "drawn-cards") {
          animateSnapBackToDrawnCards(element);
        } else {
          animateSnapBackSequence();
        }
      }
    } else {
      selectedSequence.forEach((card) => {
        const cardElement = document.querySelector(
          `[data-drag="${card}"]`
        ) as HTMLElement;
        if (cardElement) {
          cardElement.style.pointerEvents = "none";
        }
      });

      if (fromStackId === "drawn-cards") {
        animateSnapBackToDrawnCards(element);
      } else {
        animateSnapBackSequence();
      }
    }
  } else {
    isDragging = false;
  }
}

export function drag(e: DragEvent): void {
  e.preventDefault();
  e.stopPropagation();

  if (selected !== "" && selectedSequence.length > 0 && isDragging) {
    const currentX = getClientX(e);
    const currentY = getClientY(e);

    const deltaX = currentX - initialMouseX;
    const deltaY = currentY - initialMouseY;

    const cardWidth = 70;
    const cardHeight = 100;

    if (
      Math.abs(deltaX) > window.innerWidth ||
      Math.abs(deltaY) > window.innerHeight
    ) {
      return;
    }

    selectedSequence.forEach((card) => {
      const element = document.querySelector(
        `[data-drag="${card}"]`
      ) as HTMLElement;
      if (element) {
        const initialLeft = parseFloat(
          element.getAttribute("data-initial-screen-left") || "0"
        );
        const initialTop = parseFloat(
          element.getAttribute("data-initial-screen-top") || "0"
        );

        const rawLeft = initialLeft + deltaX;
        const rawTop = initialTop + deltaY;
        const newLeft = Math.max(
          0,
          Math.min(window.innerWidth - cardWidth, rawLeft)
        );
        const newTop = Math.max(
          0,
          Math.min(window.innerHeight - cardHeight, rawTop)
        );

        element.style.left = `${newLeft}px`;
        element.style.top = `${newTop}px`;
      }
    });
  }
}
