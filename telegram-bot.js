/**
 * 🤖 Telegram Bot - Candy Crush Mini App
 * 
 * استعمال:
 * 1. node-telegram-bot-api install کریں: npm install node-telegram-bot-api
 * 2. اپنا TOKEN شامل کریں
 * 3. چلائیں: node telegram-bot.js
 */

const TelegramBot = require('node-telegram-bot-api');

// اپنا Token یہاں ڈالیں
// @BotFather سے TOKEN لیں
const TOKEN = 'YOUR_BOT_TOKEN_HERE';
const APP_URL = 'https://your-app-url.vercel.app'; // اپنی Vercel URL

// Bot بنائیں
const bot = new TelegramBot(TOKEN, { polling: true });

console.log('🤖 Telegram Bot شروع ہو گیا!');

// ===============================
// 🎮 /start Command
// ===============================
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;

    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '🎮 گیم کھیلیں',
                        web_app: { url: APP_URL }
                    }
                ],
                [
                    {
                        text: '🏆 Leaderboard',
                        callback_data: 'leaderboard'
                    }
                ],
                [
                    {
                        text: '📖 کیسے کھیلیں',
                        callback_data: 'help'
                    }
                ]
            ]
        }
    };

    bot.sendMessage(
        chatId,
        `سلام ${firstName}! 👋\n\n🍬 <b>Candy Crush Mini App میں خوش آمدید!</b>\n\nگیم شروع کرنے کے لیے نیچے کا بٹن دبائیں:`,
        {
            parse_mode: 'HTML',
            reply_markup: keyboard.reply_markup
        }
    );
});

// ===============================
// 🎮 /play Command
// ===============================
bot.onText(/\/play/, (msg) => {
    const chatId = msg.chat.id;

    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '🎮 اب کھیلیں',
                        web_app: { url: APP_URL }
                    }
                ]
            ]
        }
    };

    bot.sendMessage(
        chatId,
        '🍬 <b>Candy Crush Mini App</b>\n\n' +
        '3 یا اس سے زیادہ کینڈیز کو match کریں اور بڑے scores حاصل کریں!\n\n' +
        '⚡ محدود moves میں max score حاصل کریں۔\n\n' +
        'شروع کریں:',
        {
            parse_mode: 'HTML',
            reply_markup: keyboard.reply_markup
        }
    );
});

// ===============================
// 🏆 /leaderboard Command
// ===============================
bot.onText(/\/leaderboard/, (msg) => {
    const chatId = msg.chat.id;

    // یہاں اپنا database سے data لیں
    const leaderboard = `
🏆 <b>Top Players</b> 🏆

<b>1. 🥇 Ali</b> - 5000 points
<b>2. 🥈 Fatima</b> - 4500 points
<b>3. 🥉 Hassan</b> - 4000 points
<b>4. Muhammad</b> - 3500 points
<b>5. Ayesha</b> - 3000 points

... اور بہت سے دوسرے!

💪 <i>اگلے ہفتے آپ یہاں ہو سکتے ہیں!</i>
    `;

    bot.sendMessage(chatId, leaderboard, { parse_mode: 'HTML' });
});

// ===============================
// 📖 /help Command
// ===============================
bot.onText(/\/help|\/start.*help/, (msg) => {
    const chatId = msg.chat.id;

    const helpText = `
🎮 <b>Candy Crush - کیسے کھیلیں</b>

<b>📋 بنیادی Rules:</b>
✓ 6×6 grid میں candies ہیں
✓ دو adjacent (قریبی) candies کو swap کریں
✓ 3 یا اس سے زیادہ same color کو match کریں
✓ ہر match سے points ملیں

<b>🎯 Scoring:</b>
• 3 Candies = 10 points
• 4 Candies = 20 points
• 5 Candies = 50 points
• Cascade = Extra Bonus!

<b>⚡ Moves:</b>
آپ کے پاس 20 moves ہیں۔
زیادہ سے زیادہ score بنانے کی کوشش کریں!

<b>🏆 Levels:</b>
500 points = Level 2
1000 points = Level 3
... اور بہت سے!

<b>💡 Tips:</b>
• Match کریں جو cascade کو trigger کریں
• اپنے moves کو سوچ سمجھ کر استعمال کریں
• بڑے matches کے لیے انتظار کریں

شروع کرنے کے لیے /start دبائیں!
    `;

    bot.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
});

