const {query, collection, onSnapshot, doc, getDoc, updateDoc} = require("firebase/firestore");
const {db} = require("../../firebase");
const dayjs = require("dayjs");

const setupRealTimeListeners = (bot) => {
    const q = query(collection(db, "users"));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        for (const userDoc of querySnapshot.docs) {
            if (userDoc.exists()) {
                const user = userDoc.data();
                const needArr = user.claim;

                if (needArr) {
                    for (const need of needArr) {
                        const timestamp = dayjs();
                        const end_claim = need.endClaim;

                        const endClaimDate = dayjs(end_claim);

                        if (endClaimDate.isBefore(timestamp)) {
                            const projRef = doc(db, "projects", need.id.toString());
                            const docSnap = await getDoc(projRef);
                            const updateRef = doc(db, "users", "user_" + user.id);

                            const userSnap = await getDoc(updateRef);
                            if (userSnap.exists()) {
                                let userData = userSnap.data();

                                if (Array.isArray(userData.claim)) {

                                    userData.projects = userData.claim.map(project => {
                                        if (project.id === need.id) {
                                            if (project.isShowed) {
                                                return project
                                            } else {
                                                if (docSnap.exists()) {
                                                    const project = docSnap.data();
                                                    bot.sendPhoto(user.id, project.imgPath, {caption: `
                                                        Привет, пришло время забрать монеты в ${project.name}`,
                                                        parse_mode: 'HTML',
                                                        reply_markup: {
                                                            inline_keyboard: [
                                                                [{ text: 'Launch', web_app: { url: process.env.WEB_APP_URL } }]
                                                            ]
                                                        }
                                                    });
                                                }
                                                return { ...project, isShowed: true };
                                            }
                                        }
                                        return project;
                                    });

                                    await updateDoc(updateRef, {
                                        claim: userData.projects,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    });
};

const checkClaimStart = (bot) => {
    setInterval(() => {
        setupRealTimeListeners(bot);
    }, 60000);
};

module.exports = {
    checkClaimStart
};