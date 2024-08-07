import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { fetchUserAction } from "../../userReducer";
import { db } from "../../../../firebase";

export const fetchUser = (id) => {
    return function(dispatch) {
        const docRef = doc(db, "users", "user_" + id);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                dispatch(fetchUserAction(docSnap.data()));
            } else {
                console.log("No such document!");
            }
        }, (error) => {
            console.error("Error fetching user document: ", error);
        });

        return unsubscribe;
    };
};
