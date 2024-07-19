require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const {handleStart} = require("./bot/handleStart");
const {handleAddProject, addProject} = require("./bot/AddProject/AddProject");
const {doc, updateDoc, query, collection, onSnapshot, getDoc, arrayUnion} = require("firebase/firestore");
const {db} = require("./firebase");
const {handleEditProject} = require("./bot/editProjects");
const {observeMessage} = require("./bot/observeMessages");
const {editProjects} = require("./bot/EditProjects/Edit");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
const {checkClaimStart} = require("./bot/Claim/CheckClaim");

dayjs.extend(relativeTime);

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

const userGlobalStates = {};
const channelId = '-1002243510504';

const removeNeed = async ({ project, user }) => {
    const userRef = doc(db, "users", "user_" + user.id);
    const newArray = user.needClaim.filter(item => item !== project.id);  // Filter out the project.id

    await updateDoc(userRef, { needClaim: newArray });
}

checkClaimStart(bot);  // Call function to start observe on projects claim


bot.on('callback_query', callBackMsg => {
    const msg = callBackMsg.message;
    const chatId = msg.chat.id;
    const callBack = callBackMsg.data;

    if (!userGlobalStates[chatId]) {
        userGlobalStates[chatId] = {
            state: "",
            objectToChange: {},
            chatId: chatId
        };
    }

    const userState = userGlobalStates[chatId];
    editProjects(bot, userState, callBack);
});

// Observe messages in a specific channel
bot.on('channel_post', (msg) => {
    if (msg.chat.id.toString() === channelId) {
        observeMessage(msg, bot);
    }
});

// Handle photo messages
bot.on('photo', (msg) => {
    const chatId = msg.chat.id;
    if (userGlobalStates[chatId]?.state === "add") {
        handleAddProject(bot, msg, userGlobalStates);
    }
});

// Handle text messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    if (!userGlobalStates[chatId]) {
        userGlobalStates[chatId] = {
            state: "",
            objectToChange: {},
            project: {},
            chatId: chatId
        };
    }

    const userState = userGlobalStates[chatId];

    if (msg.from.username === "Nookon") {
        bot.setMyCommands([
            {command: "/start", description: "Start"},
            {command: "/add_project", description: "Add new project"},
            {command: "/edit_project", description: "Edit project"},
        ]);
    }

    switch (text) {
        case "/start":
            userState.state = "";
            handleStart(bot, msg);
            break;
        case "/add_project":
            userState.state = 'add';
            userState.localState = 'start';
            break;
        case "/edit_project":
            userState.state = 'edit';
            break;
    }

    switch (userState.state) {
        case "add":
            addProject(bot, msg, userGlobalStates);
            break;
        case "edit":
            handleEditProject(bot, msg, userGlobalStates);
            break;
        case "pending_user_change":
            handlePendingUserChange(userState, text, bot, chatId);
            break;
    }
});

// Handle pending user changes
async function handlePendingUserChange(userState, newText, bot, chatId) {
    userState.state = "";

    switch (userState.objectToChange.updateType) {
        case "name":
            userState.objectToChange.name = newText;
            break;
        case "description":
            userState.objectToChange.description = newText;
            break;
        case "ref_link":
            userState.objectToChange.link = newText;
            break;
    }

    try {
        const updateRef = doc(db, "projects", userState.objectToChange.id);
        console.log(updateRef);

        await updateDoc(updateRef, {
            ...userState.objectToChange
        });

        await bot.sendMessage(chatId, `Данные были успешно сохранены`);
        userState.objectToChange = {};

    } catch (err) {
        console.error(err);
        await bot.sendMessage(chatId, `Произошла ошибка: ${err.toString()}. Пожалуйста, попробуйте снова.`);
        userState.objectToChange = {};
    }
}

module.exports = {
    userGlobalStates
};
