# Tamagotchi Battle - README

## 🐣 Overview

Tamagotchi Battle is a full-stack web application that combines virtual pet simulation with turn-based combat. Raise your Tamagotchi by managing hunger, happiness, and energy stats, then battle against NPC opponents to earn XP and level up!

---

## ✨ Features

- **User Authentication** - Register and login with JWT tokens
- **Create & Raise Tamagotchis** - Name your pet and choose its type (Fire, Water, Grass)
- **Stat Management** - Feed, play, and rest to maintain hunger, happiness, and energy
- **Auto-Decay System** - Stats decrease naturally over time (every 10 seconds)
- **Level & XP System** - Gain XP from playing and resting; level up to become stronger
- **Turn-Based Battle Arena** - Fight NPC opponents with Attack, Defend, Special, and Run actions
- **Type Advantages** - Fire beats Grass, Grass beats Water, Water beats Fire
- **Celebration & Defeat Screens** - Visual feedback for battle outcomes
- **Multiple Tamagotchis** - Own and switch between multiple pets

---

## 🛠️ Tech Stack

### Frontend

| Technology  | Purpose                   |
| ----------- | ------------------------- |
| React 18    | UI framework              |
| Vite        | Build tool and dev server |
| Chakra UI   | Component styling         |
| Axios       | HTTP client               |
| React Icons | Icon library              |

### Backend

| Technology | Purpose             |
| ---------- | ------------------- |
| Express.js | REST API server     |
| Prisma ORM | Database operations |
| PostgreSQL | Relational database |
| JWT        | Authentication      |
| bcrypt     | Password hashing    |

---

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager

---

## 🚀 Getting Started

### 1. Clone the Repositories

```bash
# Frontend
git clone https://github.com/yourusername/tamagotchi-battle-frontend.git
cd tamagotchi-battle-frontend

# Backend (in a separate directory)
git clone https://github.com/yourusername/tamagotchi-battle-backend.git
cd tamagotchi-battle-backend
```

---

### 2. Backend Setup

#### Install Dependencies

```bash
cd tamagotchi-battle-backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the backend root:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/tamagotchi_battle_db
JWT_SECRET=your_super_secret_key_here
```

> **Generate a secure JWT secret:** `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

#### Create the Database

```bash
# Using PostgreSQL command line
createdb tamagotchi_battle_db

# Or using psql
psql -U postgres -c "CREATE DATABASE tamagotchi_battle_db;"
```

#### Run Database Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### Seed NPC Opponents

```bash
npm run seed
```

This creates 9 NPC Tamagotchis for battles (levels 1, 3, and 5).

#### Start the Backend Server

```bash
node server.js
```

The server will run at `http://localhost:8000`

---

### 3. Frontend Setup

#### Install Dependencies

```bash
cd tamagotchi-battle-frontend
npm install
```

#### Start the Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

---

## 🎮 How to Play

### 1. Create an Account

- Click "Need an account? Register"
- Enter your email and password
- Log in with your new credentials

### 2. Create Your First Tamagotchi

- Click "CREATE" button
- Enter a name (e.g., "Buddy")
- Choose a type: Fire 🔥, Water 💧, or Grass 🌿
- Click "Create"

### 3. Care for Your Tamagotchi

- **Feed** 🍕 - Reduces hunger by 10
- **Play** 🎮 - Increases happiness by 15, decreases energy by 5, gains 5 XP
- **Rest** 😴 - Increases energy by 20, increases hunger by 5, gains 3 XP

### 4. Battle!

- Click "BATTLE ARENA"
- Select an opponent (NPCs have difficulty colors: Green = Easy, Yellow = Medium, Red = Hard)
- Click "START BATTLE"
- Choose your action each turn:
  - **Attack** ⚔️ - Deal normal damage
  - **Defend** 🛡️ - Reduce incoming damage by 50%
  - **Special** ✨ - Deal 2x damage (costs 15 energy)
  - **Run** 🏃 - 50% chance to escape

### 5. Level Up

