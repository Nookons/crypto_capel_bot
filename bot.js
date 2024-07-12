require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const {handleStart} = require("./bot/handleStart");
const {handleAddProject} = require("./bot/AddProject/AddProject");
const {doc, setDoc, updateDoc} = require("firebase/firestore");
const {db} = require("./firebase");
const dayjs = require("dayjs");
const {handleEditProject} = require("./bot/editProjects");
const {observeMessage} = require("./bot/observeMessages");
<<<<<<< HEAD
const {editProjects} = require("./bot/EditProjects/Edit");
=======
>>>>>>> f9dd5fa0a1791ad7913901e143c25df50cacdd5c

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

<<<<<<< HEAD
    editProjects(userState, callBack)
=======
    switch (userState.state) {
        case "edit":
            userState.state = "pending_option_to_change"
            changeObject.path = callBack.toString();

            bot.sendMessage(chatId, `Что вы хотите изменить!`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Название', callback_data: 'name'}, {text: 'Описание', callback_data: 'description'}],
                        [{text: 'Реф ссылку', callback_data: 'ref_link'}]
                    ]
                }
            });
            break
        case "pending_option_to_change":
            userState.state = "pending_user_change"
            changeObject.updateType = callBack;
            bot.sendMessage(chatId, `Отправь мне новые данные и я их изменню`);
            break
        default:
            bot.sendMessage(chatId, `Что-то пошло не так, обратитесь к Димке!`);
            break
    }

    if (userState.state === "edit") {
        userState.state = "pending_option_to_change"
        userState.id = callBack;


    }
>>>>>>> f9dd5fa0a1791ad7913901e143c25df50cacdd5c
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

    if (msg.from.username === "Nookon") {
        bot.setMyCommands([
            {command: "/start", description: "Start"},
            {command: "/add_project", description: "Add new project"},
            {command: "/edit_project", description: "Edit project"},
        ])
    }


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
