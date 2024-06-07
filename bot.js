const TelegramBot = require('node-telegram-bot-api');

const token     = '7444141672:AAE1NAQiU1jbTGYacwTtJure0YAXp6fn95k';
const webAppUrl = 'https://crypto-capel-bot.vercel.app/';
const bot       = new TelegramBot(token, {polling: true});


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    console.log(msg)

    if (msg.text === "/start") {
        await bot.sendMessage(chatId, `Hello,${msg.from.username}! <br> `, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Launch ', web_app: { url: webAppUrl }}]
                ]
            }
        });
    }
});