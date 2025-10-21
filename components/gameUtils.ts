import { easyTopics } from "./easyTopics";
import { mediumTopics } from "./mediumTopics";
import { hardTopics } from "./hardTopics";

export function getRandomNumber(max: number): number {
  return Math.floor(Math.random() * (max - 4 + 1)) + 4;
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateVisibleCounts(): number[] {
  const baseSizes = [2, 3, 4, 5];
  const variations = baseSizes.map((size) => {
    const variation = Math.floor(Math.random() * 2);
    return Math.max(1, size + variation - 1);
  });

  return shuffleArray(variations);
}

export function distributePlaceholderCards(
  allCards: string[],
  topicCards: string[]
): {
  placeholderCards: string[][];
  deckCards: string[];
} {
  const uniqueAllCards = [...new Set(allCards)];
  const uniqueTopicCards = [...new Set(topicCards)];

  const regularCards = uniqueAllCards.filter(
    (card) => !uniqueTopicCards.includes(card)
  );

  const placeholderCards: string[][] = Array.from({ length: 4 }, () => []);
  const hasTopics = uniqueTopicCards.length > 0;

  if (!hasTopics) {
    const shuffledRegularCards = shuffleArray(regularCards);
    const visibleCounts = generateVisibleCounts();
    let cardIndex = 0;

    for (let i = 0; i < 4; i++) {
      for (
        let j = 0;
        j < visibleCounts[i] && cardIndex < shuffledRegularCards.length;
        j++
      ) {
        placeholderCards[i].push(shuffledRegularCards[cardIndex]);
        cardIndex++;
      }
    }

    const deckCards = shuffledRegularCards.slice(cardIndex);
    return { placeholderCards, deckCards };
  }

  return createWinnableSetup(uniqueTopicCards, regularCards);
}

function createWinnableSetup(
  topicCards: string[],
  regularCards: string[]
): {
  placeholderCards: string[][];
  deckCards: string[];
} {
  const placeholderCards: string[][] = Array.from({ length: 4 }, () => []);
  const shuffledTopics = shuffleArray([...topicCards]);
  const shuffledRegulars = shuffleArray([...regularCards]);
  const stackSizes = [2, 3, 3, 4];
  const shouldPlaceTopic = Math.random() < 0.5;
  let topicPlaced = false;

  for (let stackIndex = 0; stackIndex < 4; stackIndex++) {
    const targetSize = stackSizes[stackIndex];

    for (let cardIndex = 0; cardIndex < targetSize; cardIndex++) {
      let cardToPlace: string | undefined;

      if (
        shouldPlaceTopic &&
        !topicPlaced &&
        stackIndex === 3 &&
        cardIndex === targetSize - 1 &&
        shuffledTopics.length > 0
      ) {
        cardToPlace = shuffledTopics.shift()!;
        topicPlaced = true;
      } else if (shuffledRegulars.length > 0) {
        cardToPlace = shuffledRegulars.shift()!;
      }

      if (cardToPlace) {
        placeholderCards[stackIndex].push(cardToPlace);
      }
    }
  }

  const deckCards = shuffleArray([...shuffledTopics, ...shuffledRegulars]);
  return ensureWinnableSetup(placeholderCards, deckCards, topicCards);
}

const topicLookupMap = new Map<string, string>();
let isMapInitialized = false;
function initializeTopicMap(): void {
  if (isMapInitialized) return;

  const allTopics = [...easyTopics, ...mediumTopics, ...hardTopics];
  for (const topicData of allTopics) {
    topicLookupMap.set(topicData.topic, topicData.topic);
    for (const card of topicData.cards) {
      topicLookupMap.set(card, topicData.topic);
    }
  }
  isMapInitialized = true;
}

function getCardTopicFast(card: string): string | null {
  return topicLookupMap.get(card) || null;
}

function separateTopicRelatedCards(stacks: string[][]): void {
  initializeTopicMap();
  const conflicts: Array<{ stackIndex: number; cardIndex: number }> = [];
  for (let stackIndex = 0; stackIndex < stacks.length; stackIndex++) {
    const stack = stacks[stackIndex];
    for (let cardIndex = 0; cardIndex < stack.length - 1; cardIndex++) {
      const currentCard = stack[cardIndex];
      const nextCard = stack[cardIndex + 1];
      const currentTopic = getCardTopicFast(currentCard);
      const nextTopic = getCardTopicFast(nextCard);

      if (
        currentTopic &&
        nextTopic &&
        currentTopic === nextTopic &&
        currentCard !== currentTopic &&
        nextCard !== nextTopic
      ) {
        conflicts.push({ stackIndex, cardIndex: cardIndex + 1 });
      }
    }
  }

  for (let i = conflicts.length - 1; i >= 0; i--) {
    const { stackIndex, cardIndex } = conflicts[i];
    const stack = stacks[stackIndex];
    if (cardIndex >= stack.length) continue;
    const cardToMove = stack.splice(cardIndex, 1)[0];
    const cardTopic = getCardTopicFast(cardToMove);
    let bestStackIndex = -1;
    let minStackSize = Infinity;
    for (let j = 0; j < stacks.length; j++) {
      if (j === stackIndex) continue;

      const targetStack = stacks[j];
      const hasConflict =
        targetStack.length > 0 &&
        getCardTopicFast(targetStack[targetStack.length - 1]) === cardTopic &&
        targetStack[targetStack.length - 1] !== cardTopic;

      if (!hasConflict && targetStack.length < minStackSize) {
        bestStackIndex = j;
        minStackSize = targetStack.length;
      }
    }

    if (bestStackIndex === -1) {
      for (let j = 0; j < stacks.length; j++) {
        if (j !== stackIndex && stacks[j].length < minStackSize) {
          bestStackIndex = j;
          minStackSize = stacks[j].length;
        }
      }
    }

    const finalStackIndex =
      bestStackIndex !== -1 ? bestStackIndex : (stackIndex + 1) % stacks.length;
    stacks[finalStackIndex].push(cardToMove);
  }
}

function ensureWinnableSetup(
  stacks: string[][],
  deck: string[],
  topicCards: string[]
): {
  placeholderCards: string[][];
  deckCards: string[];
} {
  let hasAccessibleCard = false;
  for (const stack of stacks) {
    if (stack.length > 0) {
      hasAccessibleCard = true;
      break;
    }
  }

  if (!hasAccessibleCard && deck.length > 0) {
    stacks[0].push(deck.shift()!);
  }

  let accessibleTopicFound = false;
  for (const stack of stacks) {
    if (stack.length > 0) {
      const topCards = stack.slice(-2);
      if (topCards.some((card) => topicCards.includes(card))) {
        accessibleTopicFound = true;
        break;
      }
    }
  }

  if (!accessibleTopicFound && deck.length > 10) {
    const topicInDeck = deck.findIndex((card) => topicCards.includes(card));
    if (topicInDeck >= 0) {
      const topic = deck.splice(topicInDeck, 1)[0];

      const topicAlreadyInStacks = stacks.some((stack) =>
        stack.some((card) => card === topic)
      );

      if (!topicAlreadyInStacks) {
        let minStack = 0;
        for (let i = 1; i < 4; i++) {
          if (stacks[i].length < stacks[minStack].length) {
            minStack = i;
          }
        }
        stacks[minStack].push(topic);
      } else {
        deck.push(topic);
      }
    }
  }

  separateTopicRelatedCards(stacks);

  const cardsInStacks = new Set<string>();
  for (const stack of stacks) {
    for (const card of stack) {
      if (topicCards.includes(card)) {
        cardsInStacks.add(card);
      }
    }
  }

  const filteredDeck = deck.filter(
    (card) => !topicCards.includes(card) || !cardsInStacks.has(card)
  );

  return {
    placeholderCards: stacks,
    deckCards: filteredDeck,
  };
}
