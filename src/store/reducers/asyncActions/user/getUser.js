import { doc, getDoc } from "firebase/firestore";
import {fetchUserAction} from "../../userReducer";
import {db} from "../../../../firebase";

export const fetchUser = (id) => {
    return async function(dispatch) {
        const docRef = doc(db, "users", "user_" + id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            dispatch(fetchUserAction(docSnap.data()))
        }
    }
}