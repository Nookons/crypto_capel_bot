import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../../firebase";
import {fetchProjectDataAction} from "../../Main";

export const fetchMainData = () => {
    return function(dispatch) {
        const docRef = doc(db, "config", "version" );

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                dispatch(fetchProjectDataAction(docSnap.data()));
            } else {
                console.log("No such document!");
            }
        }, (error) => {
            console.error("Error fetching user document: ", error);
        });

        return unsubscribe;
    };
};
