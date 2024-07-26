import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {doc, updateDoc} from "firebase/firestore";
import {
    AppBar,
    Avatar, BottomNavigation, BottomNavigationAction,
    Box, Breadcrumbs,
    Button,
    Chip, Dialog,
    Divider, Drawer,
    IconButton, Link,
    List,
    ListItem,
    ListItemText, Slide,
    Stack, TextField, Toolbar,
    Typography
} from "@mui/material";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import relativeTime from "dayjs/plugin/relativeTime";
import {db} from "../../../firebase";

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ShortTextIcon from '@mui/icons-material/ShortText';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import styles from './Comment.module.css'
import {Add, Favorite, LocationOn, Restore} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

import AddCommentIcon from '@mui/icons-material/AddComment';
import ReplyDialog from "./Reply/ReplyDialog";
import addCommentLike from "../../../utils/Comments/AddCommentLike";
import removeCommentLike from "../../../utils/Comments/RemoveCommentLike";
import unlikeComment from "../../../utils/Comments/UnLike";
import unDislikeComment from "../../../utils/Comments/UnDislike";

dayjs.extend(relativeTime);



const Comment = ({comment, currentItem, onCommentUpdate}) => {
    const user = useSelector(state => state.user);

    const [isLiked, setIsLiked] = useState(false);
    const [open, setOpen]       = React.useState(false);

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


    const onLikeComment = async () => {
        if (!comment.likedBy.includes(user.id)) {
            try {
                const parentCommentId = comment.comment_id;
                const response = await addCommentLike({user, currentItem, parentCommentId});
            } catch (err)  {
                console.log(err);
            }
        } else {
            const parentCommentId = comment.comment_id;
            const response = await unlikeComment({user, currentItem, parentCommentId});
        }
    }

    const onDislikeComment = async () => {
        if (!comment.dislikeBy.includes(user.id)) {
            try {
                const parentCommentId = comment.comment_id;
                const response = await removeCommentLike({user, currentItem, parentCommentId});
            } catch (err)  {
                console.log(err);
            }
        } else {
            const parentCommentId = comment.comment_id;
            const response = await unDislikeComment({user, currentItem, parentCommentId});
        }
    }

    return (
        <Box className={styles.Comment_body}>

            <ReplyDialog
                open={open}
                currentItem={currentItem}
                comment={comment}
                setOpen={setOpen}
            />

            <Box className={styles.Comment_header}>
                <Box className={styles.Comment_header_user_info}>
                    <Avatar sx={{w: 16, h: 16}}>N</Avatar>
                    <article>{comment.user}</article>
                    <p>{dayjs(comment.timestamp).fromNow()}</p>
                </Box>
                <Button sx={{minWidth: 0}}>
                    <MoreHorizIcon sx={{fontSize: 18, color: "#333",}}/>
                </Button>
            </Box>

            <Typography sx={{ml: 1, my: 1}} variant="subtitle1" gutterBottom component="div">
                <p>{comment.body}</p>
            </Typography>
            <Box className={styles.Comment_bottom}>
                <Stack
                    my={1}
                    sx={{border: "1px solid gray", borderRadius: 4}}
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem/>}
                    spacing={2}
                >
                    <IconButton onClick={onLikeComment} sx={{gap: 1}} aria-label="add">
                        <ArrowUpwardIcon/> <h6>{comment?.likes?.toLocaleString()}</h6>
                    </IconButton>
                    <IconButton onClick={onDislikeComment} aria-label="add">
                        <ArrowDownwardIcon/> <h6>{comment?.dislike?.toLocaleString()}</h6>
                    </IconButton>
                </Stack>
                <IconButton onClick={() => setOpen(true)} sx={{gap: 1}} aria-label="add">
                    <ShortTextIcon/> <h6>{comment?.comments_count?.toLocaleString()}</h6>
                </IconButton>
            </Box>
        </Box>
    );
};

export default Comment;