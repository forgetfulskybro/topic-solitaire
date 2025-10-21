import { getRandomMediumTopic, mediumTopics } from "./mediumTopics";
import { getRandomEasyTopic, easyTopics } from "./easyTopics";
import { getRandomHardTopic, hardTopics } from "./hardTopics";

export type Difficulty = "easy" | "medium" | "hard";

export function getRandomTopic(difficulty: Difficulty) {
  if (difficulty === "easy") return getRandomEasyTopic();
  else if (difficulty === "medium") return getRandomMediumTopic();
  else if (difficulty === "hard") return getRandomHardTopic();
}

export function getTopicsByDifficulty(difficulty: Difficulty) {
  switch (difficulty) {
    case "easy":
      return easyTopics;
    case "medium":
      return mediumTopics;
    case "hard":
      return hardTopics;
    default:
      return easyTopics;
  }
}
