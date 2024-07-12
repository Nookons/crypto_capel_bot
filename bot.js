require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const {handleStart} = require("./bot/handleStart");
const {handleAddProject} = require("./bot/AddProject/AddProject");
const {doc, setDoc, updateDoc} = require("firebase/firestore");
const {db} = require("./firebase");
const dayjs = require("dayjs");
const {handleEditProject} = require("./bot/editProjects");
const {observeMessage} = require("./bot/observeMessages");
const {editProjects} = require("./bot/EditProjects/Edit");

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

const userGlobalStates  = {};
const changeObject      = {};
const channelId      = '-1002243510504';


bot.on('callback_query', callBackMsg => {
    const msg = callBackMsg.message;
    const chatId = msg.chat.id;
    const callBack = callBackMsg.data;

    const userState = userGlobalStates[chatId]

    editProjects(userState, callBack)
});


bot.on('channel_post', (msg) => {
    if (msg.chat.id.toString() === channelId) {
        observeMessage(msg)
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

    if (!userGlobalStates[chatId]) {
        userGlobalStates[chatId] = {
            state: ""
        };
    }

    const userState = userGlobalStates[chatId];

    switch (text) {
        case "/start":
            userState.state = "";
            handleStart(bot, msg);
            break;
        case "/add_project":
            userState.state = 'add';
            break;
        case "/edit_project":
            userState.state = 'edit';
            break;
    }

    switch (userState.state) {
        case "add":
            handleAddProject(bot, msg, userGlobalStates);
            break;
        case "edit":
            handleEditProject(bot, msg, userGlobalStates);
            break;

        case "pending_user_change":
            userState.state = ""

            switch (changeObject.updateType) {
                case "name":
                    changeObject.name = text
                    break
                case "description":
                    changeObject.description = text
                    break
                case "ref_link":
                    changeObject.link = text
                    break
            }

            console.log(text);

            try {
                const updateRef = doc(db, "projects", changeObject.id);

                console.log(updateRef);

                updateDoc(updateRef, {
                    ...changeObject
                });
            } catch (err) {
                console.log(err);
            }
            break
    }
});

module.exports = {
    userGlobalStates
};
