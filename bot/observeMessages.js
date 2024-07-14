const { doc, setDoc } = require("firebase/firestore");
const { db, storage } = require("../firebase");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");

async function uploadMessageImage(img_id, bot) {
    try {
        const file = await bot.getFile(img_id);
        const filePath = file.file_path;
        const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${filePath}`;

        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const storageRef = ref(storage, `messages/img/${img_id}.jpg`);
        await uploadBytes(storageRef, buffer);

        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

async function observeMessage(msg, bot) {
    try {
        let img_path = "";

        if (msg.photo) {
            const img_id = msg.photo[msg.photo.length - 1].file_id;
            img_path = await uploadMessageImage(img_id, bot);
        }

        const data = {
            message_id: msg.message_id,
            from: msg.from || {},
            chat: msg.chat || {},
            date: msg.date || 0,
            text: msg.text || '',
            caption: msg.caption || '',
            photo: msg.photo || [],
            poster_path: img_path,
        };

        const docRef = doc(db, 'channelPosts', msg.message_id.toString());
        await setDoc(docRef, data);
        console.log('Found new post from channel');
    } catch (error) {
        console.error('Error observing message:', error);
    }
}

module.exports = {
    observeMessage
};
