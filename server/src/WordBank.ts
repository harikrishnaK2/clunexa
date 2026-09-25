export interface WordEntry {
  word: string;
  category: string;
}

export const WORD_BANK: WordEntry[] = [
  // ── Doraemon & Anime ───────────────────────────────────────────────────────
  { word: "Doraemon", category: "Doraemon & Anime" },
  { word: "Nobita", category: "Doraemon & Anime" },
  { word: "Shizuka", category: "Doraemon & Anime" },
  { word: "Gian", category: "Doraemon & Anime" },
  { word: "Suneo", category: "Doraemon & Anime" },
  { word: "Dorami", category: "Doraemon & Anime" },
  { word: "AnywhereDoor", category: "Doraemon & Anime" },
  { word: "BambooCopter", category: "Doraemon & Anime" },
  { word: "TimeMachine", category: "Doraemon & Anime" },
  { word: "Pikachu", category: "Doraemon & Anime" },
  { word: "Naruto", category: "Doraemon & Anime" },
  { word: "Goku", category: "Doraemon & Anime" },
  { word: "Luffy", category: "Doraemon & Anime" },
  { word: "Charizard", category: "Doraemon & Anime" },
  { word: "Ash", category: "Doraemon & Anime" },
  { word: "Kakashi", category: "Doraemon & Anime" },

  // ── Shinchan & Cartoons ────────────────────────────────────────────────────
  { word: "Shinchan", category: "Shinchan & Cartoons" },
  { word: "Shiro", category: "Shinchan & Cartoons" },
  { word: "Himawari", category: "Shinchan & Cartoons" },
  { word: "ActionKamen", category: "Shinchan & Cartoons" },
  { word: "Misae", category: "Shinchan & Cartoons" },
  { word: "Hiroshi", category: "Shinchan & Cartoons" },
  { word: "Tom", category: "Shinchan & Cartoons" },
  { word: "Jerry", category: "Shinchan & Cartoons" },
  { word: "Mickey", category: "Shinchan & Cartoons" },
  { word: "Donald", category: "Shinchan & Cartoons" },
  { word: "Popeye", category: "Shinchan & Cartoons" },
  { word: "Scooby", category: "Shinchan & Cartoons" },
  { word: "Oggy", category: "Shinchan & Cartoons" },
  { word: "ChhotaBheem", category: "Shinchan & Cartoons" },
  { word: "MotuPatlu", category: "Shinchan & Cartoons" },
  { word: "SpongeBob", category: "Shinchan & Cartoons" },
  { word: "Patrick", category: "Shinchan & Cartoons" },
  { word: "BenTen", category: "Shinchan & Cartoons" },
  { word: "Dora", category: "Shinchan & Cartoons" },

  // ── Marvel & DC Superheroes ────────────────────────────────────────────────
  { word: "Ironman", category: "Marvel & Superheroes" },
  { word: "Spiderman", category: "Marvel & Superheroes" },
  { word: "Thor", category: "Marvel & Superheroes" },
  { word: "Hulk", category: "Marvel & Superheroes" },
  { word: "CaptainAmerica", category: "Marvel & Superheroes" },
  { word: "Thanos", category: "Marvel & Superheroes" },
  { word: "Wolverine", category: "Marvel & Superheroes" },
  { word: "Deadpool", category: "Marvel & Superheroes" },
  { word: "Batman", category: "Marvel & Superheroes" },
  { word: "Superman", category: "Marvel & Superheroes" },
  { word: "Joker", category: "Marvel & Superheroes" },
  { word: "Avengers", category: "Marvel & Superheroes" },
  { word: "Groot", category: "Marvel & Superheroes" },
  { word: "Loki", category: "Marvel & Superheroes" },
  { word: "Hawkeye", category: "Marvel & Superheroes" },
  { word: "Flash", category: "Marvel & Superheroes" },
  { word: "BlackPanther", category: "Marvel & Superheroes" },
  { word: "Aquaman", category: "Marvel & Superheroes" },
  { word: "WonderWoman", category: "Marvel & Superheroes" },
  { word: "DoctorStrange", category: "Marvel & Superheroes" },

  // ── Famous Movies & Cinema ─────────────────────────────────────────────────
  { word: "HarryPotter", category: "Movies & Cinema" },
  { word: "Voldemort", category: "Movies & Cinema" },
  { word: "Avatar", category: "Movies & Cinema" },
  { word: "Titanic", category: "Movies & Cinema" },
  { word: "Barbie", category: "Movies & Cinema" },
  { word: "Shrek", category: "Movies & Cinema" },
  { word: "Simba", category: "Movies & Cinema" },
  { word: "Tarzan", category: "Movies & Cinema" },
  { word: "Aladdin", category: "Movies & Cinema" },
  { word: "JackSparrow", category: "Movies & Cinema" },
  { word: "Terminator", category: "Movies & Cinema" },
  { word: "StarWars", category: "Movies & Cinema" },
  { word: "Matrix", category: "Movies & Cinema" },
  { word: "JurassicPark", category: "Movies & Cinema" },
  { word: "Frozen", category: "Movies & Cinema" },
  { word: "Elsa", category: "Movies & Cinema" },
  { word: "Minions", category: "Movies & Cinema" },
  { word: "Inception", category: "Movies & Cinema" },
  { word: "Godzilla", category: "Movies & Cinema" },
  { word: "KingKong", category: "Movies & Cinema" },

  // ── Video Games & Gaming ───────────────────────────────────────────────────
  { word: "Mario", category: "Games & Gaming" },
  { word: "Luigi", category: "Games & Gaming" },
  { word: "Sonic", category: "Games & Gaming" },
  { word: "Minecraft", category: "Games & Gaming" },
  { word: "Roblox", category: "Games & Gaming" },
  { word: "Pokemon", category: "Games & Gaming" },
  { word: "Pubg", category: "Games & Gaming" },
  { word: "FreeFire", category: "Games & Gaming" },
  { word: "Pacman", category: "Games & Gaming" },
  { word: "AmongUs", category: "Games & Gaming" },
  { word: "Fortnite", category: "Games & Gaming" },
  { word: "GTA", category: "Games & Gaming" },
  { word: "SubwaySurfers", category: "Games & Gaming" },
  { word: "CandyCrush", category: "Games & Gaming" },
  { word: "AngryBirds", category: "Games & Gaming" },
  { word: "TempleRun", category: "Games & Gaming" },

  // ── Delicious Food & Snacks ────────────────────────────────────────────────
  { word: "Pizza", category: "Food & Snacks" },
  { word: "Burger", category: "Food & Snacks" },
  { word: "Chocolate", category: "Food & Snacks" },
  { word: "IceCream", category: "Food & Snacks" },
  { word: "Popcorn", category: "Food & Snacks" },
  { word: "FrenchFries", category: "Food & Snacks" },
  { word: "Maggi", category: "Food & Snacks" },
  { word: "Samosa", category: "Food & Snacks" },
  { word: "Biryani", category: "Food & Snacks" },
  { word: "Donut", category: "Food & Snacks" },
  { word: "Pancake", category: "Food & Snacks" },
  { word: "Sandwich", category: "Food & Snacks" },
  { word: "Cookie", category: "Food & Snacks" },
  { word: "Mango", category: "Food & Snacks" },
  { word: "Noodles", category: "Food & Snacks" },
  { word: "Cake", category: "Food & Snacks" },
  { word: "CottonCandy", category: "Food & Snacks" },
  { word: "Waffle", category: "Food & Snacks" },
  { word: "Taco", category: "Food & Snacks" },
  { word: "Nachos", category: "Food & Snacks" },
  { word: "Momos", category: "Food & Snacks" },
  { word: "Dosa", category: "Food & Snacks" },
  { word: "PaniPuri", category: "Food & Snacks" },
  { word: "Strawberry", category: "Food & Snacks" },
  { word: "Watermelon", category: "Food & Snacks" },

  // ── Popular & Cute Animals ─────────────────────────────────────────────────
  { word: "Dog", category: "Popular Animals" },
  { word: "Cat", category: "Popular Animals" },
  { word: "Puppy", category: "Popular Animals" },
  { word: "Kitten", category: "Popular Animals" },
  { word: "Lion", category: "Popular Animals" },
  { word: "Tiger", category: "Popular Animals" },
  { word: "Monkey", category: "Popular Animals" },
  { word: "Panda", category: "Popular Animals" },
  { word: "Elephant", category: "Popular Animals" },
  { word: "Rabbit", category: "Popular Animals" },
  { word: "Dolphin", category: "Popular Animals" },
  { word: "Penguin", category: "Popular Animals" },
  { word: "Horse", category: "Popular Animals" },
  { word: "Giraffe", category: "Popular Animals" },
  { word: "Koala", category: "Popular Animals" },
  { word: "Bear", category: "Popular Animals" },
  { word: "Kangaroo", category: "Popular Animals" },
  { word: "Parrot", category: "Popular Animals" },
  { word: "Zebra", category: "Popular Animals" },
  { word: "Duck", category: "Popular Animals" },
  { word: "Butterfly", category: "Popular Animals" },
  { word: "Deer", category: "Popular Animals" },
  { word: "Camel", category: "Popular Animals" },

  // ── Everyday Cool Gadgets ──────────────────────────────────────────────────
  { word: "Mobile", category: "Cool Gadgets" },
  { word: "Laptop", category: "Cool Gadgets" },
  { word: "Headphones", category: "Cool Gadgets" },
  { word: "Bicycle", category: "Cool Gadgets" },
  { word: "Smartwatch", category: "Cool Gadgets" },
  { word: "Camera", category: "Cool Gadgets" },
  { word: "Drone", category: "Cool Gadgets" },
  { word: "Television", category: "Cool Gadgets" },
  { word: "Skateboard", category: "Cool Gadgets" },
  { word: "GamingConsole", category: "Cool Gadgets" },
  { word: "Robot", category: "Cool Gadgets" },
  { word: "ElectricCar", category: "Cool Gadgets" },
  { word: "Hoverboard", category: "Cool Gadgets" },
  { word: "Tablet", category: "Cool Gadgets" },
  { word: "Microphone", category: "Cool Gadgets" },
  { word: "Telescope", category: "Cool Gadgets" },

  // ── Popular Sports & Games ─────────────────────────────────────────────────
  { word: "Cricket", category: "Sports & Games" },
  { word: "Football", category: "Sports & Games" },
  { word: "Badminton", category: "Sports & Games" },
  { word: "Basketball", category: "Sports & Games" },
  { word: "Tennis", category: "Sports & Games" },
  { word: "Chess", category: "Sports & Games" },
  { word: "Carrom", category: "Sports & Games" },
  { word: "Ludo", category: "Sports & Games" },
  { word: "Bowling", category: "Sports & Games" },
  { word: "Boxing", category: "Sports & Games" },
  { word: "Swimming", category: "Sports & Games" },
  { word: "Volleyball", category: "Sports & Games" },
  { word: "TableTennis", category: "Sports & Games" },
  { word: "Cycling", category: "Sports & Games" },
  { word: "Skating", category: "Sports & Games" },

  // ── Fun Places & Hangouts ──────────────────────────────────────────────────
  { word: "WaterPark", category: "Fun Places" },
  { word: "CinemaHall", category: "Fun Places" },
  { word: "ShoppingMall", category: "Fun Places" },
  { word: "Beach", category: "Fun Places" },
  { word: "Zoo", category: "Fun Places" },
  { word: "Circus", category: "Fun Places" },
  { word: "AmusementPark", category: "Fun Places" },
  { word: "Airport", category: "Fun Places" },
  { word: "School", category: "Fun Places" },
  { word: "Castle", category: "Fun Places" },
  { word: "Island", category: "Fun Places" },
  { word: "Treehouse", category: "Fun Places" },
  { word: "Stadium", category: "Fun Places" },
  { word: "Planetarium", category: "Fun Places" }
];

