import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const addCommentLike = async ({ user, currentItem, parentCommentId }) => {
    if (!user || !currentItem || !parentCommentId) {
        console.error("Missing required parameters");
        return;
    }

    const ref = doc(db, "projects", currentItem.id.toString());

    try {
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            const data = docSnap.data();

            const updateComments = (comments) => {
                return comments.map(comment => {
                    if (comment.comment_id === parentCommentId) {
                        const old = comment.likes || 0;
                        const dislikeOld = comment.dislike || 0;

                        return {
                            ...comment,
                            likes: old + 1,
                            dislike: comment.dislikeBy.includes(user.id) ? dislikeOld - 1 : dislikeOld,
                            likedBy: [...(comment.likedBy || []), user.id],
                            dislikeBy: (comment.dislikeBy || []).filter(item => item !== user.id)
                        };
                    } else if (Array.isArray(comment.childes) && comment.childes.length > 0) {
                        return {
                            ...comment,
                            childes: updateComments(comment.childes)
                        };
                    }
                    return comment;
                });
            };

            const updatedComments = updateComments(data.comments);
            await updateDoc(ref, { comments: updatedComments });
        }
    } catch (error) {
        console.error("Error adding like: ", error);
    }
};

export default addCommentLike;
