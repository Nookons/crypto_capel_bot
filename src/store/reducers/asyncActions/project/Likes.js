import {doc, setDoc, updateDoc} from "firebase/firestore";
import {db} from "../../../../firebase";
import {addToFavoriteAction, removeFromFavoriteAction} from "../../userReducer";
import {addLikeAction, removeLikeAction} from "../../projectsReducer";

export const addUserLike = ({data, user}) => {
    return async function (dispatch) {
        const id = data.id;
        const ref = doc(db, "projects", data.id);

        await setDoc(ref, {...data, likes: data.likes + 1, userLiked: [...data.userLiked, user.id]});

        dispatch(addLikeAction(id))
    }
}

export const removeUserLike = ({data, user}) => {
    return async function (dispatch) {
        const id = data.id;
        const ref = doc(db, "projects", data.id);

        await updateDoc(ref, {
            userLiked: data.userLiked.filter(item => item !== user.id),
            likes: data.likes - 1
        });

        dispatch(removeLikeAction(id)); // Диспетчеризация действия для удаления избранного элемента
    };
};