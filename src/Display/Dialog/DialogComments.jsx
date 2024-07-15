import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import MyButton from "../../components/MyButton";

import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Chip } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

// Инициализация плагина relativeTime
dayjs.extend(relativeTime);

const Comment = ({ comment, currentItem, onCommentUpdate }) => {
    const user = useSelector(state => state.user);

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        setIsLiked(comment.likedBy?.includes(user.id));
    }, [comment, user.id]);

    const handleLike = async () => {
        const newLikes = isLiked ? comment.likes - 1 : comment.likes + 1;
        setIsLiked(!isLiked);

        const updatedComment = {
            ...comment,
            likes: newLikes,
            likedBy: isLiked ? comment.likedBy.filter(id => id !== user.id) : [...comment.likedBy, user.id]
        };

        const ref = doc(db, "projects", currentItem.id.toString());

        await updateDoc(ref, {
            comments: currentItem.comments.map((item) =>
                item.comment_id === comment.comment_id ? updatedComment : item
            )
        });

        onCommentUpdate(updatedComment);
    };

    const handleRemove = async () => {
        const ref = doc(db, "projects", currentItem.id.toString());

        await updateDoc(ref, {
            comments: currentItem.comments.filter((item) => item.comment_id !== comment.comment_id)
        });

        onCommentUpdate(null, comment.comment_id);
    };

    return (
        <Box sx={{
            p: 1, mb: 2, display: "flex", flexDirection: "column", gap: 2,
            borderBottom: "1px solid #333",
            alignItems: "flex-start",
            boxShadow: "2px 2px 0 rgba(0,0,0, 0.75)",
            borderRadius: 2,
            border: "1px solid #333"
        }}>
            <Box sx={{ width: "100%", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>{dayjs(comment.timestamp).fromNow()} by {comment.user}</p>
                {user.id === comment.user_id &&
                    <Button onClick={handleRemove} sx={{ minWidth: 0 }}>
                        <DeleteIcon sx={{ fontSize: 18, color: "#333", }} />
                    </Button>}
            </Box>
            <article>{comment.body}</article>
            <Chip
                clickable
                icon={isLiked ? <FavoriteIcon sx={{ color: "red !important", fontSize: 16 }} /> :
                    <FavoriteBorderIcon sx={{ fontSize: 16 }} />}
                label={<p>{comment.likes.toLocaleString()}</p>}
                onClick={handleLike}
            />
            {comment.childsComments && comment.childsComments.length > 0 && (
                <Box sx={{ ml: 1 }}>
                    {comment.childsComments.map((childComment) => (
                        <Comment key={childComment.comment_id} comment={childComment} currentItem={currentItem} onCommentUpdate={onCommentUpdate} />
                    ))}
                </Box>
            )}
        </Box>
    );
};

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
