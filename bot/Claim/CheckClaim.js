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
                            console.log("Время пришло");

                            const projRef = doc(db, "projects", need.id.toString());
                            const docSnap = await getDoc(projRef);

                            // Construct the reference to the user document
                            const updateRef = doc(db, "users", "user_" + user.id);

                            // Read the current data from Firestore
                            const userSnap = await getDoc(updateRef);
                            if (userSnap.exists()) {
                                let userData = userSnap.data();

                                // Check if the projects array exists
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
                                                } else {
                                                    console.log("No such document!");
                                                }
                                                return { ...project, isShowed: true };
                                            }
                                        }
                                        return project;
                                    });

                                    // Update the document in Firestore
                                    await updateDoc(updateRef, {
                                        claim: userData.projects,
                                        capital: true
                                    });

                                    console.log("Project updated successfully!");
                                } else {
                                    console.error("No projects array found in the document");
                                }
                            } else {
                                console.error("No such document!");
                            }

                        } else {
                            console.log("Время не пришло");
                            // here need logic to send alert what claim time is soon
                        }
                    }
                }
            }
        }
    });
};

const checkClaimStart = (bot) => {
    // Проверяем каждые 60 секунд
    setInterval(() => {
        setupRealTimeListeners(bot);
    }, 60000);
};

module.exports = {
    checkClaimStart
};