import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, IconButton,
    Skeleton
} from "@mui/material";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {Add} from "@mui/icons-material";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';

import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import {useDispatch, useSelector} from "react-redux";
import {addToFavoriteAction, removeFromFavoriteAction} from "../../store/reducers/userReducer";
import {addToFavorite, removeFromFavorite} from "../../store/reducers/asyncActions/user/Favorite";

const MyDialog = ({dialog, setDialog}) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch();

    const [isFavorite, setIsFavorite] = useState(false);

    const [currentItem, setCurrentItem] = useState({
        isLoading: false,
        item: null,
        error: "",
    });

    useEffect(() => {
        if (currentItem.item && currentItem.item.id) {
            const isFavorite = user.favorite.includes(currentItem.item.id);

            console.log(isFavorite);

            if (isFavorite) {
                setIsFavorite(true);
            } else {
                setIsFavorite(false);
            }
        }
    }, [user.favorite, currentItem.item]);





    useEffect(() => {
        async function getItem() {
            setCurrentItem((prevState) => ({...prevState, isLoading: true}))

            try {
                const docRef = doc(db, "projects", dialog.name);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCurrentItem({isLoading: false, item: docSnap.data(), error: ""})
                }
            } catch (error) {
                setCurrentItem({isLoading: false, item: null, error: error.toString()})
            }
        }

        if (dialog.name) {
            getItem();
        }
    }, [dialog]);

    const onClose = () => {
        setDialog({isOpen: false, id: 0})
        setTimeout(() => {
            setCurrentItem({
                isLoading: false,
                item: null,
                error: "",
            })
        }, 250)
    }

    const onAddLike = async () => {
        alert("Coming soon...")
    }

    const onAddFavorite = async () => {
        const id = currentItem.item.id;
        dispatch(addToFavorite({id, user}))
    }

    const onRemoveFromFavorite = async () => {
        const id =  currentItem.item.id
        dispatch(removeFromFavorite({id, user}))
    }

    const onStartClick = () => {
        window.location.href = currentItem.item.link
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
                    sx={{fontSize: 14}}/> {currentItem.item?.likes.toLocaleString()}</p>

                {currentItem.item
                    ? <Avatar src={currentItem?.item.imgPath} variant={"rounded"}
                              sx={{width: "100%", height: 125, my: 2}}>N</Avatar>
                    : <Skeleton variant="rectangular" width={"100%"} height={125}/>
                }
                {currentItem.item ? <h4>{currentItem.item.name} </h4> : <Skeleton variant="text"/>}
            </DialogTitle>
            <DialogContent>
                {currentItem.item ? <p>{currentItem.item.description}</p> :
                    <Skeleton variant="rectangular" width={250} height={150}/>}
            </DialogContent>
            <DialogActions>
                <IconButton onClick={onAddLike} aria-label="add">
                    <FavoriteBorderIcon sx={{fontSize: 24}}/>
                </IconButton>
                {
                    isFavorite
                        ?
                        <IconButton onClick={onRemoveFromFavorite} aria-label="remove">
                            <BookmarkRemoveIcon sx={{fontSize: 24, color: "red"}}/>
                        </IconButton>
                        :
                        <IconButton onClick={onAddFavorite} aria-label="add">
                            <BookmarkAddIcon sx={{fontSize: 24}}/>
                        </IconButton>
                }

                {currentItem.item
                    ?
                    <IconButton sx={{color: "green"}} onClick={onStartClick} aria-label="add">
                        <PlayCircleFilledIcon sx={{fontSize: 44}}/>
                    </IconButton>
                    : <Skeleton variant="rectangular" width={95} height={25}/>}
            </DialogActions>
        </Dialog>
    )
};

export default MyDialog;