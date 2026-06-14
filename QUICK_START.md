# ⚡ فوری شروع - 10 منٹ میں Deploy کریں

## 🎯 آپ کا Goal: 
اپنی Telegram Mini App اپنی Bot میں کام کرتے ہوئے دیکھنا

---

## 📱 مرحلہ 1: Telegram Bot بنائیں (5 منٹ)

### Step 1.1: @BotFather کو کھولیں
```
Telegram میں یہ کریں:
1. Telegram کھولیں
2. تلاش میں "@BotFather" لکھیں
3. اسے کھولیں اور /start دبائیں
```

### Step 1.2: نیا Bot بنائیں
```
@BotFather کو یہ بھیجیں:
/newbot

پھر اپنے Bot کا نام دیں:
Candy Crush Mini App

پھر Username (یونیک):
candy_crush_YOUR_NAME_bot

آپ کو TOKEN ملے گا - اسے کہیں محفوظ رکھیں! 🔐
```

**TOKEN کی مثال:**
```
123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh
```

---

## 🌐 مرحلہ 2: App Deploy کریں - Vercel پر (3 منٹ)

### Step 2.1: GitHub اکاؤنٹ بنائیں
```
1. github.com پر جائیں
2. "Sign up" دبائیں
3. Email اور password سیٹ کریں
```

### Step 2.2: Repo بنائیں
```bash
# یہ اپنے کمپیوٹر پر چلائیں:

# سب files کو folder میں رکھیں اور اندر جائیں
cd candy-crush

# Git شروع کریں
git init

# Commit کریں
git add .
git commit -m "First commit"

# GitHub پر پش کریں
# (GitHub سے نیا repo بنائیں اور یہ کمانڈز چلائیں)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/candy-crush
git push -u origin main
```

### Step 2.3: Vercel سے Deploy کریں
```
1. vercel.com پر جائیں
2. "Sign up with GitHub" دبائیں
3. GitHub authorize کریں
4. "Import Project" دبائیں
5. اپنا candy-crush repo select کریں
6. "Deploy" دبائیں

⏳ رکو... 1-2 منٹ میں تیار ہو جائے گا!

✅ آپ کو ملے گا:
https://candy-crush-YOUR_NAME.vercel.app
```

**اس URL کو نوٹ کریں! ⭐**

---

## 🤖 مرحلہ 3: Bot میں Mini App شامل کریں (2 منٹ)

### Step 3.1: BotFather کو Mini App بتائیں

@BotFather کو یہ کمانڈز بھیجیں:

```
/mybots

→ اپنا bot select کریں

→ "Bot Settings" دبائیں

→ "Edit bot commands" (یا یہ آپشن دیکھیں)
```

### Step 3.2: Web App شامل کریں

```
/setmenu

→ اپنا bot select کریں

→ یہ لکھیں:
🎮 Play Game - /play
🏆 Leaderboard - /leaderboard

→ Done
```

### Step 3.3: Bot Code (اختیاری)

**اگر Python استعمال کر رہے ہوں:**

```python
# save as bot.py
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

# اپنا TOKEN یہاں ڈالیں
TOKEN = "123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh"
APP_URL = "https://candy-crush-YOUR_NAME.vercel.app"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[
        InlineKeyboardButton("🎮 کھیل کھیلیں", web_app={"url": APP_URL})
    ]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "🍬 Candy Crush میں خوش آمدید!\n\nگیم شروع کریں:",
        reply_markup=reply_markup
    )

async def leaderboard(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🏆 آنے والے ہفتے میں Leaderboard شامل ہوگی!"
    )

if __name__ == '__main__':
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("leaderboard", leaderboard))
    print("✅ Bot شروع ہو گیا!")
    app.run_polling()
```

**چلانے کے لیے:**
```bash
pip install python-telegram-bot
python bot.py
```

---

## ✅ یہ کام ہو گیا! 

### اپنی Bot کو ٹیسٹ کریں:

1. Telegram میں اپنی bot تلاش کریں: `@candy_crush_YOUR_NAME_bot`
2. `/start` دبائیں
3. "🎮 کھیل کھیلیں" بٹن دبائیں
4. وو! آپ کی Mini App کھل گئی! 🎉

---

## 🔧 اگر کوئی مسئلہ ہو؟

### Mini App نہیں کھل رہا?
```
✓ URL درست ہے؟ (https://... سے شروع ہو)
✓ Vercel میں deploy تھا؟
✓ BotFather میں URL update کیا؟
```

### Bot نہیں جواب دے رہا?
```
✓ TOKEN درست ہے؟
✓ Bot active ہے؟
✓ Python library installed ہے؟

pip install --upgrade python-telegram-bot
```

### Vercel میں Error؟
```
✓ Files درست position میں ہیں?
✓ server.js existing ہے?
✓ package.json موجود ہے?
```

---

## 🚀 اگلے Steps

اب کہ آپ کی app چل رہی ہے:

1. **Score Save کریں** - Database شامل کریں
2. **Leaderboard بنائیں** - دوستوں کو compete کرنے دیں
3. **Sound Effects** - Game کو ماحول دیں
4. **Power-ups** - مزے کے لیے special candies
5. **Share Feature** - دوستوں کے ساتھ score share کریں

---

## 💡 Pro Tips

```
✅ Regular updates دیں
✅ Bugs fix کریں quickly
✅ User feedback سنیں
✅ Leaderboard system شامل کریں
✅ Daily challenges دیں
✅ Telegram channel میں promote کریں
```

---

## 📚 Resources

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Vercel Docs](https://vercel.com/docs)
- [Express.js](https://expressjs.com)

---

## 🎊 Enjoy!

آپ کی Telegram Mini App اب Live ہے! 

**اپنے دوستوں کو بتائیں اور انہیں invite کریں!** 🎮🍬

---

### ❓ مزید سوالات؟

[README.md](README.md) پڑھیں مکمل documentation کے لیے۔

Happy Gaming! 🚀
