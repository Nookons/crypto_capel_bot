const { setDoc, doc } = require('firebase/firestore');
const { db } = require('../firebase');
const dayjs = require('dayjs');

const userStates = {};
const channelId = '-1002243510504';


const addPostWithCustomPhotoToProject = async (bot, msg, userState) => {
    const chatId = msg.chat.id;
    const project = userState.project;
    const fileId = userState.project.fileId;


    try {
        // Текст сообщения с описанием проекта
        const formattedDate = dayjs().format('DD/MM/YYYY');
        const message = `
    <b>Новий проєкт додано в наш бот!</b> 🌟
            
<b>Назва проєкту:</b> ${project.name}
<b>Опис проєкту:</b> <i>${project.description}</i>
            
📅 ${formattedDate}
`;

        await bot.sendPhoto(channelId, fileId, {
            parse_mode: 'HTML',
            caption: message,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Open Bot', url: process.env.BOT_URL}]
                ]
            }
        });
        await bot.sendMessage(chatId, `Успешно отправлен пост в канал.`);
    } catch (error) {
        console.error(`Ошибка при отправке сообщения с изображением: ${error.message}`);
        await bot.sendMessage(chatId, `Произошла ошибка при отправке поста с изображением.`);
    }
};




module.exports = {
    addPostWithCustomPhotoToProject
};
