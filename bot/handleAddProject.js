const { setDoc, doc } = require('firebase/firestore');
const { db } = require('../firebase');
const dayjs = require('dayjs');
const { addPostWithCustomPhotoToProject} = require("./createPostTOChanel");

const userStates = {};

const handleAddProject = async (bot, msg, userGlobalStates, callBack) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;


    if (!userStates[chatId]) {
        userStates[chatId] = {
            state: "default"
        };
    }

    const userState = userStates[chatId];


    if (!msg.text) {
        if (userState.state === "awaiting_project_photo") {
            const photos = msg.photo;
            const largestPhoto = photos[photos.length - 1];

            const fileId = largestPhoto.file_id;
            const file = await bot.getFile(fileId);
            const filePath = file.file_path;

            const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${filePath}`;


            userState.project.imgPath = fileUrl;
            userState.project.fileId = fileId;

            const template = {
                id: Date.now(),
                likes: 0,
                userLiked: [],
                createdTime: dayjs().format("YYYY-MM-DD HH:mm"),
                updatedTime: dayjs().format("YYYY-MM-DD HH:mm"),
                ...userState.project
            }

            try {
                const userDocRef = doc(db, "projects", template.id.toString());
                await setDoc(userDocRef, {
                    ...template
                });

                await bot.sendMessage(chatId, `Проект успешно добавлен!`);
            } catch (error) {
                console.error("Error updating/setting user document:", error);
                await bot.sendMessage(chatId, `Произошла ошибка при сохранении проекта. Попробуйте снова.`);
            }

            addPostWithCustomPhotoToProject(bot, msg, userState)

            userState.state = 'default';
            userGlobalStates[userId].state = "";
            userState.project = {};

        } else {
            await bot.sendMessage(chatId, `Сейчас мне не нужно фото. Добавь что прошу више`);
        }
    }
    else {
        switch (userState.state) {
            case 'default':
                userState.state = 'awaiting_project_name';
                await bot.sendMessage(chatId, `Давай начнём с названия проекта...`);
                break;

            case 'awaiting_project_name':
                userState.project = { name: text };
                userState.state = 'awaiting_project_description';
                await bot.sendMessage(chatId, `Название проекта сохранено. Теперь отправь мне описание проекта...`);
                break;

            case 'awaiting_project_description':
                userState.project.description = text;
                userState.state = 'awaiting_project_link';
                await bot.sendMessage(chatId, `Описание проекта сохранено. Теперь отправь мне реферальную ссылку на проект...`);
                break;

            case 'awaiting_project_link':
                userState.project.link = text;
                userState.state = 'awaiting_project_photo';
                await bot.sendMessage(chatId, `Реферальная ссылка проекта сохранена. Теперь загрузи мне фото проекта...`);
                break;


            default:
                await bot.sendMessage(chatId, `Неизвестная команда или ввод. Попробуйте снова.`);
                break;
        }
    }
};

module.exports = {
    handleAddProject
};
