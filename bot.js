const TelegramBot = require('node-telegram-bot-api');
const dayjs = require("dayjs");
const { setDoc, doc } = require("firebase/firestore");
const db = require("./firebase");

const token = '7444141672:AAE1NAQiU1jbTGYacwTtJure0YAXp6fn95k';
const webAppUrl = 'https://crypto-capel-bot.vercel.app/';
const bot = new TelegramBot(token, {polling: true});

const userStates = {};

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    if (!userStates[userId]) {
        userStates[userId] = {
            state: 'default',
            project: {}
        };
    }

    const userState = userStates[userId];

    switch (text) {
        case "/start":
            userState.state = 'default';
            await bot.sendMessage(chatId, `Hello, ${msg.from.username}!`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Launch', web_app: { url: webAppUrl } }]
                    ]
                }
            });
            break;

        case "/add_project":
            userState.state = 'awaiting_project_name';
            await bot.sendMessage(chatId, `Давай начнём с названия проекта...`);
            break;

        default:
            switch (userState.state) {
                case 'awaiting_project_name':
                    userState.project.name = text;
                    userState.state = 'awaiting_project_description';
                    await bot.sendMessage(chatId, `Название проекта сохранено. Теперь отправь мне описание проекта...`);
                    break;

                case 'awaiting_project_description':
                    userState.project.description = text;
                    userState.state = 'awaiting_project_link';
                    await bot.sendMessage(chatId, `Описание проекта сохранено. Теперь отправь мне реферальну ссылку на проект...`);
                    break;

                case 'awaiting_project_link':
                    userState.project.link = text;
                    userState.state = 'awaiting_project_photo';
                    await bot.sendMessage(chatId, `Описание проекта сохранено. Теперь отправь мне фото проекта...`);
                    break;

                case 'awaiting_project_photo':
                    userState.project.imgPath = text;
                    userState.state = 'default';

                    try {
                        const userDocRef = doc(db, "projects", userState.project.name);
                        await setDoc(userDocRef, {
                            id: Date.now(),
                            likes: 0,
                            createdTime: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm"),
                            updatedTime: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm"),
                            ...userState.project
                        });

                        await bot.sendMessage(chatId, `Проект успешно добавлен!`);
                    } catch (error) {
                        console.error("Error updating/setting user document:", error);
                        await bot.sendMessage(chatId, `Произошла ошибка при сохранении проекта. Попробуйте снова.`);
                    }

                    userState.project = {};
                    break;

                default:
                    await bot.sendMessage(chatId, `Неизвестная команда или ввод. Попробуйте снова.`);
                    break;
            }
            break;
    }
});
