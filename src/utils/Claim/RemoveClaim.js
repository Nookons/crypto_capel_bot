import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";

const removeClaim = async ({ id, user }) => {
    const userRef = doc(db, "users", "user_" + user.id);
    const timestamp = dayjs().valueOf();  // Current timestamp in milliseconds

    // Фильтруем элементы, чтобы оставить только те, которые не совпадают с указанным id
    const updatedClaims = user.claim.filter(item => item.id !== id);

    // Обновляем документ пользователя в Firestore
    await updateDoc(userRef, {
        claim: updatedClaims,
        updateTime: timestamp
    });
}

export default removeClaim;