// Global ring buffer to prevent words from repeating across games
const globalRecentWords: string[] = [];
const MAX_GLOBAL_RECENT = 120; // Keep the last 120 chosen words in global anti-repeat memory

export function pickWord(roomUsedWords: Set<string>): WordEntry {
  const roomUsedLower = new Set(Array.from(roomUsedWords).map(w => w.toLowerCase()));
  const globalRecentLower = new Set(globalRecentWords.map(w => w.toLowerCase()));

  // 1. First priority: words neither used in this room NOR used recently in other games
  let candidates = WORD_BANK.filter(
    w => !roomUsedLower.has(w.word.toLowerCase()) && !globalRecentLower.has(w.word.toLowerCase())
  );

  // 2. Second priority: if fresh global words run low, pick any word not yet used in THIS room
  if (candidates.length === 0) {
    candidates = WORD_BANK.filter(
      w => !roomUsedLower.has(w.word.toLowerCase())
    );
  }

  // 3. Fallback: if the room has exhausted words, reset room pool
  if (candidates.length === 0) {
    roomUsedWords.clear();
    candidates = WORD_BANK.filter(w => !globalRecentLower.has(w.word.toLowerCase()));
    if (candidates.length === 0) {
      candidates = WORD_BANK;
    }
  }

  // Pick randomly from eligible candidates
  const randomIndex = Math.floor(Math.random() * candidates.length);
  const selected = candidates[randomIndex];

  // Record in room history
  roomUsedWords.add(selected.word);

  // Record in global recent history FIFO
  globalRecentWords.push(selected.word);
  if (globalRecentWords.length > MAX_GLOBAL_RECENT) {
    globalRecentWords.shift();
  }

  return selected;
}
