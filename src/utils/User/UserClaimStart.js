import dayjs from "dayjs";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const startUserClaim = async ({ user, coin }) => {
    if (!user || !user.id) {
        console.log(user);
        alert("User information is not provided");
        return;
    }

    try {
        const userRef = doc(db, "users", `user_${user.id}`);
        const currentTimestamp = dayjs().valueOf();

        const claimDurationHours = 2;
        const claimDurationMinutes = 0;

        const claimTimeMs = (claimDurationHours * 3600000) + (claimDurationMinutes * 60000);
        const endClaimTimestamp = currentTimestamp + claimTimeMs;

        const claimTemplate = {
            claim_id: `${currentTimestamp}_${user.id}`,
            startClaim: currentTimestamp,
            endClaim: endClaimTimestamp
        };

        const updatedCapelCoin = (user.capel_coin || 0) + coin;

        await updateDoc(userRef, { capel_claim: claimTemplate, capel_coin: updatedCapelCoin });

        return 200;
    } catch (error) {
        console.error("Error updating document: ", error);
        return 500;
    }
};

export default startUserClaim;
