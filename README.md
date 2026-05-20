# 📖 PhraseFlow AI

> Ingliz iboralarini AI yordamida o'rganing — TikTok kabi scroll, Pinterest kabi ko'rinish

![PhraseFlow AI](https://img.shields.io/badge/PhraseFlow-AI-D8B7AE?style=for-the-badge&logo=openai)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)

---

## ✨ Xususiyatlar

- 🤖 **AI bilan iboralar** — Google Gemini yordamida yangi iboralar
- 📱 **TikTok uslubi** — Vertikal scroll bilan ibora o'rganish
- ❤️ **Sevimlilar** — Iboralarni saqlash va qayta ko'rish
- 🧠 **Quiz tizimi** — Saqlangan iboralar bilan test topshirish
- 🌙 **Qorong'u rejim** — Ko'zga qulay qorong'u/yorug' rejim
- 🇺🇿 **O'zbek tili** — To'liq o'zbek tilidagi tushuntirishlar

---

## 🚀 O'rnatish

### Talablar
- Node.js 18+
- npm yoki yarn

### 1. Loyihani yuklab olish
```bash
git clone <repo-url>
cd phraseflow-ai
```

### 2. Kerakli paketlarni o'rnatish
```bash
npm install
```

### 3. Muhit o'zgaruvchilarini sozlash
```bash
cp .env.example .env
```

`.env` faylini tahrirlang:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Eslatma:** API kalit bo'lmasa ham dastur ishlaydi — mahalliy ma'lumotlar ishlatiladi.

### 4. Dasturni ishga tushirish
```bash
npm run dev
```

Brauzerda `http://localhost:5173` ni oching.

---

## 🔑 Gemini API kalitni olish

1. [Google AI Studio](https://makersuite.google.com/app/apikey) ga o'ting
2. "Create API key" tugmasini bosing
3. Kalitni `.env` fayliga joylashtiring

---

## 🏗️ Papka tuzilmasi

```
src/
├── components/
│   ├── cards/
│   │   └── PhraseCard.tsx      # Asosiy ibora kartasi
│   ├── layout/
│   │   └── Layout.tsx          # Umumiy tartib va navigatsiya
│   └── ui/
│       ├── DifficultyBadge.tsx # Qiyinchilik darajasi belgisi
│       └── PhraseCardSkeleton.tsx  # Yuklash animatsiyasi
├── lib/
│   ├── ai.ts                   # Gemini AI integratsiyasi
│   └── mockData.ts             # Mahalliy ibora ma'lumotlari
├── pages/
│   ├── AuthPage.tsx            # Kirish/ro'yxatdan o'tish
│   ├── FeedPage.tsx            # Asosiy feed sahifasi
│   ├── FavoritesPage.tsx       # Sevimlilar sahifasi
│   ├── QuizPage.tsx            # Quiz sahifasi
│   └── SettingsPage.tsx        # Sozlamalar sahifasi
├── stores/
│   └── appStore.ts             # Zustand global holat
└── types/
    └── index.ts                # TypeScript turlari
```

---

## 🎨 Dizayn tizimi

### Ranglar
| Token | Qiymat | Tavsif |
|-------|--------|--------|
| `cream-50` | `#FFF9F5` | Asosiy fon |
| `cream-100` | `#F5EDE6` | Yuzalar |
| `cream-300` | `#E8D5CF` | Chegaralar |
| `cream-400` | `#D8B7AE` | Accent |
| `cream-900` | `#3A2E2A` | Asosiy matn |

### Shriftlar
- **Playfair Display** — Sarlavhalar (display)
- **Poppins** — Asosiy matn (body)

---

## 🧪 Qurishni tekshirish

```bash
npm run build
npm run preview
```

---

## 📝 Litsenziya

MIT © PhraseFlow AI
