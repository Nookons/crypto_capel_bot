const {doc, setDoc} = require("firebase/firestore");
const {db} = require("../firebase");

async function observeMessage(msg) {
    try {
        const data = {
            message_id: msg.message_id,
            from: msg.from || {},  // Заменяем undefined на пустой объект, если msg.from не определен
            chat: msg.chat || {},  // Заменяем undefined на пустой объект, если msg.chat не определен
            date: msg.date || 0,   // Заменяем undefined на 0, если msg.date не определен
            text: msg.text || '',  // Заменяем undefined на пустую строку, если msg.text не определен
            caption: msg.caption || '',  // Заменяем undefined на пустую строку, если msg.text не определен
            photo: msg.photo || [], // Заменяем undefined на пустой массив, если msg.photo не определен
        };

        const docRef = doc(db, 'channelPosts', msg.message_id.toString());
        await setDoc(docRef, data);
        console.error('Find new post from chanel');
    } catch (error) {
        console.error('Error updating/setting user document:', error);
    }
}

module.exports = {
    observeMessage
};