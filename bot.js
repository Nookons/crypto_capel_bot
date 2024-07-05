require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { handleStart } = require("./bot/handleStart");
const { handleAddProject } = require("./bot/handleAddProject");

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const userGlobalStates = {};

/*bot.on('callback_query', callBackMsg => {
    const msg = callBackMsg.message;
    const callBack = callBackMsg.data;

    handleAddProject(bot, msg, userGlobalStates, callBack)
});*/



bot.on('photo', (msg) => {
    if (userGlobalStates.state === "add") {
        handleAddProject(bot, msg, userGlobalStates);
    }
})

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    if (!userGlobalStates[userId]) {
        userGlobalStates[userId] = {
            state: ""
        };
    }

    const userState = userGlobalStates[userId];

    switch (text) {
        case "/start":
            userState.state = "";
            handleStart(bot, msg);
            break;
        case "/add_project":
            userState.state = 'add';
            break;
    }

    switch (userState.state) {
        case "add":
            handleAddProject(bot, msg, userGlobalStates);
            break;
    }
});

module.exports = {
    userGlobalStates
};
