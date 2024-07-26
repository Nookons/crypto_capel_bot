import dayjs from "dayjs";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";

const addComment = async ({ user, value, currentItem }) => {
    const ref = doc(db, "projects", currentItem.id.toString());

    const newComment = {
        comment_id: `${dayjs().valueOf()}_${user.id}`,
        timestamp: dayjs().valueOf(),
        createDate: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm"),
        body: value,
        likes: 0,
        dislike: 0,
        user: user.username,
        user_id: user.id,
        childes: [],
        likedBy: [],
        dislikeBy: []
    };

    await updateDoc(ref, { comments: arrayUnion(newComment) });
};

export default addComment;
