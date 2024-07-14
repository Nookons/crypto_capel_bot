const dayjs = require('dayjs');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage, db } = require('../../firebase');
const { setDoc, doc } = require('firebase/firestore');

const addProject = async (bot, msg, userGlobalStates) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Инициализация состояния пользователя, если оно не определено
    if (!userGlobalStates[chatId]) {
        userGlobalStates[chatId] = {
            state: 'add',
            project: {
                name: '',
                description: '',
                link: '',
                tags: ''
            },
            localState: 'start'
        };
    }

    let userState = userGlobalStates[chatId];

    // Обработка фото проекта
    if (msg.photo && userState.localState === 'awaiting_project_photo') {
        const photos = msg.photo;
        const largestPhoto = photos[photos.length - 1];

        const fileId = largestPhoto.file_id;
        const file = await bot.getFile(fileId);
        const filePath = file.file_path;

        const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${filePath}`;

        // Получение данных файла и загрузка в Firebase Storage
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const storageRef = ref(storage, `projects/img/${fileId}.jpg`);

        try {
            // Очистка состояния пользователя после успешной загрузки
            userState.state = '';
            userState.localState = '';

            const snapshot = await uploadBytes(storageRef, buffer);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Сохранение данных проекта в Firestore
            const template = {
                id: Date.now().toString(), // Используем строку для идентификатора
                createdAt: dayjs().format('DD/MM/YYYY'),
                userLiked: [],
                likes: 0,
                ...userState.project,
                imgPath: downloadURL, // Добавляем URL загруженного изображения
                fileId: fileId // Сохраняем идентификатор файла
            };

            await setDoc(doc(db, 'projects', template.id), {
                ...template
            });

            await bot.sendMessage(chatId, `Проект был добавлен`);
        } catch (error) {
            console.error("Ошибка при загрузке файла:", error);
            await bot.sendMessage(chatId, `Произошла ошибка при загрузке фото проекта. Попробуйте снова.`);
        }
    } else if (msg.text) {
        // Обработка текстовых сообщений пользователя
        switch (userState.localState) {
            case 'start':
                userState.localState = 'awaiting_project_name';
                await bot.sendMessage(chatId, `Давайте начнём... Отправьте мне название проекта.`);
                break;

            case 'awaiting_project_name':
                userState.project.name = text;
                userState.localState = 'awaiting_project_description';
                await bot.sendMessage(chatId, `Название проекта сохранено. Теперь отправьте описание проекта.`);
                break;

            case 'awaiting_project_description':
                userState.project.description = text;
                userState.localState = 'awaiting_project_link';
                await bot.sendMessage(chatId, `Описание проекта сохранено. Теперь отправьте реферальную ссылку на проект.`);
                break;

            case 'awaiting_project_link':
                userState.project.link = text;
                userState.localState = 'awaiting_project_type';
                await bot.sendMessage(chatId, `Реферальная ссылка проекта сохранена. Теперь отправьте тип проекта (например, altcoin / Token / stablecoin / NFT / DEFI).`);
                break;

            case 'awaiting_project_type':
                userState.project.tags = text;
                userState.localState = 'awaiting_project_photo';
                await bot.sendMessage(chatId, `Тип проекта сохранён. Теперь загрузите фото проекта.`);
                break;

            default:
                await bot.sendMessage(chatId, `Неизвестная команда или ввод. Пожалуйста, попробуйте снова.`);
                break;
        }
    } else {
        // Сообщение об ошибке при неожиданном вводе пользователя
        await bot.sendMessage(chatId, `Извините, я не могу обработать ваш запрос. Попробуйте ещё раз.`);
    }
};

module.exports = {
    addProject
};
