const { doc, deleteDoc  } = require("firebase/firestore");
const {db} = require("../../firebase");

async function editProjects(bot, userState, callBack) {
    if (userState) {
        const chatId = userState.chatId;  // Assuming chatId is stored in userState
        switch (userState.state) {
            case "edit":
                userState.state = "pending_option_to_change";
                userState.objectToChange.id = callBack;

                bot.sendMessage(chatId, `Что вы хотите изменить!`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'Название', callback_data: 'name' },
                                { text: 'Описание', callback_data: 'description' }
                            ],
                            [{ text: 'Реф ссылку', callback_data: 'ref_link' }, { text: 'Удалить', callback_data: 'remove' }]
                        ]
                    }
                });
                break;

            case "pending_option_to_change":
                if (callBack === "remove") {
                    userState.state = "waiting_to_remove_answer";

                    bot.sendMessage(chatId, `Вы точно хотите удаить проект?!`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: 'Да', callback_data: 'yes' },
                                    { text: 'Нет', callback_data: 'no' }
                                ],
                            ]
                        }
                    });
                } else {
                    userState.state = "pending_user_change";
                    userState.objectToChange.updateType = callBack;
                    bot.sendMessage(chatId, `Отправь мне новые данные и я их изменю`);
                }
                break;

            case "waiting_to_remove_answer":
                switch (callBack) {
                    case "yes":
                        try {
                            await deleteDoc(doc(db, "projects", userState.objectToChange.id));
                            await bot.sendMessage(chatId, `Проект был удалён`);
                            userState.state = "";
                        } catch (err) {
                            bot.sendMessage(chatId, `Что-то пошло не так. ${err.toString()}`);
                            userState.state = "";
                        }
                        break
                    case "no":
                        bot.sendMessage(chatId, `Хорошо я не буду его удалять`);
                        break
                }
                break;

            default:
                bot.sendMessage(chatId, `Что-то пошло не так, обратитесь к Димке!`);
                break;
        }
    }
}

module.exports = {
    editProjects
};
