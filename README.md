# 🍬 Candy Crush - Telegram Mini App

ایک مکمل Candy Crush جیسی گیم Telegram Mini App کے لیے۔

## 📋 خصوصیات

✅ **6×6 Game Grid** - مکمل gameplay mechanics
✅ **Matching System** - 3+ candies کی matching
✅ **Cascade Matches** - اضافی points کے لیے
✅ **Smooth Animations** - صاف اور تیز رفتار
✅ **Score Tracking** - Moves اور Level system
✅ **Telegram Integration** - پورا Telegram API support
✅ **Responsive Design** - تمام موبائل devices پر
✅ **Leaderboard Ready** - Score sharing کے لیے

---

## 🚀 فوری شروع (5 منٹ میں)

### Option 1: Local میں چلائیں

#### Step 1: Files Download کریں
```bash
# سب files کو ایک folder میں رکھیں:
candy-crush/
├── index.html
├── app.js
├── styles.css
├── server.js
├── package.json
├── .env.example
└── README.md
```

#### Step 2: Dependencies Install کریں
```bash
cd candy-crush
npm install
```

#### Step 3: Server شروع کریں
```bash
npm start
```

یہ دیکھیں: `http://localhost:3000`

---

### Option 2: Vercel پر Deploy کریں (بہترین)

#### Step 1: GitHub Account بنائیں
- [github.com](https://github.com) پر جائیں

#### Step 2: Repository بنائیں
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/candy-crush
git push -u origin main
```

#### Step 3: Vercel سے Deploy کریں
1. [vercel.com](https://vercel.com) پر جائیں
2. GitHub سے login کریں
3. Repository select کریں
4. **Deploy** دبائیں

**بس! آپ کو ملے گا:**
```
https://candy-crush-YOUR_NAME.vercel.app
```

---

### Option 3: Heroku پر Deploy کریں

#### Step 1: Heroku CLI Install کریں
```bash
# Windows/Mac/Linux
npm install -g heroku
```

#### Step 2: Login کریں
```bash
heroku login
```

#### Step 3: App بنائیں
```bash
heroku create candy-crush-app
git push heroku main
```

**آپ کی app یہاں ہوگی:**
```
https://candy-crush-app.herokuapp.com
```

---

## 🤖 Telegram Bot سیٹ اپ کریں

### Step 1: Telegram میں Bot بنائیں

1. Telegram میں **@BotFather** تلاش کریں
2. `/newbot` لکھیں
3. اپنے bot کا نام دیں (مثلاً: CandyCrushGame)
4. Username دیں (مثلاً: candy_crush_bot)
5. **Token کاپی کریں** (یہ بہت ضروری ہے!)

### Step 2: Bot Configuration

**BotFather سے یہ کمانڈز چلائیں:**

```
/setmenu

candy_crush_bot

Play Game - /play
Leaderboard - /leaderboard
Help - /help
```

### Step 3: Mini App شامل کریں

```
/newapp

candy_crush_bot

Candy Crush
https://your-app-url.vercel.app (یہاں اپنی URL ڈالیں)

Game کھیلیں
```

---

## 📝 Bot Code (اختیاری)

اگر Discord/Telegram بوٹ بھی چاہیے تو:

```python
# bot.py
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

TOKEN = "YOUR_BOT_TOKEN"
APP_URL = "https://your-app-url.vercel.app"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    keyboard = [[
        InlineKeyboardButton("🎮 کھیل کھیلیں", web_app={"url": APP_URL})
    ]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        f"سلام {user.first_name}! 🍬\n\nCandy Crush میں خوش آمدید!",
        reply_markup=reply_markup
    )

async def leaderboard(update: Update, context: ContextTypes.DEFAULT_TYPE):
    leaderboard_text = """
🏆 Top Players:
1. Ali - 5000
2. Fatima - 4500
3. Hassan - 4000
    """
    await update.message.reply_text(leaderboard_text)

if __name__ == '__main__':
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("leaderboard", leaderboard))
    app.run_polling()
```

---

## 🎮 گیم Mechanics

### Gameplay:
- ✓ 6×6 grid میں کینڈیز ہیں
- ✓ دو adjacent کینڈیز کو swap کریں
- ✓ 3+ کی matching سے points ملیں
- ✓ خودکار fall اور refill
- ✓ Cascade matches سے bonus points

### Scoring:
- Basic Match: **10 points**
- Cascade Bonus: **15-20 points** (بڑھتے ہوئے)
- Level Up: **500+ points** پر

### Game End:
- جب **20 moves** ختم ہو جائیں
- Final score دکھایا جائے
- Leaderboard میں share کریں

---

## 🔧 Customization

### Colors بدلیں
**app.js میں:**
```javascript
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'];
```

### Grid Size بدلیں
```javascript
const GRID_SIZE = 8;  // 8x8 grid
```

### Initial Moves بدلیں
```javascript
const INITIAL_MOVES = 30;  // 30 moves
```

### Difficulty Levels شامل کریں
```javascript
const DIFFICULTY = {
    EASY: { moves: 30, grid: 5 },
    MEDIUM: { moves: 20, grid: 6 },
    HARD: { moves: 15, grid: 7 }
};
```

---

## 📊 Database (اختیاری)

### MongoDB سیٹ اپ:

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: String,
    username: String,
    score: Number,
    level: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
```

### Save Score:
```javascript
app.post('/api/save-score', async (req, res) => {
    const { telegramId, score, level } = req.body;
    
    let user = await User.findOne({ telegramId });
    
    if (!user) {
        user = new User({ telegramId, score, level });
    } else if (score > user.score) {
        user.score = score;
        user.level = level;
    }
    
    await user.save();
    res.json({ success: true });
});
```

---

## 📱 File Structure

```
candy-crush/
│
├── index.html          # Main HTML
├── app.js              # Game Logic
├── styles.css          # Styling
├── server.js           # Node.js Server
├── package.json        # Dependencies
├── .env.example        # Environment Template
├── README.md           # یہ فائل
│
└── public/             # Static files (optional)
    └── images/
```

---

## 🚀 Deploy Commands

### Vercel
```bash
npm install -g vercel
vercel
```

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### GitHub Pages
```bash
git push origin main
# Settings → Pages → Deploy from main branch
```

---

## 🐛 Troubleshooting

### Port already in use?
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Bot token invalid?
- @BotFather سے نیا token لیں
- `.env` میں ڈالیں

### Mini App نہیں کھل رہا?
- URL کو `/start` کے ساتھ جانچیں
- Telegram web app sandbox میں ہے

---

## 📈 اگلے Steps

1. ✅ Database شامل کریں (MongoDB)
2. ✅ Leaderboard بنائیں
3. ✅ Sound effects شامل کریں
4. ✅ Power-ups شامل کریں
5. ✅ Multiplayer mode
6. ✅ Daily challenges

---

## 📄 License

MIT License - آزادی سے استعمال کریں!

---

## 💬 Support

کوئی مسئلہ؟ یہاں چیک کریں:
- [Telegram Bot API Docs](https://core.telegram.org/bots/api)
- [Telegram Mini Apps Docs](https://core.telegram.org/bots/webapps)
- [Express.js Guide](https://expressjs.com)

---

## 🎉 شامل ہوں

اپنے دوستوں کو شیئر کریں اور Leaderboard میں اپنا نام بنائیں! 🏆

**Happy Gaming! 🍬🎮**