import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {doc, updateDoc} from "firebase/firestore";
import {Box, Button, Chip} from "@mui/material";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import relativeTime from "dayjs/plugin/relativeTime";
import {db} from "../../../firebase";

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
            p: 1, mb: 2, display: "flex", flexDirection: "column", gap: 1,
            borderBottom: "1px solid #333",
            alignItems: "flex-start",
            boxShadow: "2px 2px 0 rgba(0,0,0, 0.75)",
            borderRadius: 2,
            border: "1px solid #333"
        }}>
            <Box sx={{ width: "100%", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <Chip
                        clickable
                        icon={isLiked ? <FavoriteIcon sx={{ color: "red !important", fontSize: 12 }} /> :
                            <FavoriteBorderIcon sx={{ fontSize: 12 }} />}
                        label={<p>{comment.likes.toLocaleString()}</p>}
                        onClick={handleLike}
                    />
                </Box>
                <p>{dayjs(comment.timestamp).fromNow()} by {comment.user}</p>
                {user.id === comment.user_id &&
                    <Button onClick={handleRemove} sx={{ minWidth: 0 }}>
                        <DeleteIcon sx={{ fontSize: 18, color: "#333", }} />
                    </Button>
                }
            </Box>

            <article style={{
                backgroundColor: "rgba(0,0,0, 0.08)",
                padding: 4,
                borderRadius: 4
            }}>
                {comment.body}
            </article>
        </Box>
    );
};

export default Comment;