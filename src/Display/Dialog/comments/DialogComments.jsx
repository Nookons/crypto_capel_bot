import React, { useEffect, useState } from 'react';
import MyButton from "../../../components/MyButton";
import Comment from "./Comment";



const DialogComments = ({ currentItem }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (currentItem && currentItem.comments) {
            const sorted = currentItem.comments.sort((a, b) => b.timestamp - a.timestamp);
            setComments(sorted);
        } else {
            setComments([]);
        }
    }, [currentItem]);

    const handleCommentUpdate = (updatedComment, commentId) => {
        setComments((prevComments) => {
            if (updatedComment) {
                return prevComments.map((comment) =>
                    comment.comment_id === updatedComment.comment_id ? updatedComment : comment
                );
            } else {
                return prevComments.filter(comment => comment.comment_id !== commentId);
            }
        });
    };

    if (!comments.length) {
        return <MyButton>Пока здесь нет ни одного комментария 😰</MyButton>;
    }

    return (
        <div>
            {comments.map((comment) => (
                <Comment key={comment.comment_id} comment={comment} currentItem={currentItem} onCommentUpdate={handleCommentUpdate} />
            ))}
        </div>
    );
};

export default DialogComments;