// ===============================
// 📊 /stats Command
// ===============================
bot.onText(/\/stats/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const firstName = msg.from.first_name;

    // یہاں اپنا database query لگائیں
    const stats = `
📊 <b>آپ کے Statistics</b>

<b>👤 Player:</b> ${firstName}
<b>📍 ID:</b> ${userId}

<b>🎮 Games Played:</b> 15
<b>🏆 Best Score:</b> 2500
<b>📈 Avg Score:</b> 1800
<b>⏱️ Total Time:</b> 3 hours

<b>🎯 Next Goal:</b> 5000 points!

/leaderboard سے دیکھیں کہ آپ کہاں ہیں!
    `;

    bot.sendMessage(chatId, stats, { parse_mode: 'HTML' });
});

// ===============================
// 📨 Web App Data Receipt
// ===============================
bot.on('web_app_data', (msg) => {
    const chatId = msg.chat.id;
    const data = msg.web_app_data.data;

    try {
        const result = JSON.parse(data);
        const { score, level } = result;

        bot.sendMessage(
            chatId,
            `✅ <b>Score محفوظ ہو گیا!</b>\n\n` +
            `🎯 Score: <b>${score}</b>\n` +
            `📈 Level: <b>${level}</b>\n\n` +
            `شاندار کھیل! 🎉`,
            { parse_mode: 'HTML' }
        );

        // یہاں database میں save کریں
        console.log(`[${new Date().toISOString()}] User ${msg.from.id} - Score: ${score}, Level: ${level}`);
    } catch (error) {
        bot.sendMessage(chatId, '❌ Data save نہیں ہو سکا۔');
        console.error('Error:', error);
    }
});

// ===============================
// 📱 Inline Buttons Callback
// ===============================
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'leaderboard') {
        bot.deleteMessage(chatId, query.message.message_id);
        bot.answerCallbackQuery(query.id, 'Leaderboard کھول رہے ہیں...');
        
        // /leaderboard call کریں
        const fakeMsg = { chat: { id: chatId }, from: { first_name: 'User' } };
        bot.onText(/\/leaderboard/, (msg) => {
            const leaderboard = '🏆 <b>Top Players</b>\n\n1. Ali - 5000\n2. Fatima - 4500\n3. Hassan - 4000';
            bot.sendMessage(chatId, leaderboard, { parse_mode: 'HTML' });
        });
    } else if (data === 'help') {
        bot.deleteMessage(chatId, query.message.message_id);
        bot.answerCallbackQuery(query.id);
        
        const helpText = '📖 <b>کیسے کھیلیں:</b>\n\n' +
            '✓ Adjacent candies کو swap کریں\n' +
            '✓ 3+ match کریں\n' +
            '✓ Max score بنائیں!';
        bot.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
    }
});

// ===============================
// ❌ Error Handling
// ===============================
bot.on('error', (error) => {
    console.error('❌ Bot Error:', error.code);
});

bot.on('polling_error', (error) => {
    console.error('⚠️ Polling Error:', error.message);
});

// ===============================
// 📝 Random Tips
// ===============================
setInterval(() => {
    const tips = [
        '💡 بہت سے cascades کے لیے چھوٹے combinations کو مت ملائیں!',
        '💡 اپنے moves کو حکمت سے استعمال کریں۔',
        '💡 بڑے matches سے زیادہ points ملیں!',
        '💡 Leaderboard میں اپنا نام دیکھیں!'
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    console.log(`\n📢 Tip: ${randomTip}`);
}, 300000); // ہر 5 منٹ میں

// ===============================
// Server Status
// ===============================
console.log(`
╔════════════════════════════════════════════╗
║   🍬 Candy Crush Telegram Bot - Active! 🍬  ║
║                                            ║
║   Bot Commands:                            ║
║   /start - شروع کریں                      ║
║   /play - گیم کھیلیں                       ║
║   /leaderboard - Top players دیکھیں       ║
║   /help - مدد                              ║
║   /stats - آپ کے stats                     ║
║                                            ║
║   Bot Link:                                ║
║   https://t.me/candy_crush_YOUR_NAME_bot   ║
╚════════════════════════════════════════════╝
`);

// Export for external use
module.exports = bot;
