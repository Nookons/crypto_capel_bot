const { setDoc, doc } = require('firebase/firestore');
const { db } = require('../../firebase');
const dayjs = require('dayjs');
const { addPostWithCustomPhotoToProject } = require("../createPostTOChanel");
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('../../firebase'); // предполагаем, что storage инициализирован в этом файле

const addProject = async (bot, msg, userGlobalStates) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    const userState = userGlobalStates[chatId] || {};
    userGlobalStates[chatId] = userState; // Ensure userState is saved in userGlobalStates

    if (userState.state === "add") {
        if (!userState.localState) {
            userState.localState = "start";
        }
    }

    if (!msg.text) {
        if (userState.localState === "awaiting_project_photo") {
            const photos = msg.photo;
            const largestPhoto = photos[photos.length - 1];

            const fileId = largestPhoto.file_id;
            const file = await bot.getFile(fileId);
            const filePath = file.file_path;

            const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${filePath}`;

            try {
                const response = await fetch(fileUrl);
                const blob = await response.blob();

                const storageRef = ref(storage, `projects/${fileId}.jpg`);
                await uploadBytes(storageRef, blob);
                const downloadURL = await getDownloadURL(storageRef);

                userState.project.imgPath = downloadURL;
                userState.project.fileId = fileId;

                const template = {
                    id: Date.now(),
                    likes: 0,
                    tags: [],
                    userLiked: [],
                    createdTime: dayjs().format("YYYY-MM-DD HH:mm"),
                    updatedTime: dayjs().format("YYYY-MM-DD HH:mm"),
                    ...userState.project
                };

                const userDocRef = doc(db, "projects", template.id.toString());
                await setDoc(userDocRef, template);

                await bot.sendMessage(chatId, `Проект успешно добавлен!`);
            } catch (error) {
                console.error("Error updating/setting user document:", error);
                await bot.sendMessage(chatId, `Произошла ошибка при сохранении проекта. Попробуйте снова.`);
            }

            userState.state = 'default';
            userState.project = {};

        } else {
            await bot.sendMessage(chatId, `Сейчас мне не нужно фото. Добавь что прошу више`);
        }
    } else {
        switch (userState.localState) {
            case 'start':
                userState.localState = 'awaiting_project_name';
                await bot.sendMessage(chatId, `Давай начнём с названия проекта...`);
                break;

            case 'awaiting_project_name':
                userState.project = { name: text };
                userState.localState = 'awaiting_project_description';
                await bot.sendMessage(chatId, `Название проекта сохранено. Теперь отправь мне описание проекта...`);
                break;

            case 'awaiting_project_description':
                userState.project.description = text;
                userState.localState = 'awaiting_project_link';
                await bot.sendMessage(chatId, `Описание проекта сохранено. Теперь отправь мне реферальную ссылку на проект...`);
                break;

            case 'awaiting_project_link':
                userState.project.link = text;
                userState.localState = 'awaiting_project_type';
                await bot.sendMessage(chatId, `Реферальная ссылка проекта сохранена. Теперь загрузи мне типы проекта как в примере altcoin / Token / stablecoin / NFT / DEFI`);
                break;

            case 'awaiting_project_type':
                userState.project.tags = text;
                userState.localState = 'awaiting_project_photo';
                await bot.sendMessage(chatId, `Реферальная ссылка проекта сохранена. Теперь загрузи мне фото проекта...`);
                break;

            default:
                await bot.sendMessage(chatId, `Неизвестная команда или ввод. Попробуйте снова.`);
                break;
        }
    }
};

module.exports = {
    handleAddProject: addProject
};
