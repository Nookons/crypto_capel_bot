import {doc, getDoc, updateDoc} from "firebase/firestore";
import {addToFavoriteAction, fetchUserAction, removeFromFavoriteAction} from "../../userReducer";
import {db} from "../../../../firebase";
import {useSelector} from "react-redux";

export const addToFavorite = ({id, user}) => {
    return async function (dispatch) {
        const washingtonRef = doc(db, "users", "user_" + user.id);

        await updateDoc(washingtonRef, {
            favorite: [...user.favorite, id]
        });

        dispatch(addToFavoriteAction(id))
    }
}

export const removeFromFavorite = ({id, user}) => {
    return async function (dispatch) {
        const userDocRef = doc(db, "users", "user_" + user.id); // Путь к документу пользователя в Firestore

        await updateDoc(userDocRef, {
            favorite: user.favorite.filter(item => item !== id)
        });

        dispatch(removeFromFavoriteAction(id)); // Диспетчеризация действия для удаления избранного элемента
    };
};
