require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { handleStart } = require("./bot/handleStart");
const { handleAddProject } = require("./bot/handleAddProject");
const {doc, setDoc} = require("firebase/firestore");
const {db} = require("./firebase");
const dayjs = require("dayjs");

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const userGlobalStates = {};

/*bot.on('callback_query', callBackMsg => {
    const msg = callBackMsg.message;
    const callBack = callBackMsg.data;

    handleAddProject(bot, msg, userGlobalStates, callBack)
});*/

const channelId = '-1002243510504'; // Идентификатор вашего канала

async function addNewMessage(msg) {
    try {
        const data = {
            message_id: msg.message_id,
            from: msg.from || {},  // Заменяем undefined на пустой объект, если msg.from не определен
            chat: msg.chat || {},  // Заменяем undefined на пустой объект, если msg.chat не определен
            date: msg.date || 0,   // Заменяем undefined на 0, если msg.date не определен
            text: msg.text || '',  // Заменяем undefined на пустую строку, если msg.text не определен
            caption: msg.caption || '',  // Заменяем undefined на пустую строку, если msg.text не определен
            photo: msg.photo || [], // Заменяем undefined на пустой массив, если msg.photo не определен
            imgPaths: imgPaths || [] // Заменяем undefined на пустой массив, если msg.photo не определен
        };

        const docRef = doc(db, 'channelPosts', msg.message_id.toString());
        await setDoc(docRef, data);
    } catch (error) {
        console.error('Error updating/setting user document:', error);
    }
}

bot.on('channel_post', (msg) => {
    if (msg.chat.id.toString() === channelId) {
        addNewMessage(msg)
    }
});


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