- Gain XP from playing, resting, and winning battles
- Each level requires 100 × current level XP
- Level up rewards: increased battle power!

### 6. Manage Multiple Tamagotchis

- Create multiple pets
- Select which one to use from the dropdown
- Delete unwanted Tamagotchis using the DELETE button

---

## 📁 Project Structure

### Backend

```
tamagotchi-battle-backend/
├── prisma/
│   ├── schema.prisma      # Database models
│   └── seed.js            # NPC seeding script
├── routes/
│   ├── auth.js            # Login/Register endpoints
│   ├── tamagotchi.js      # CRUD operations
│   └── battle.js          # Battle system
├── generated/prisma/      # Prisma client (auto-generated)
├── server.js              # Express entry point
└── .env                   # Environment variables
```

### Frontend

```
tamagotchi-battle-frontend/
├── src/
│   ├── components/
│   │   ├── ActionButtons.jsx
│   │   ├── BattleActions.jsx
│   │   ├── BattleArena.jsx
│   │   ├── Celebration.jsx
│   │   ├── CreateTamagotchi.jsx
│   │   ├── Defeat.jsx
│   │   ├── DeleteTamagotchiModal.jsx
│   │   ├── NameInput.jsx
│   │   ├── Stats.jsx
│   │   ├── Tamagotchi.jsx
│   │   ├── TamagotchiTypeSelector.jsx
│   │   └── WarningMessages.jsx
│   ├── App.jsx            # Main application
│   ├── main.jsx           # Entry point
│   └── theme.js           # Chakra UI theme
├── public/
│   └── images/
│       └── tamagotchi/    # Type images (fire-type.png, etc.)
└── index.html
```

---

## 🔧 Available Scripts

### Backend

| Command                                | Description             |
| -------------------------------------- | ----------------------- |
| `node server.js`                       | Start production server |
| `npx prisma studio`                    | Open database browser   |
| `npx prisma migrate dev --name <name>` | Run database migration  |
| `npm run seed`                         | Seed NPC opponents      |

### Frontend

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |

---

## 🎨 Game Mechanics

### Stat Ranges (0-100)

| Stat      | 0         | 50     | 100      |
| --------- | --------- | ------ | -------- |
| Hunger    | Full      | Normal | Starving |
| Happiness | Sad       | Okay   | Ecstatic |
| Energy    | Exhausted | Normal | Rested   |

### Battle Formulas

```
Attack Power = (Happiness × 0.4) + (Energy × 0.3) + (Level × 10)
Defense Power = ((100 - Hunger) × 0.3) + (Level × 5)
Damage = max(1, floor((Attack - Defense) / 10 × Type Multiplier × Random Variance))
```

### Type Multipliers

| Attacker → Defender | Multiplier |
| ------------------- | ---------- |
| Fire → Grass        | 1.5x       |
| Fire → Water        | 0.7x       |
| Water → Fire        | 1.5x       |
| Water → Grass       | 0.7x       |
| Grass → Water       | 1.5x       |
| Grass → Fire        | 0.7x       |

### XP Rewards

| Action      | XP Gain |
| ----------- | ------- |
| Play        | +5      |
| Rest        | +3      |
| Win Battle  | +50     |
| Lose Battle | +10     |

---

## 🐛 Troubleshooting

### "Auth middleware error: jwt expired"

- Log out and log in again to refresh your token

### "Foreign key constraint violated"

- Delete a Tamagotchi's battle history before deleting the Tamagotchi (handled automatically)

### Database connection refused

- Ensure PostgreSQL is running: `sudo service postgresql start`
- Verify DATABASE_URL in `.env` matches your PostgreSQL credentials

### Port 8000 already in use

- Change PORT in `server.js` or kill the process using the port

---

## 📝 Environment Variables

| Variable       | Description                  | Example                                    |
| -------------- | ---------------------------- | ------------------------------------------ |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET`   | Secret for signing JWTs      | `64_char_hex_string`                       |

---

---

## 📄 License

This project was created for CSCI 39548 - Practical Web Development.

---

## Author

Ryan Whitehead
