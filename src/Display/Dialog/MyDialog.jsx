import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, IconButton,
    Skeleton
} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import {useDispatch, useSelector} from "react-redux";
import {addToFavorite, removeFromFavorite} from "../../store/reducers/asyncActions/user/Favorite";
import {addUserLike, removeUserLike} from "../../store/reducers/asyncActions/project/Likes";
import AddCommentIcon from '@mui/icons-material/AddComment';

const MyDialog = ({dialog, setDialog}) => {
    const user = useSelector(state => state.user)
    const projects = useSelector(state => state.projects)
    const dispatch = useDispatch();

    const [isFavorite, setIsFavorite]   = useState(false);
    const [isLiked, setIsLiked]         = useState(false);

    const [currentItem, setCurrentItem] = useState(null);

    useEffect(() => {
        if (currentItem && currentItem.id) {
            const isFavorite = user.favorite.includes(currentItem.id);
            const isLiked = currentItem.userLiked.includes(user.id);

            setIsFavorite(isFavorite);
            setIsLiked(isLiked)
        }
    }, [user.favorite, currentItem]);

    useEffect(() => {
        if (projects) {
            const founded = projects.find(item => item.id === dialog.id)
            setCurrentItem(founded)
        }
    }, [dialog, projects]);

    const onClose = () => {
        setCurrentItem(null)
        setDialog({isOpen: false, id: 0})
    }

    const onAddLike = async () => {
        const data = currentItem;
        dispatch(addUserLike({data, user}))
    }

    const onRemoveLike = async () => {
        const data = currentItem;
        dispatch(removeUserLike({data, user}))
    }

    const onAddFavorite = async () => {
        const id = currentItem.id;
        dispatch(addToFavorite({id, user}))
    }

    const onRemoveFromFavorite = async () => {
        const id =  currentItem.id
        dispatch(removeFromFavorite({id, user}))
    }

    const onStartClick = () => {
        onClose();
        window.location.href = currentItem.link
    }

    return (
        <Dialog
            open={dialog.isOpen}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={"xs"}>
            <DialogTitle id="alert-dialog-title">
                <p style={{color: "gray", display: "flex", alignItems: "center", gap: 6}}><ThumbUpIcon
                    sx={{fontSize: 14}}/> {currentItem ? currentItem?.likes.toLocaleString() : 0}</p>

                {currentItem
                    ? <Avatar src={currentItem?.imgPath} variant={"rounded"}
                              sx={{width: "100%", height: 125, my: 2}}>N</Avatar>
                    : <Skeleton variant="rectangular" width={"100%"} height={125}/>
                }
                {currentItem ? <h4>{currentItem.name} </h4> : <Skeleton variant="text"/>}
            </DialogTitle>
            <DialogContent>
                {currentItem ? <p>{currentItem.description}</p> :
                    <Skeleton variant="rectangular" width={250} height={150}/>}
            </DialogContent>
            <DialogActions>
                {
                    isLiked
                        ?
                        <IconButton onClick={onRemoveLike} aria-label="remove">
                            <FavoriteIcon sx={{fontSize: 24, color: "#67bfff"}}/>
                        </IconButton>
                        :
                        <IconButton onClick={onAddLike} aria-label="add">
                            <FavoriteBorderIcon sx={{fontSize: 24}}/>
                        </IconButton>
                }
                {
                    isFavorite
                        ?
                        <IconButton onClick={onRemoveFromFavorite} aria-label="remove">
                            <BookmarkRemoveIcon sx={{fontSize: 24, color: "#67bfff"}}/>
                        </IconButton>
                        :
                        <IconButton onClick={onAddFavorite} aria-label="add">
                            <BookmarkAddIcon sx={{fontSize: 24}}/>
                        </IconButton>
                }

                <IconButton onClick={() => alert("coming soon... 🙈")} aria-label="add">
                    <AddCommentIcon sx={{fontSize: 24}}/>
                </IconButton>

                {currentItem
                    ?
                    <IconButton sx={{color: "green"}} onClick={onStartClick} aria-label="add">
                        <PlayCircleFilledIcon sx={{fontSize: 44}}/>
                    </IconButton>
                    : <Skeleton variant="rectangular" width={95} height={25}/>
                }
            </DialogActions>
        </Dialog>
    )
};

export default MyDialog;