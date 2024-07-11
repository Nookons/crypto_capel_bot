const {collection, query, where, getDocs} = require("firebase/firestore");
const {db} = require("../firebase");
const dayjs = require("dayjs");
const {addPostWithCustomPhotoToProject} = require("./createPostTOChanel");
const userStates = {};

const handleEditProject = async (bot, msg, userGlobalStates) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    const projects = [];

    if (!userStates[chatId]) {
        userStates[chatId] = {
            state: "default"
        };
    }

    try {
        const q = query(collection(db, "projects"));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            projects.push(doc.data())
        });
    } catch (error) {
        console.error(error)
    }

    await bot.sendMessage(chatId, `Пожайлуста выберите проект, ${msg.from.username}!`, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: projects.map(el => {
                return [{ text: el.name, callback_data: el.name }];  // Assuming each project has a unique id
            })
        }
    });

};

module.exports = {
    handleEditProject
};