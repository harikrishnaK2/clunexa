export interface WordEntry {
  word: string;
  category: string;
}

export const WORD_BANK: WordEntry[] = [
  // ── Doraemon & Anime (Kids & Teens) ────────────────────────────────────────
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

  // ── Shinchan & Cartoons (Kids & Teens) ─────────────────────────────────────
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

  // ── Fairy Tales & Toys (Children) ──────────────────────────────────────────
  { word: "Cinderella", category: "Fairy Tales & Toys" },
  { word: "SnowWhite", category: "Fairy Tales & Toys" },
  { word: "Rapunzel", category: "Fairy Tales & Toys" },
  { word: "Pinocchio", category: "Fairy Tales & Toys" },
  { word: "PeterPan", category: "Fairy Tales & Toys" },
  { word: "RedRidingHood", category: "Fairy Tales & Toys" },
  { word: "Unicorn", category: "Fairy Tales & Toys" },
  { word: "Mermaid", category: "Fairy Tales & Toys" },
  { word: "TeddyBear", category: "Fairy Tales & Toys" },
  { word: "MagicWand", category: "Fairy Tales & Toys" },
  { word: "Dollhouse", category: "Fairy Tales & Toys" },
  { word: "ToyTrain", category: "Fairy Tales & Toys" },
  { word: "Crayons", category: "Fairy Tales & Toys" },
  { word: "PlayDough", category: "Fairy Tales & Toys" },
  { word: "Kite", category: "Fairy Tales & Toys" },
  { word: "Slide", category: "Fairy Tales & Toys" },
  { word: "Seesaw", category: "Fairy Tales & Toys" },
  { word: "Swing", category: "Fairy Tales & Toys" },

  // ── Marvel & DC Superheroes (All Ages) ─────────────────────────────────────
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

  // ── Famous Movies & Cinema (Teens & Adults) ────────────────────────────────
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

  // ── Video Games & Gaming (Kids & Teens) ────────────────────────────────────
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

  // ── Social Media & Trends (Teens & Young Adults) ───────────────────────────
  { word: "Instagram", category: "Social Media & Trends" },
  { word: "YouTube", category: "Social Media & Trends" },
  { word: "TikTok", category: "Social Media & Trends" },
  { word: "Netflix", category: "Social Media & Trends" },
  { word: "Spotify", category: "Social Media & Trends" },
  { word: "Meme", category: "Social Media & Trends" },
  { word: "Selfie", category: "Social Media & Trends" },
  { word: "Podcast", category: "Social Media & Trends" },
  { word: "Vlogger", category: "Social Media & Trends" },
  { word: "Emoji", category: "Social Media & Trends" },
  { word: "Influencer", category: "Social Media & Trends" },
  { word: "WiFi", category: "Social Media & Trends" },
  { word: "Snapchat", category: "Social Media & Trends" },
  { word: "Gamer", category: "Social Media & Trends" },
  { word: "Hashtag", category: "Social Media & Trends" },

  // ── School & College Life (Kids & Teens) ───────────────────────────────────
  { word: "Lunchbox", category: "School & Campus" },
  { word: "Homework", category: "School & Campus" },
  { word: "Backpack", category: "School & Campus" },
  { word: "Locker", category: "School & Campus" },
  { word: "Classroom", category: "School & Campus" },
  { word: "Principal", category: "School & Campus" },
  { word: "Canteen", category: "School & Campus" },
  { word: "Examination", category: "School & Campus" },
  { word: "Uniform", category: "School & Campus" },
  { word: "Blackboard", category: "School & Campus" },
  { word: "Notebook", category: "School & Campus" },
  { word: "Recess", category: "School & Campus" },
  { word: "Library", category: "School & Campus" },
  { word: "Teacher", category: "School & Campus" },

  // ── Fashion & Brands (Teens & Adults) ──────────────────────────────────────
  { word: "Nike", category: "Fashion & Style" },
  { word: "Adidas", category: "Fashion & Style" },
  { word: "Sneakers", category: "Fashion & Style" },
  { word: "Hoodie", category: "Fashion & Style" },
  { word: "Sunglasses", category: "Fashion & Style" },
  { word: "Watch", category: "Fashion & Style" },
  { word: "Perfume", category: "Fashion & Style" },
  { word: "Jacket", category: "Fashion & Style" },
  { word: "Jeans", category: "Fashion & Style" },
  { word: "Handbag", category: "Fashion & Style" },
  { word: "Lipstick", category: "Fashion & Style" },
  { word: "Cap", category: "Fashion & Style" },

  // ── Office & Work Life (Adults) ────────────────────────────────────────────
  { word: "Coffee", category: "Work & Office Life" },
  { word: "Salary", category: "Work & Office Life" },
  { word: "Promotion", category: "Work & Office Life" },
  { word: "Meeting", category: "Work & Office Life" },
  { word: "Boss", category: "Work & Office Life" },
  { word: "Interview", category: "Work & Office Life" },
  { word: "Deadline", category: "Work & Office Life" },
  { word: "Presentation", category: "Work & Office Life" },
  { word: "Weekend", category: "Work & Office Life" },
  { word: "Vacation", category: "Work & Office Life" },
  { word: "Overtime", category: "Work & Office Life" },
  { word: "Resume", category: "Work & Office Life" },
  { word: "Bonus", category: "Work & Office Life" },

  // ── Home & Daily Living (All Ages) ─────────────────────────────────────────
  { word: "Microwave", category: "Home & Daily Life" },
  { word: "Refrigerator", category: "Home & Daily Life" },
  { word: "Sofa", category: "Home & Daily Life" },
  { word: "Balcony", category: "Home & Daily Life" },
  { word: "Garden", category: "Home & Daily Life" },
  { word: "Kitchen", category: "Home & Daily Life" },
  { word: "Blender", category: "Home & Daily Life" },
  { word: "Wardrobe", category: "Home & Daily Life" },
  { word: "WashingMachine", category: "Home & Daily Life" },
  { word: "DiningTable", category: "Home & Daily Life" },
  { word: "AlarmClock", category: "Home & Daily Life" },
  { word: "Pillow", category: "Home & Daily Life" },
  { word: "Blanket", category: "Home & Daily Life" },

  // ── Delicious Food & Snacks (All Ages) ─────────────────────────────────────
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

  // ── Popular & Cute Animals (All Ages) ──────────────────────────────────────
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

  // ── Cool Gadgets & Technology (Teens & Adults) ─────────────────────────────
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
  { word: "Hoverboard", category: "Cool Gadgets" },
  { word: "Tablet", category: "Cool Gadgets" },
  { word: "Microphone", category: "Cool Gadgets" },
  { word: "Telescope", category: "Cool Gadgets" },

  // ── Vehicles & Speed (All Ages) ────────────────────────────────────────────
  { word: "Supercar", category: "Vehicles & Transport" },
  { word: "Motorcycle", category: "Vehicles & Transport" },
  { word: "Helicopter", category: "Vehicles & Transport" },
  { word: "Yacht", category: "Vehicles & Transport" },
  { word: "Metro", category: "Vehicles & Transport" },
  { word: "BulletTrain", category: "Vehicles & Transport" },
  { word: "Scooter", category: "Vehicles & Transport" },
  { word: "Ambulance", category: "Vehicles & Transport" },
  { word: "Taxi", category: "Vehicles & Transport" },
  { word: "Airplane", category: "Vehicles & Transport" },
  { word: "Submarine", category: "Vehicles & Transport" },
  { word: "Jeep", category: "Vehicles & Transport" },

  // ── Popular Sports & Games (All Ages) ──────────────────────────────────────
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
  { word: "Cycling", category: "Sports & Games" },
  { word: "Skating", category: "Sports & Games" },

  // ── Travel & Adventures (Teens & Adults) ───────────────────────────────────
  { word: "Passport", category: "Travel & Adventures" },
  { word: "Suitcase", category: "Travel & Adventures" },
  { word: "Resort", category: "Travel & Adventures" },
  { word: "Campfire", category: "Travel & Adventures" },
  { word: "Souvenir", category: "Travel & Adventures" },
  { word: "Safari", category: "Travel & Adventures" },
  { word: "Tent", category: "Travel & Adventures" },
  { word: "RoadTrip", category: "Travel & Adventures" },
  { word: "WaterPark", category: "Fun Places" },
  { word: "CinemaHall", category: "Fun Places" },
  { word: "ShoppingMall", category: "Fun Places" },
  { word: "Beach", category: "Fun Places" },
  { word: "Zoo", category: "Fun Places" },
  { word: "Circus", category: "Fun Places" },
  { word: "AmusementPark", category: "Fun Places" },
  { word: "Airport", category: "Fun Places" },
  { word: "Castle", category: "Fun Places" },
  { word: "Island", category: "Fun Places" },
  { word: "Treehouse", category: "Fun Places" },
  { word: "Stadium", category: "Fun Places" }
];

// Global ring buffer to prevent words from repeating across games
const globalRecentWords: string[] = [];
const MAX_GLOBAL_RECENT = 150; // Keep the last 150 chosen words in global anti-repeat memory

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
