const dayjs = require("dayjs");
const { collection, query, getDocs } = require("firebase/firestore");
const { getFirestore } = require("firebase/firestore");

const userStates = {};

const handleStart = async (bot, msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    if (!userStates[chatId]) {
        userStates[chatId] = {};
    }

    switch (text) {
        case "/start":
            userStates[userId].state = 'default';
            await bot.sendMessage(chatId, `Hello, ${msg.from.username}!`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Launch', web_app: { url: process.env.WEB_APP_URL } }]
                    ]
                }
            });
            break;

        default:
            await bot.sendMessage(chatId, `Hello, ${msg.from.username}!`);
    }
};

module.exports = {
    handleStart
};
