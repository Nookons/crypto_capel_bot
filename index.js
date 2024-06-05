const TelegramBot = require('node-telegram-bot-api');

const token     = '7444141672:AAE1NAQiU1jbTGYacwTtJure0YAXp6fn95k';
const webAppUrl = 'https://crypto-capel-bot.vercel.app/';
const bot       = new TelegramBot(token, {polling: true});

//nodemon index.js

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (msg.text === "/start") {
        await bot.sendMessage(chatId, "Просто нажми запустить по кнопке ниже...", {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Test...', web_app: { url: webAppUrl }}]
                ]
            }
        });
    }
});