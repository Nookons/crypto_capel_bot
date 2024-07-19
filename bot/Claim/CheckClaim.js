const {query, collection, onSnapshot, doc, getDoc} = require("firebase/firestore");
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
                            console.log("Время прошло");
                        } else {
                            console.log("Время еще не прошло");
                        }

                        const projRef = doc(db, "projects", need.id.toString());
                        const docSnap = await getDoc(projRef);

                        if (docSnap.exists()) {
                            const project = docSnap.data();
                            await bot.sendPhoto(user.id, project.imgPath, {caption: `
                            Привет, пришло время забрать монеты в ${project.name} уже как ${endClaimDate.from(dayjs(timestamp))}`
                            });
                        } else {
                            console.log("No such document!");
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