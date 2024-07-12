const {collection, query, where, getDocs} = require("firebase/firestore");
const {db} = require("../firebase");

const handleEditProject = async (bot, msg, userGlobalStates) => {
    const chatId         = msg.chat.id;
    const projects= [];


    try {
        const q = query(collection(db, "projects"));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            projects.push(doc.data())
        });
    } catch (error) {
        console.error(error)
    }

    await bot.sendMessage(chatId, `Пожайлуста выберите проект, ${msg.from.username}!`, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: projects.map(el => {
                return [{ text: el.name, callback_data: el.id }];
            })
        }
    });

};

module.exports = {
    handleEditProject
};