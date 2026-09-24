export interface WordEntry {
  word: string;
  category: string;
}

export const WORD_BANK: WordEntry[] = [
  // Food & Drinks
  { word: "Pizza", category: "Food & Drinks" },
  { word: "Sushi", category: "Food & Drinks" },
  { word: "Pancake", category: "Food & Drinks" },
  { word: "Coffee", category: "Food & Drinks" },
  { word: "Chocolate", category: "Food & Drinks" },
  { word: "Burger", category: "Food & Drinks" },
  { word: "Popcorn", category: "Food & Drinks" },
  { word: "Spaghetti", category: "Food & Drinks" },
  { word: "Lemon", category: "Food & Drinks" },
  { word: "Pineapple", category: "Food & Drinks" },

  // Animals & Nature
  { word: "Penguin", category: "Animals & Nature" },
  { word: "Elephant", category: "Animals & Nature" },
  { word: "Volcano", category: "Animals & Nature" },
  { word: "Octopus", category: "Animals & Nature" },
  { word: "Kangaroo", category: "Animals & Nature" },
  { word: "Waterfall", category: "Animals & Nature" },
  { word: "Dolphin", category: "Animals & Nature" },
  { word: "Tornado", category: "Animals & Nature" },
  { word: "Cactus", category: "Animals & Nature" },
  { word: "Flamingo", category: "Animals & Nature" },

  // Objects & Inventions
  { word: "Guitar", category: "Objects & Inventions" },
  { word: "Telescope", category: "Objects & Inventions" },
  { word: "Umbrella", category: "Objects & Inventions" },
  { word: "Bicycle", category: "Objects & Inventions" },
  { word: "Camera", category: "Objects & Inventions" },
  { word: "Compass", category: "Objects & Inventions" },
  { word: "Parachute", category: "Objects & Inventions" },
  { word: "Microscope", category: "Objects & Inventions" },
  { word: "Hourglass", category: "Objects & Inventions" },
  { word: "Lantern", category: "Objects & Inventions" },

  // Places & Landmarks
  { word: "Museum", category: "Places & Landmarks" },
  { word: "Library", category: "Places & Landmarks" },
  { word: "Airport", category: "Places & Landmarks" },
  { word: "Stadium", category: "Places & Landmarks" },
  { word: "Lighthouse", category: "Places & Landmarks" },
  { word: "Castle", category: "Places & Landmarks" },
  { word: "Pyramid", category: "Places & Landmarks" },
  { word: "Submarine", category: "Places & Landmarks" },
  { word: "Temple", category: "Places & Landmarks" },
  { word: "Canyon", category: "Places & Landmarks" },

  // People & Roles
  { word: "Astronaut", category: "People & Roles" },
  { word: "Detective", category: "People & Roles" },
  { word: "Magician", category: "People & Roles" },
  { word: "Firefighter", category: "People & Roles" },
  { word: "Pirate", category: "People & Roles" },
  { word: "Ninja", category: "People & Roles" },
  { word: "Chef", category: "People & Roles" },
  { word: "Surgeon", category: "People & Roles" },
  { word: "Clown", category: "People & Roles" },
  { word: "Superhero", category: "People & Roles" },

  // Everyday Life
  { word: "Mirror", category: "Everyday Life" },
  { word: "Passport", category: "Everyday Life" },
  { word: "Backpack", category: "Everyday Life" },
  { word: "Pillow", category: "Everyday Life" },
  { word: "Alarm", category: "Everyday Life" },
  { word: "Ladder", category: "Everyday Life" },
  { word: "Candle", category: "Everyday Life" },
  { word: "Hammock", category: "Everyday Life" },
  { word: "Blanket", category: "Everyday Life" },
  { word: "Calendar", category: "Everyday Life" }
];

export function pickWord(usedWords: Set<string>): WordEntry {
  const availableWords = WORD_BANK.filter(w => !usedWords.has(w.word));
  if (availableWords.length === 0) {
    usedWords.clear();
    return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  }
  const randomIndex = Math.floor(Math.random() * availableWords.length);
  const selected = availableWords[randomIndex];
  usedWords.add(selected.word);
  return selected;
}
