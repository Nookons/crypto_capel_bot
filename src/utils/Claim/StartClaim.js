import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";
import removeClaim from "./RemoveClaim";

const startClaim = async ({ currentItem, user }) => {
    if (currentItem.isClaim) {
        const id = currentItem.id
        removeClaim({id, user})
        const userRef = doc(db, "users", "user_" + user.id);
        const timestamp = dayjs().valueOf();  // Current timestamp in milliseconds

        const hours = currentItem.claim_time.h; // Часы из claim_time
        const minutes = currentItem.claim_time.m; // Минуты из claim_time

        const claimTimeMs = (hours) * 3600000 + minutes * 60000;
        const endClaim = timestamp + claimTimeMs;

        const template = {
            updateTime: timestamp,
            id: currentItem.id,
            project: currentItem.name,
            startClaim: timestamp,
            endClaim: endClaim
        };

        await updateDoc(userRef, { claim: arrayUnion(template) });
    } else {
        alert("Этот проект не имеет какого-то клейм тайма")
    }
}

export default startClaim;
