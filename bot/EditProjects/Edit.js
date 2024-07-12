async function editProjects(userState, callBack) {
    switch (userState.state) {
        case "edit":
            userState.state = "pending_option_to_change"
            changeObject.id = callBack;

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
}

module.exports = {
    editProjects
}