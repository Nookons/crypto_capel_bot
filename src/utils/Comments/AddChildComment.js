import dayjs from "dayjs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const addReplyToComment = async ({ user, value, currentItem, parentCommentId }) => {
    if (!user || !value || !currentItem || !parentCommentId) {
        console.error("Missing required parameters");
        return;
    }

    const ref = doc(db, "projects", currentItem.id.toString());

    const newReply = {
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

    try {
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            const data = docSnap.data();

            const updateComments = (comments) => {
                return comments.map(comment => {
                    if (comment.comment_id === parentCommentId) {
                        const old = comment.comments_count || 0
                        return {
                            ...comment,
                            comments_count: old + 1,
                            childes: [...(comment.childes || []), newReply]
                        };
                    } else if (Array.isArray(comment.childes) && comment.childes.length > 0) {
                        const old = comment.comments_count || 0
                        return {
                            ...comment,
                            comments_count: old + 1,
                            childes: updateComments(comment.childes)
                        };
                    }
                    return comment;
                });
            };

            const updatedComments = updateComments(data.comments);

            await updateDoc(ref, { comments: updatedComments });
            console.log("Reply added successfully");
        } else {
            console.error("Document does not exist");
        }
    } catch (error) {
        console.error("Error adding reply: ", error);
    }
};

export default addReplyToComment;
