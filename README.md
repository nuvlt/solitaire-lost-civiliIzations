# 🏛️ Solitaire: Lost Civilizations

A premium mobile solitaire game combining classic TriPeaks gameplay with an ancient civilization exploration theme.

## 🎮 Features

### MVP (Current Version)
- ✅ **TriPeaks Solitaire**: Classic gameplay with 3 peaks layout
- ✅ **Ancient Desert Theme**: Premium gold and sand color palette
- ✅ **Smooth Animations**: Card flip and move animations
- ✅ **Streak System**: Combo scoring for consecutive plays
- ✅ **Playable Cards Highlight**: Visual feedback for valid moves
- ✅ **Fragment Collection**: Drop system with 4 rarity tiers
- ✅ **Artifact Crafting**: Combine fragments to create artifacts
- ✅ **LocalStorage Persistence**: Progress saved automatically
- ✅ **Collection Screen**: View all fragments and artifacts

### Coming Soon
- 🔜 Power-ups (Hint, Undo, Shuffle)
- 🔜 Multiple Civilizations (Desert, Forest, Ice, Mountain)
- 🔜 Daily Quests & Achievements
- 🔜 Progressive Difficulty Levels
- 🔜 Sound effects & background music

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- **NO local installation needed!** Use Expo Go app

### Installation

```bash
# Clone the repository
git clone https://github.com/nuvlt/solitaire-lost-civilizations.git
cd solitaire-lost-civilizations

# Install dependencies
npm install

# Start the development server
npm start
```

### Testing on Mobile

1. **Install Expo Go** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan the QR code** shown in terminal/browser after running `npm start`

3. **Play!** 🎉

## 📱 Development

```bash
# Start development server
npm start

# Run on web browser
npm run web

# Run on Android (requires Android Studio)
npm run android

# Run on iOS (requires macOS + Xcode)
npm run ios
```

## 🔮 Fragment & Artifact System

### Drop Rates

| Game Result | Common | Rare | Epic | Legendary |
|-------------|--------|------|------|-----------|
| **Win**     | 70%    | 22%  | 7%   | 1%        |
| **Loss**    | 40%    | 10%  | 0%   | 0%        |
| **3+ Streak Bonus** | +10% each rarity |

### Crafting Requirements

| Rarity | Fragments Needed | Example Artifacts |
|--------|------------------|-------------------|
| Common | 5 | Sun Stone Tablet (+5% coins) |
| Rare | 7 | Moon Scarab (+10% fragments) |
| Epic | 9 | Desert Wind Charm (1 free undo/day) |
| Legendary | 12 | Lost Crown (Special theme) |

### Desert Civilization Fragments

**Common:**
- 🏜️ Sand Grain
- 🏺 Pottery Shard
- 🪨 Stone Chip

**Rare:**
- 🪙 Bronze Coin
- 📜 Hieroglyph Tablet
- ✨ Golden Thread

**Epic:**
- 🪲 Scarab Amulet
- 💍 Pharaoh's Seal
- 🗿 Obelisk Piece

**Legendary:**
- ☀️ Sun Stone
- ⚱️ Ankh Key
- 👑 Crown Fragment

## 🎨 Color Palette - Ancient Desert Gold

| Color | Hex | Usage |
|-------|-----|-------|
| Ancient Gold | `#D4AF37` | Primary brand color |
| Sand Brown | `#8B4513` | Secondary elements |
| Sunset Orange | `#FF6B35` | Accents & highlights |
| Dark Desert | `#2C1810` | Background |
| Bright Gold | `#FFD700` | Special effects |

## 📦 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Card.tsx     # Card component with animations
│   └── FragmentRewardModal.tsx  # Fragment reward popup
├── screens/         # Main app screens
│   ├── GameScreen.tsx
│   └── CollectionScreen.tsx
├── game/            # Game logic
│   ├── TriPeaksEngine.ts
│   └── FragmentSystem.ts  # Drop rates & crafting
├── types/           # TypeScript definitions
│   ├── game.ts
│   └── fragments.ts
├── constants/       # App constants
│   ├── colors.ts
│   └── game.ts
└── utils/           # Utility functions
    └── storage.ts   # AsyncStorage persistence
```

## 🎯 Roadmap

### Phase 1: MVP (Week 1-2) ✅
- [x] Basic TriPeaks gameplay
- [x] Card animations
- [x] Score & streak system
- [x] Win/lose conditions

### Phase 2: Core Loop (Week 3-4) ✅
- [x] Fragment drop system
- [x] Artifact collection UI
- [x] First civilization complete
- [x] LocalStorage persistence

### Phase 3: Monetization (Week 5-6)
- [ ] Rewarded video ads integration
- [ ] In-app purchases setup
- [ ] VIP mode

### Phase 4: Polish & Launch (Week 7-8)
- [ ] Sound effects & music
- [ ] Onboarding tutorial
- [ ] App Store optimization
- [ ] Beta testing

## 🔧 Tech Stack

- **React Native** (via Expo)
- **TypeScript** for type safety
- **Expo Go** for instant mobile testing
- **Vercel/Netlify** for web deployment
- **Firebase/Supabase** (coming soon for cloud save)

## 📊 KPIs & Goals

- Day-1 Retention: 40%+
- Day-7 Retention: 18%+
- Day-30 Retention: 8%+

## 🤝 Contributing

This is a private development project. If you have feedback or suggestions, please reach out!

## 📄 License

© 2024 Nuvlt. All rights reserved.

---

Built with ❤️ using React Native & Expo
