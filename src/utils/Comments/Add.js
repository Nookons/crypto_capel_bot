import dayjs from "dayjs";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";

const addComment = async ({ user, value, currentItem }) => {
    const ref = doc(db, "projects", currentItem.id.toString());

    const timestamp = dayjs().valueOf();

    const newComment = {
        comment_id: timestamp + user.id,
        timestamp: timestamp,
        createDate: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm"),
        body: value,
        likes: 0,
        user: user.username,
        user_id: user.id,
        childes: [],
        likedBy: []
    };

    await updateDoc(ref, { comments: arrayUnion(newComment) });
};

export default addComment;
